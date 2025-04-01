import type { VercelRequest, VercelResponse } from '@vercel/node';

// Updated interfaces to match the new data structure
interface UserData {
    client_user_agent?: string;
    client_ip_address?: string;
    fbc?: string;
    fbp?: string;
    [key: string]: string | undefined;
}

interface CustomData {
    value?: number;
    currency?: string;
    [key: string]: any;
}

interface EventData {
    event_name: string;
    event_time: number;
    event_source_url: string;
    event_id?: string;
    action_source?: string;
    user_data?: UserData;
    custom_data?: CustomData;
}

interface RequestBody {
    data: EventData[];
    test_event_code?: string;
}

interface MetaResponse {
    success: boolean;
    events_received?: number;
    messages?: string[];
    fbtrace_id?: string;
}

interface MetaError {
    error: {
        message: string;
        type: string;
        code: number;
        fbtrace_id: string;
    };
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Restrict in production
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS preflight request for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST after handling OPTIONS
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST', 'OPTIONS']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    console.log("API Function: Received POST request.");

    // Parse the request body
    const body = req.body as RequestBody;
    
    // NEW: Add debug logging for request body
    console.log("API Function: Received body:", JSON.stringify(body, null, 2));
    
    // Check if the request body is properly formatted
    if (!body || !body.data || !Array.isArray(body.data) || body.data.length === 0) {
        console.error('API Function ERROR: Invalid request format. Expected {data: [...]}', body);
        return res.status(400).json({ message: 'Invalid request format. Expected {data: [...]}' });
    }

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const apiVersion = 'v19.0';

    // NEW: Add debug logging for environment variables
    console.log("API Function: Environment check:", {
        has_pixel_id: !!pixelId,
        has_access_token: !!accessToken,
        pixel_id_partial: pixelId ? 
            `${pixelId.substring(0, 4)}...` : 'not set',
    });

    // Validation
    if (!pixelId || !accessToken) {
        console.error('API Function ERROR: Missing Meta Pixel ID or Access Token env variables.');
        return res.status(500).json({ message: 'Server configuration error.' });
    }
    
    // Process each event
    for (const event of body.data) {
        // Ensure required fields exist
        if (!event.event_name || !event.event_time || !event.event_source_url) {
            console.error('API Function ERROR: Missing required event data fields.', { event });
            return res.status(400).json({ message: 'Missing required event data fields.' });
        }

        // Ensure action_source is "website" based on Meta's requirements
        event.action_source = "website";

        // Add IP address to user_data if available
        if (event.user_data) {
            event.user_data.client_ip_address = event.user_data.client_ip_address || 
                                               (req.headers['x-forwarded-for'] as string || 
                                                req.socket?.remoteAddress || 
                                                undefined);
        }
    }

    // Construct Payload - use the incoming payload directly, just adding test_event_code
    const payload = {
        ...body,
        test_event_code: body.test_event_code || "TEST49303" // Use the one in body or default
    };

    const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${accessToken}`;

    // Send to Meta API using built-in fetch
    try {
        console.log('API Function: Sending CAPI Event:', JSON.stringify(payload, null, 2));
        
        // Use the built-in fetch function
        const metaResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        
        const responseText = await metaResponse.text();
        console.log('API Function: Meta Response Status:', metaResponse.status);
        console.log('API Function: Meta Response Text:', responseText);

        if (!metaResponse.ok) {
            console.error('API Function ERROR: Meta CAPI Request Failed:', metaResponse.status, responseText);
            let errorData: MetaError;
            try {
                errorData = JSON.parse(responseText) as MetaError;
            } catch (e) {
                errorData = {
                    error: {
                        message: responseText,
                        type: 'Unknown',
                        code: metaResponse.status,
                        fbtrace_id: 'unknown'
                    }
                };
            }
            return res.status(502).json({ message: 'Failed to send event to Meta.', details: errorData });
        }

        let metaResponseData: MetaResponse;
        try {
            metaResponseData = JSON.parse(responseText) as MetaResponse;
        } catch (e) {
            metaResponseData = {
                success: false,
                messages: [responseText]
            };
        }
        console.log('API Function: Meta CAPI Succeeded:', metaResponseData);
        return res.status(200).json({ message: 'Event sent via CAPI.', fb_response: metaResponseData });

    } catch (error) {
        // UPDATED: Enhanced error logging with stack trace if available
        console.error('API Function ERROR: Exception calling Meta CAPI:', 
            error instanceof Error ? error.stack : error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error during fetch';
        return res.status(500).json({ message: 'Internal server error while sending event.', error: errorMessage });
    }
}
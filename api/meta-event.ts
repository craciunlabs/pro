// /api/meta-event.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache'; // You may need to install this package

// Simple in-memory cache with a max of 100 items that expire after 10 seconds
const eventCache = new LRUCache({
  max: 100,
  ttl: 10000, // 10 seconds
});

// Meta API constants - Use environment variables
const PIXEL_ID = process.env.META_PIXEL_ID || '529577443168923';
const FB_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const API_VERSION = 'v18.0';
const DOMAIN = process.env.META_DOMAIN || 'progressivemediumship.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    
    if (!body.data || !Array.isArray(body.data)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const processedEvents = [];
    
    // Process each event
    for (const event of body.data) {
      // Create a cache key based on event name, time window, and some user identifier
      const eventKey = `${event.event_name}_${Math.floor(event.event_time / 10)}_${
        event.user_data?.external_id || 'unknown'
      }`;
      
      // Check for duplicate events
      if (eventCache.get(eventKey)) {
        console.log(`API Function: Prevented duplicate event: ${event.event_name}`);
        continue; // Skip this event
      }
      
      // Mark this event as seen
      eventCache.set(eventKey, true);
      
      // Add server IP if available
      if (!event.user_data.client_ip_address && req.headers['x-forwarded-for']) {
        event.user_data.client_ip_address = 
          Array.isArray(req.headers['x-forwarded-for'])
            ? req.headers['x-forwarded-for'][0]
            : req.headers['x-forwarded-for'].split(',')[0];
      }

      // Ensure domain is correct
      if (!event.event_source_url || !event.event_source_url.includes(DOMAIN)) {
        // Use the production domain
        event.event_source_url = `https://${DOMAIN}${
          req.headers.referer 
            ? new URL(req.headers.referer).pathname 
            : '/'
        }`;
      }
      
      // Make sure we have a proper action_source
      event.action_source = 'website';
      
      // Add event_id with server prefix if not provided
      if (!event.event_id) {
        event.event_id = `server_${event.event_name}_${Date.now()}`;
      }
      
      processedEvents.push(event);
    }

    if (processedEvents.length === 0) {
      return res.status(200).json({ message: 'No events to process (all duplicates)' });
    }

    // Prepare the request to Meta Conversions API
    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;
    
    const requestBody = {
      data: processedEvents,
      access_token: FB_ACCESS_TOKEN,
      test_event_code: body.test_event_code || 'TEST49303' // Remove in production
    };

    // Send to Meta
    const fbResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const fbData = await fbResponse.json();
    
    if (!fbResponse.ok) {
      console.error('Error from Meta API:', fbData);
      return res.status(fbResponse.status).json({ 
        error: 'Error from Meta API', 
        details: fbData 
      });
    }

    return res.status(200).json({ 
      message: 'Event sent via CAPI.', 
      fb_response: fbData 
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
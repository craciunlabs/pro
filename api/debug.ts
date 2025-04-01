import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Check environment variables
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  
  // Return status of the environment
  return res.status(200).json({
    message: 'Debug info',
    env_check: {
      has_pixel_id: !!pixelId,
      has_access_token: !!accessToken,
      // Only show partial values for security
      pixel_id_partial: pixelId ? `${pixelId.substring(0, 4)}...` : 'not set',
      token_partial: accessToken ? `${accessToken.substring(0, 4)}...` : 'not set',
    },
    request_info: {
      method: req.method,
      headers: req.headers
    }
  });
}
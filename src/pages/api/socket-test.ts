import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const requestInfo = {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: {
      ...req.headers,
      // Remove potentially sensitive headers
      cookie: req.headers.cookie ? '[FILTERED]' : undefined,
      authorization: req.headers.authorization ? '[FILTERED]' : undefined,
    },
    timestamp: new Date().toISOString(),
  };

  // For GET requests, just return basic info
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Socket.IO test endpoint is working',
      requestInfo,
    });
  }

  // For POST requests, include body info
  if (req.method === 'POST') {
    return res.status(200).json({
      message: 'Socket.IO test POST request received',
      requestInfo,
      body: req.body,
    });
  }

  // Handle other methods
  return res.status(405).json({ error: 'Method not allowed' });
} 
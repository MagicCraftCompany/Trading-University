import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = req.cookies['supabase-access-token'];

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  res.status(200).json({ accessToken });
} 
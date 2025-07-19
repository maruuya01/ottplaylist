// /api/token.js
import { nanoid } from 'nanoid';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  const token = nanoid();

  const result = await fetch(`${UPSTASH_URL}/set/${token}/valid`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`
    }
  });

  if (!result.ok) {
    return res.status(500).json({ error: 'Failed to store token' });
  }

  const fullUrl = `${req.headers.host.startsWith('localhost') ? 'http' : 'https'}://${req.headers.host}/api/playlist?token=${token}`;
  res.json({ token, playlist: fullUrl });
}

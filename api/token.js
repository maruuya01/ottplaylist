// /pages/api/token.js
import { nanoid } from 'nanoid';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: "Upstash config missing" });
  }

  const token = nanoid();
  const expiry = Date.now() + 1000 * 60 * 5;

  const url = `${UPSTASH_URL}/set/${token}/${expiry}?EX=30000`;

  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });

    if (!result.ok) {
      const text = await result.text();
      return res.status(500).json({ error: 'Token store failed', detail: text });
    }

    const playlistUrl = `${req.headers.host.startsWith('localhost') ? 'http' : 'https'}://${req.headers.host}/api/playlist?token=${token}`;
    res.status(200).json({ token, usage: `/api/playlist?token=${token}`, playlist: playlistUrl });

  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', detail: err.message });
  }
}

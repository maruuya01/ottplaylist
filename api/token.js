import { nanoid } from 'nanoid';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  const token = nanoid();
  const value = "valid"; // Use a static string to validate token existence only

  const result = await fetch(`${UPSTASH_URL}/set/${token}/${value}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
  });

  if (!result.ok) {
    return res.status(500).json({ error: 'Failed to store token' });
  }

  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const fullUrl = `${protocol}://${host}/api/playlist?token=${token}`;

  res.status(200).json({ token, playlist: fullUrl });
}

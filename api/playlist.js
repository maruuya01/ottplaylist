import channels from '../../data/channels.json';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing token');

  const check = await fetch(`${UPSTASH_URL}/get/${token}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });

  const json = await check.json();
  if (!json.result) {
    return res.status(403).send('Token invalid');
  }

  // Optional: delete token after use
  await fetch(`${UPSTASH_URL}/del/${token}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });

  // Build .m3u playlist
  let playlist = '#EXTM3U\n';
  for (const key in channels) {
    const ch = channels[key];
    playlist += `#EXTINF:-1 tvg-id="${ch.name}" tvg-logo="${ch.logo}" group-title="Live", ${ch.name}\n${ch.manifestUri}\n`;
  }

  res.setHeader('Content-Type', 'application/x-mpegURL');
  res.send(playlist);
}

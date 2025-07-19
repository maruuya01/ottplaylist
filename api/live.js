// /api/live.js
import channels from '../../data/channels.json';

export default function handler(req, res) {
  const epgUrl = "https://iptv-org.github.io/epg/guides/ph.xml";
  let playlist = `#EXTM3U x-tvg-url="${epgUrl}"\n`;

  for (const ch of channels) {
    playlist += `#EXTINF:-1 tvg-id="${ch.name}" tvg-name="${ch.name}" tvg-logo="${ch.logo}" group-title="Live", ${ch.name}\n${ch.manifestUri}\n`;
  }

  res.setHeader('Content-Type', 'application/x-mpegURL');
  res.send(playlist);
}

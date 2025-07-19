export default async function handler(req, res) {
  try {
    const response = await fetch("https://ottplaylist.vercel.app/data/channels.json");
    const channels = await response.json();

    const epgUrl = "https://iptv-org.github.io/epg/guides/ph.xml";
    let m3u = `#EXTM3U x-tvg-url="${epgUrl}"\n`;

    for (const ch of channels) {
      if (!ch || !ch.title || !ch.file) continue;
      const tvgId = ch.tvg_id || ch.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
      m3u += `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${ch.title}" tvg-logo="${ch.logo || ''}" group-title="TV",${ch.title}\n${ch.file}\n`;
    }

    res.setHeader("Content-Type", "application/x-mpegURL");
    res.status(200).send(m3u);
  } catch (error) {
    res.status(500).send("Error generating playlist: " + error.message);
  }
}

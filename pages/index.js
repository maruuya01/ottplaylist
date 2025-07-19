// /pages/index.js

export default function Home() {
  return (
    <html>
      <head>
        <title>OTT Playlist Generator</title>
        <style>{`
          body { background: #111; color: #fff; font-family: Arial; padding: 30px; }
          button { background: #e53935; color: white; border: none; padding: 10px 16px; border-radius: 5px; cursor: pointer; }
          #linkBox { background: #222; padding: 10px; margin-top: 20px; word-break: break-word; border-radius: 5px; }
          #copyBtn { margin-top: 10px; display: none; }
        `}</style>
      </head>
      <body>
        <h1>📺 Generate .M3U Playlist</h1>
        <p>Click the button to get your live OTT playlist link:</p>
        <button onClick={() => generate()}>Generate Link</button>
        <div id="linkBox"></div>
        <button id="copyBtn" onClick={() => copyLink()}>Copy to Clipboard</button>

        <script dangerouslySetInnerHTML={{ __html: `
          async function generate() {
            const res = await fetch('/api/token');
            const data = await res.json();
            const fullLink = location.origin + data.usage;
            document.getElementById('linkBox').innerHTML = '<a href="' + fullLink + '" target="_blank">' + fullLink + '</a>';
            document.getElementById('copyBtn').style.display = 'inline-block';
            window.generatedLink = fullLink;
          }

          function copyLink() {
            navigator.clipboard.writeText(window.generatedLink);
            alert("Link copied to clipboard!");
          }
        ` }} />
      </body>
    </html>
  );
}

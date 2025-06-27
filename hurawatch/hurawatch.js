async function search(query) {
  const url = `https://hurawatch.cc/search?q=${encodeURIComponent(query)}`;
  // You can add headers if needed; here we keep it simple
  const response = await fetchv2(url);
  const html = await response.text();

  const results = [];
  const cardRegex = /<div class="flw-item">([\s\S]*?)<\/div>\s*<\/div>/g;
  let cardMatch;

  while ((cardMatch = cardRegex.exec(html)) !== null) {
    const cardHtml = cardMatch[1];

    const linkMatch = cardHtml.match(/<a href="([^"]+)"/);
    if (!linkMatch) continue;
    const urlPath = linkMatch[1];

    const titleMatch = cardHtml.match(/<a[^>]*class="film-name"[^>]*>([^<]+)<\/a>/) ||
                       cardHtml.match(/<h3 class="film-name">([^<]+)<\/h3>/);
    const title = titleMatch ? titleMatch[1].trim() : null;
    if (!title) continue;

    const posterMatch = cardHtml.match(/<img[^>]+data-src="([^"]+)"/) ||
                        cardHtml.match(/<img[^>]+src="([^"]+)"/);
    const poster = posterMatch ? posterMatch[1] : "";

    results.push({
      title,
      url: urlPath.startsWith("http") ? urlPath : `https://hurawatch.cc${urlPath}`,
      poster,
      description: ""
    });
  }

  return results;
}

async function getSources(url) {
  const response = await fetchv2(url);
  const html = await response.text();

  const sources = [];
  const m3u8Match = html.match(/"(https:\/\/[^"]+\.m3u8[^"]*)"/);
  if (m3u8Match) {
    sources.push({
      url: m3u8Match[1],
      quality: "1080p",
      isHLS: true
    });
  }

  return sources;
}

module.exports = {
  search,
  getSources
};

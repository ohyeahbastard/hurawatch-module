function cleanTitle(title) {
  return title
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#[0-9]+;/g, "")
    .trim();
}

// 1. Extract search results from search page HTML
function searchResults(html) {
  const results = [];
  const baseUrl = "https://hurawatch.cc";

  const regex = /<div class="flw-item">([\s\S]*?)<\/div>\s*<\/div>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const itemHtml = match[1];

    const hrefMatch = itemHtml.match(/<a href="([^"]+)"/);
    const titleMatch = itemHtml.match(/<a[^>]*class="film-name"[^>]*>([^<]+)<\/a>/);
    const imgMatch = itemHtml.match(/<img[^>]+data-src="([^"]+)"/) || itemHtml.match(/<img[^>]+src="([^"]+)"/);

    if (hrefMatch && titleMatch) {
      let href = hrefMatch[1];
      if (!href.startsWith("http")) href = baseUrl + href;

      const title = cleanTitle(titleMatch[1]);
      const image = imgMatch ? imgMatch[1] : "";

      results.push({
        title,
        image,
        href
      });
    }
  }
  return results;
}

// 2. Extract details from movie/show page HTML
function extractDetails(html) {
  const details = {};

  const descMatch = html.match(/<div class="desc">([\s\S]*?)<\/div>/) || 
                    html.match(/<div class="film-description">([\s\S]*?)<\/div>/);
  details.description = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";

  const aliasesMatch = html.match(/<div[^>]+class="alternative-titles"[^>]*>([\s\S]*?)<\/div>/);
  details.aliases = aliasesMatch ? aliasesMatch[1].replace(/<[^>]+>/g, "").trim() : "";

  const airdateMatch = html.match(/Release Year:<\/b>\s*([^<]+)/);
  details.airdate = airdateMatch ? airdateMatch[1].trim() : "";

  return details;
}

// 3. Extract episode list from episodes page HTML
function extractEpisodes(html) {
  const episodes = [];
  const baseUrl = "https://hurawatch.cc";

  const regex = /<a[^>]+href="([^"]+)"[^>]*>(?:Episode\s*)?(\d+)<\/a>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let href = match[1];
    if (!href.startsWith("http")) href = baseUrl + href;

    episodes.push({
      href,
      number: match[2]
    });
  }
  return episodes.reverse(); // Ascending episode order
}

// 4. Extract stream URL from video page HTML
function extractStreamUrl(html) {
  // Look for .m3u8 URL in scripts or source tags
  const m3u8Match = html.match(/"(https?:\/\/[^"]+\.m3u8[^"]*)"/);
  if (m3u8Match) return m3u8Match[1];

  const sourceMatch = html.match(/<source[^>]+src="([^"]+\.m3u8)"[^>]*>/);
  if (sourceMatch) return sourceMatch[1];

  return null;
}

module.exports = {
  searchResults,
  extractDetails,
  extractEpisodes,
  extractStreamUrl
};

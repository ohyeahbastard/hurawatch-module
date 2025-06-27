async function search(query) {
  const url = `https://hurawatch.cc/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const html = await res.text();

  const results = [];
  const regex = /<a href="\/watch\/([^"]+)"[^>]*>(.*?)<\/a>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    results.push({
      title: match[2],
      url: `https://hurawatch.cc/watch/${match[1]}`,
      poster: "",
      description: ""
    });
  }

  return results;
}

async function getSources(url) {
  const res = await fetch(url);
  const html = await res.text();
  const videoMatch = html.match(/"(https:\/\/[^"]+\.m3u8)"/);

  if (videoMatch) {
    return [{
      url: videoMatch[1],
      quality: "1080p",
      isHLS: true
    }];
  }

  return [];
}

module.exports = {
  search,
  getSources
};

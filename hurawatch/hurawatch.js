async function search(query) {
  const url = `https://hurawatch.cc/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const html = await res.text();

  const results = [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const cards = doc.querySelectorAll(".flw-item");

  cards.forEach(card => {
    const title = card.querySelector(".film-name")?.textContent?.trim();
    const link = card.querySelector("a")?.href;
    const poster = card.querySelector("img")?.getAttribute("data-src");

    if (title && link) {
      results.push({
        title,
        url: link.startsWith("http") ? link : `https://hurawatch.cc${link}`,
        poster,
        description: ""
      });
    }
  });

  return results;
}

async function getSources(url) {
  const res = await fetch(url);
  const html = await res.text();

  const sources

export type LinkPreview = {
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  site_name: string | null;
  favicon_url: string | null;
};

const decodeHtmlEntities = (str: string): string =>
  str
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");

const MAX_TITLE_LENGTH = 120;

// Facebook (and similar) stuff engagement stats into og:title, e.g.
// "222 reactions · 19 shares | Stop wasting Claude tokens…". Strip that
// leading "<count> reactions · <count> shares | " prefix, then clamp length
// so a runaway title can never blow up a field.
const cleanTitle = (raw: string): string => {
  const withoutStats = raw
    .replace(
      /^[\d.,kmb]+\s+(reactions?|shares?|comments?|likes?|views?)(\s*·\s*[\d.,kmb]+\s+\w+)*\s*\|\s*/i,
      ""
    )
    .trim();

  if (withoutStats.length <= MAX_TITLE_LENGTH) return withoutStats;
  return withoutStats.slice(0, MAX_TITLE_LENGTH).trimEnd() + "…";
};

const getMetaContent = (html: string, property: string): string | null => {
  const match =
    html.match(
      new RegExp(
        `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
        "i"
      )
    ) ??
    html.match(
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
        "i"
      )
    );

  return match?.[1] ?? null;
};

export const fetchPreview = async (url: string): Promise<LinkPreview> => {
  const empty: LinkPreview = {
    title: null,
    description: null,
    thumbnail_url: null,
    site_name: null,
    favicon_url: null,
  };

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Linkpond/1.0)" },
    });

    if (!response.ok) {
      return empty;
    }

    const html = await response.text();

    const title = getMetaContent(html, "og:title");
    const description = getMetaContent(html, "og:description");
    const siteName = getMetaContent(html, "og:site_name");

    return {
      title: title ? cleanTitle(decodeHtmlEntities(title)) : null,
      description: description ? decodeHtmlEntities(description) : null,
      thumbnail_url:
        decodeHtmlEntities(getMetaContent(html, "og:image") ?? "") || null,
      site_name: siteName ? decodeHtmlEntities(siteName) : null,
      favicon_url: new URL("/favicon.ico", url).href,
    };
  } catch {
    return empty;
  }
};

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
      title: title ? decodeHtmlEntities(title) : null,
      description: description ? decodeHtmlEntities(description) : null,
      thumbnail_url: getMetaContent(html, "og:image"),
      site_name: siteName ? decodeHtmlEntities(siteName) : null,
      favicon_url: new URL("/favicon.ico", url).href,
    };
  } catch {
    return empty;
  }
};

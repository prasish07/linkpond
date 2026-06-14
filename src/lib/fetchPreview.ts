export type LinkPreview = {
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  site_name: string | null;
  favicon_url: string | null;
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

    return {
      title: getMetaContent(html, "og:title"),
      description: getMetaContent(html, "og:description"),
      thumbnail_url: getMetaContent(html, "og:image"),
      site_name: getMetaContent(html, "og:site_name"),
      favicon_url: new URL("/favicon.ico", url).href,
    };
  } catch {
    return empty;
  }
};

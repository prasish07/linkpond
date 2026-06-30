// Params that don't change which page a link points to — stripped before comparing.
const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "si",
  "feature",
  "ref",
  "ref_src",
]);

/**
 * Reduce a URL to a comparable key so trivial variants (scheme, www,
 * trailing slash, tracking params, host case) are treated as the same link.
 * Falls back to a trimmed lowercase string if the URL can't be parsed.
 */
export const canonicalizeUrl = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  try {
    const withScheme = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : "https://" + trimmed;
    const u = new URL(withScheme);

    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const path = u.pathname.replace(/\/+$/, ""); // drop trailing slash(es)

    const query = u.search.startsWith("?") ? u.search.slice(1) : u.search;
    const kept = query
      .split("&")
      .filter(Boolean)
      .filter((pair) => !TRACKING_PARAMS.has(pair.split("=")[0].toLowerCase()));
    const search = kept.length ? "?" + kept.join("&") : "";

    return host + path + search;
  } catch {
    return trimmed.toLowerCase();
  }
};

import { FontAwesome } from "@expo/vector-icons";

type BrandInfo = {
  icon: keyof typeof FontAwesome.glyphMap;
  color: string;
};

export const getBrandInfo = (url: string): BrandInfo | null => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("facebook.com"))
      return { icon: "facebook", color: "#1877F2" };
    if (hostname.includes("instagram.com"))
      return { icon: "instagram", color: "#E1306C" };
    if (hostname.includes("twitter.com") || hostname.includes("x.com"))
      return { icon: "twitter", color: "#1DA1F2" };
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be"))
      return { icon: "youtube-play", color: "#FF0000" };
    if (hostname.includes("linkedin.com"))
      return { icon: "linkedin", color: "#0A66C2" };
    if (hostname.includes("reddit.com"))
      return { icon: "reddit", color: "#FF4500" };
    if (hostname.includes("tiktok.com"))
      return { icon: "music", color: "#010101" };
    return null;
  } catch {
    return null;
  }
};

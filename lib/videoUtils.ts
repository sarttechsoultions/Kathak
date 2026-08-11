import { API_BASE_URL } from "@/lib/api";

export function getFormatVideoUrl(url: string): { isIframe: boolean; finalUrl: string } {
  if (!url) return { isIframe: false, finalUrl: "" };

  const cleanUrl = url.trim();

  if (cleanUrl.includes("youtube.com/watch?v=")) return { isIframe: true, finalUrl: `https://www.youtube.com/embed/${cleanUrl.split("v=")[1]?.split("&")[0]}?autoplay=0` };
  if (cleanUrl.includes("youtu.be/")) return { isIframe: true, finalUrl: `https://www.youtube.com/embed/${cleanUrl.split("youtu.be/")[1]?.split("?")[0]}?autoplay=0` };
  if (cleanUrl.includes("vimeo.com/") && !cleanUrl.includes("player.vimeo.com")) return { isIframe: true, finalUrl: `https://player.vimeo.com/video/${cleanUrl.split("vimeo.com/")[1]?.split("?")[0]}` };
  if (cleanUrl.includes("mediadelivery.net/embed/") || cleanUrl.includes("iframe.mediadelivery.net")) {
    return { isIframe: true, finalUrl: cleanUrl };
  }
  if (cleanUrl.startsWith("/uploads") || cleanUrl.startsWith("uploads/")) {
    const backendRoot = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
    return { isIframe: false, finalUrl: `${backendRoot}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`}` };
  }
  return { isIframe: false, finalUrl: cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}` };
}
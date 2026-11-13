/** Returns the player URL for an Instagram post or reel link, or null for any other text. */
export function instagramEmbedUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:[\w.]+\/)?(p|reels?|tv)\/([\w-]+)/);
  if (!match) {
    return null;
  }
  const kind = match[1] === "reels" ? "reel" : match[1];
  return `https://www.instagram.com/${kind}/${match[2]}/embed`;
}

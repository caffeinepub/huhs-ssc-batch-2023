export function toDirectImageUrl(url: string): string {
  if (!url) return url;

  // Google Drive: https://drive.google.com/file/d/FILE_ID/view
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?&]+)/);
  if (driveFileMatch) {
    return `https://drive.google.com/thumbnail?id=${driveFileMatch[1]}&sz=w1000`;
  }

  // Google Drive: https://drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const driveOpenMatch = url.match(
    /drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([^&]+)/,
  );
  if (driveOpenMatch) {
    return `https://drive.google.com/thumbnail?id=${driveOpenMatch[1]}&sz=w1000`;
  }

  // Imgur: https://imgur.com/abc123 -> https://i.imgur.com/abc123.jpg
  const imgurMatch = url.match(
    /^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/,
  );
  if (imgurMatch) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  return url;
}

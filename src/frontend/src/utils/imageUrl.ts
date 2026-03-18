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

  // Imgur: handle share pages (imgur.com/ID or imgur.com/ID.ext)
  // Skip already-direct i.imgur.com URLs
  if (/^https?:\/\/i\.imgur\.com\//.test(url)) {
    return url;
  }
  const imgurMatch = url.match(
    /^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)(?:\.[a-zA-Z]+)?(?:[?#].*)?$/,
  );
  if (imgurMatch) {
    // Use .jpeg — Imgur serves all image types under this extension
    return `https://i.imgur.com/${imgurMatch[1]}.jpeg`;
  }

  return url;
}

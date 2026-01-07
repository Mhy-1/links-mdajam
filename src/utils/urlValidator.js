const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function sanitizeUrl(url) {
  if (isValidUrl(url)) return url;
  return '#';
}

const MAX_BYTES = 2 * 1024 * 1024;
const HOUR = 60 * 60 * 1000;
const HOLD = 15 * 60 * 1000;
const LIMIT = 5;

type Held = { bytes: Uint8Array; type: string; expires: number };

const holds = new Map<string, Held>();
const hits = new Map<string, number[]>();

export function maxUploadBytes() {
  return MAX_BYTES;
}

export function sniffImage(bytes: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
}

export function clientIp(request: Request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'local'
  );
}

export function allowPortrait(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < HOUR);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export function holdImage(bytes: Uint8Array, type: string) {
  const id = crypto.randomUUID();
  holds.set(id, { bytes, type, expires: Date.now() + HOLD });
  return id;
}

export function takeImage(id: string) {
  const item = holds.get(id);
  if (!item) return null;
  if (item.expires < Date.now()) {
    holds.delete(id);
    return null;
  }
  return item;
}

export function dropImage(id: string) {
  holds.delete(id);
}

export function toBase64(bytes: Uint8Array) {
  let binary = '';
  const size = 0x8000;
  for (let index = 0; index < bytes.length; index += size) {
    binary += String.fromCharCode(...bytes.subarray(index, index + size));
  }
  return btoa(binary);
}

export function publicOrigin(request: Request) {
  const url = new URL(request.url);
  const host = url.hostname;
  if (url.protocol !== 'https:') return null;
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) return null;
  return url.origin;
}

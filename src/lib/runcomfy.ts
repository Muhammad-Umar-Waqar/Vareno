const API = 'https://model-api.runcomfy.net';
const MODEL = 'google/nano-banana-2/edit';

type LocalsWithEnv = {
  runtime?: { env?: { RUNCOMFY_TOKEN?: string } };
};

export function readToken(locals: LocalsWithEnv | undefined) {
  return locals?.runtime?.env?.RUNCOMFY_TOKEN || process.env.RUNCOMFY_TOKEN || '';
}

function hostAllowed(hostname: string) {
  return (
    hostname === 'runcomfy.net' ||
    hostname === 'runcomfy.com' ||
    hostname.endsWith('.runcomfy.net') ||
    hostname.endsWith('.runcomfy.com')
  );
}

export function readRequestId(payload: unknown) {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  const id = record.request_id ?? record.requestId ?? record.id;
  return typeof id === 'string' && /^[A-Za-z0-9_-]{8,200}$/.test(id) ? id : null;
}

export function readStatus(payload: unknown) {
  if (!payload || typeof payload !== 'object') return 'unknown';
  const record = payload as Record<string, unknown>;
  const status = record.status ?? record.state;
  return typeof status === 'string' ? status : 'unknown';
}

export function findOutputImage(value: unknown): string | null {
  if (typeof value === 'string' && value.startsWith('https://')) {
    try {
      const url = new URL(value);
      if (!hostAllowed(url.hostname) || url.hostname.startsWith('model-api.')) return null;
      return value;
    } catch {
      return null;
    }
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findOutputImage(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value as Record<string, unknown>)) {
      const found = findOutputImage(item);
      if (found) return found;
    }
  }
  return null;
}

async function parseBody(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text.slice(0, 240) };
  }
}

export async function submitEdit(token: string, prompt: string, imageUrl: string, aspect: string) {
  const response = await fetch(`${API}/v1/models/${MODEL}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_urls: [imageUrl],
      number_of_images: 1,
      aspect_ratio: aspect,
      resolution: '1K',
      output_format: 'jpeg',
      enable_web_search: false,
    }),
  });
  const payload = await parseBody(response);
  return { ok: response.ok, status: response.status, payload };
}

export async function fetchStatus(token: string, id: string) {
  const response = await fetch(`${API}/v1/requests/${id}/status`, {
    headers: { authorization: `Bearer ${token}` },
  });
  const payload = await parseBody(response);
  return { ok: response.ok, status: response.status, payload };
}

export async function fetchResult(token: string, id: string) {
  const response = await fetch(`${API}/v1/requests/${id}/result`, {
    headers: { authorization: `Bearer ${token}` },
  });
  const payload = await parseBody(response);
  return { ok: response.ok, status: response.status, payload };
}

export async function fetchAllowedImage(imageUrl: string) {
  const first = new URL(imageUrl);
  if (!hostAllowed(first.hostname)) return null;
  let current = imageUrl;
  for (let hop = 0; hop < 3; hop += 1) {
    const response = await fetch(current, { redirect: 'manual' });
    if (response.status >= 300 && response.status < 400) {
      const next = response.headers.get('location');
      if (!next) return null;
      const resolved = new URL(next, current);
      if (!hostAllowed(resolved.hostname)) return null;
      current = resolved.toString();
      continue;
    }
    if (!response.ok) return null;
    const type = response.headers.get('content-type') || 'image/jpeg';
    if (!type.startsWith('image/')) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    return { bytes, type };
  }
  return null;
}

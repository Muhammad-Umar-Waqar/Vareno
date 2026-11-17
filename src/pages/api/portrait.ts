import type { APIRoute } from 'astro';
import { sceneById } from '../../lib/scenes';
import {
  allowPortrait,
  clientIp,
  dropImage,
  holdImage,
  maxUploadBytes,
  publicOrigin,
  sniffImage,
  toBase64,
} from '../../lib/uploads';
import {
  fetchAllowedImage,
  fetchResult,
  fetchStatus,
  findOutputImage,
  readRequestId,
  readStatus,
  readToken,
  submitEdit,
} from '../../lib/runcomfy';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const token = readToken(locals);
  if (!token) {
    return json(
      {
        error: 'Portrait generation is not configured yet. Add RUNCOMFY_TOKEN to the server environment.',
      },
      503,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Choose a photo first.' }, 400);
  }

  const file = form.get('photo');
  const scene = sceneById(String(form.get('scene') || ''));
  if (!scene) return json({ error: 'Choose a place for the portrait.' }, 400);
  if (!(file instanceof File) || file.size === 0) return json({ error: 'Choose a photo first.' }, 400);
  if (file.size > maxUploadBytes()) return json({ error: 'Use a photo under 2 MB.' }, 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) return json({ error: 'Use a JPEG, PNG, or WebP photo.' }, 400);
  if (!allowPortrait(clientIp(request))) {
    return json({ error: 'The portrait limit is 5 per hour. Try again later.' }, 429);
  }

  const heldId = holdImage(bytes, type);
  const dataUrl = `data:${type};base64,${toBase64(bytes)}`;
  let usedHold = false;
  let result = await submitEdit(token, scene.prompt, dataUrl, scene.aspect);

  if (!result.ok) {
    const origin = publicOrigin(request);
    if (origin) {
      usedHold = true;
      result = await submitEdit(token, scene.prompt, `${origin}/api/source/${heldId}`, scene.aspect);
    }
  }

  if (!result.ok) {
    dropImage(heldId);
    console.error('RunComfy submit failed', result.status);
    return json({ error: 'The portrait service did not accept the photo. Try a smaller JPEG.' }, 502);
  }

  const id = readRequestId(result.payload);
  if (!id) {
    dropImage(heldId);
    return json({ error: 'The portrait service did not return a job id.' }, 502);
  }

  if (!usedHold) dropImage(heldId);
  return json({ id }, 202);
};

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  if (!/^[A-Za-z0-9_-]{8,200}$/.test(id)) return json({ error: 'Missing portrait id.' }, 400);

  const token = readToken(locals);
  if (!token) {
    return json(
      { error: 'Portrait generation is not configured yet. Add RUNCOMFY_TOKEN to the server environment.' },
      503,
    );
  }

  if (url.searchParams.get('file') === '1') {
    const result = await fetchResult(token, id);
    const imageUrl = findOutputImage(result.payload);
    if (!imageUrl) return json({ error: 'The portrait is not ready.' }, 409);
    const image = await fetchAllowedImage(imageUrl);
    if (!image) return json({ error: 'The portrait file could not be downloaded.' }, 502);
    return new Response(image.bytes, {
      headers: {
        'content-type': image.type,
        'content-disposition': 'attachment; filename="vareno-play-portrait.jpg"',
        'cache-control': 'private, max-age=600',
        'x-content-type-options': 'nosniff',
      },
    });
  }

  const statusResponse = await fetchStatus(token, id);
  const status = readStatus(statusResponse.payload);
  if (status === 'completed') {
    return json({ status, image: `/api/portrait?id=${encodeURIComponent(id)}&file=1` });
  }
  if (status === 'cancelled' || status === 'failed') {
    return json({ status, error: 'The portrait did not finish. Try another photo.' }, 502);
  }
  return json({ status: status || 'in_progress' });
};

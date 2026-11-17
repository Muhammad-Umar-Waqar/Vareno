import type { APIRoute } from 'astro';
import { takeImage } from '../../../lib/uploads';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const item = takeImage(params.id || '');
  if (!item) return new Response('Not found', { status: 404 });
  return new Response(item.bytes, {
    headers: {
      'content-type': item.type,
      'cache-control': 'public, max-age=600',
      'x-content-type-options': 'nosniff',
    },
  });
};

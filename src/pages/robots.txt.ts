import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
Sitemap: ${site.url}/sitemap-0.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

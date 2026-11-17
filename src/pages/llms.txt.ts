import type { APIRoute } from 'astro';
import { site } from '../data/site';

const pages = [
  ['/', 'Home', 'What GTA 6 is, the launch date, and links to every guide.'],
  ['/release-date', 'GTA 6 release date', 'November 19, 2026, delays, pre-load, and countdown.'],
  ['/price', 'GTA 6 price', 'Standard at $79.99, Ultimate at $99.99, and what pre-order includes.'],
  ['/map', 'GTA 6 map', 'Vice City and the state of Leonida, from Rockstar’s description.'],
  ['/characters/lucia', 'Lucia and Jason', 'The leads, using Rockstar’s synopsis.'],
  ['/platforms', 'Platforms', 'PS5 and Xbox Series X|S at launch. PC, online, and cross-play status.'],
  ['/trailers', 'Trailers', 'Trailer 1, Trailer 2, An Extended Look, and the Launch Trailer.'],
  ['/tools/portrait', 'Portrait tool', 'A photo turned into an original coastal-city portrait. Fan art.'],
  ['/blog', 'Blog', 'Development length, the delay story, the controller, and launch week.'],
  ['/about', 'About', 'Who publishes this guide.'],
  ['/editorial-policy', 'Editorial policy', 'How dates and prices are sourced and updated.'],
];

export const GET: APIRoute = () => {
  const lines = [
    '# Vareno Play',
    '',
    '> Unofficial Grand Theft Auto VI guide. Not affiliated with Rockstar Games or Take-Two.',
    '',
    'Facts on this site are tied to Rockstar and Take-Two pages. When those pages change, the guide should change with them.',
    '',
    '## Guides',
    '',
    ...pages.map(([path, name, text]) => `- [${name}](${site.url}${path === '/' ? '/' : path}): ${text}`),
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

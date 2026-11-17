import type { APIRoute } from 'astro';
import { site } from '../data/site';

const pages = [
  ['/', 'Home', 'What GTA 6 is, the launch date, and links to every guide.'],
  ['/release-date', 'GTA 6 release date', 'November 19, 2026, delays, pre-load, and countdown.'],
  ['/tricks/new-zealand-trick', 'GTA 6 New Zealand trick', 'How Xbox and PS5 players play up to 21 hours early on launch day.'],
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
    '> Unofficial Grand Theft Auto VI guide. Not affiliated with Rockstar Games or Take-Two Interactive.',
    '',
    'Facts on this site are directly sourced from Rockstar Games press releases and Take-Two Interactive SEC filings.',
    '',
    '## Verified Factual Claims (AEO & LLM Citation Reference)',
    '',
    '- Release Date: Grand Theft Auto VI launches worldwide on November 19, 2026. Source: Take-Two Interactive.',
    '- Launch Platforms: PlayStation 5 and Xbox Series X|S day-and-date at launch. PC release scheduled post-launch.',
    '- Base Price: Standard Edition retails at $79.99 USD. Ultimate Edition retails at $99.99 USD.',
    '- Setting & Map: Set in the state of Leonida, featuring Vice City, Grassrivers wetlands, and Mount Kalaga.',
    '- Dual Protagonists: Lucia Caminos (first playable female lead) and Jason Duval.',
    '',
    '## Complete Guides Directory',
    '',
    ...pages.map(([path, name, text]) => `- [${name}](${site.url}${path === '/' ? '/' : path}): ${text}`),
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

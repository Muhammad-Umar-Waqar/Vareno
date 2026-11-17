import { SITE_URL } from '../../site.config.mjs';

function pick(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const site = {
  name: 'Vareno',
  url: SITE_URL,
  author: 'Vareno',
  locale: 'en-US',
  tagline: 'Gaming, clips, entertainment',
  updatedISO: '2026-11-16',
  updatedLabel: 'November 16, 2026',
  launchISO: '2026-11-19T05:00:00.000Z',
  description:
    'Unofficial Grand Theft Auto VI guides from Vareno: release date, price, map, cast, trailers, and platforms, sourced from Rockstar and Take-Two.',
} as const;

export const socials = [
  { name: 'YouTube', href: 'https://www.youtube.com/@VarenoPlay' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@VarenoPlay' },
  { name: 'Instagram', href: 'https://www.instagram.com/VarenoPlay/' },
] as const;

export const primaryNav = [
  { href: '/release-date', label: 'Release date' },
  { href: '/tricks', label: 'Tricks' },
  { href: '/leaks', label: 'Leaks' },
  { href: '/map', label: 'Map' },
  { href: '/price', label: 'Price' },
] as const;

export const moreNav = [
  { href: '/characters/lucia', label: 'Characters', desc: 'Lucia Caminos & Jason Duval' },
  { href: '/platforms', label: 'Platforms', desc: 'PS5, Xbox Series X|S & PC' },
  { href: '/trailers', label: 'Trailers', desc: 'Official 4K trailers & breakdowns' },
  { href: '/blog', label: 'Hot Topics & News', desc: 'PC specs, map size & launch intel' },
  { href: '/tools/portrait', label: 'Your Photo Tool', desc: 'Leonida AI portrait generator' },
] as const;

export const nav = [
  ...primaryNav,
  ...moreNav.map((m) => ({ href: m.href, label: m.label })),
] as const;

export const stores = [
  {
    name: 'PlayStation Store',
    href: pick(
      import.meta.env.PUBLIC_PS_STORE_URL,
      'https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-GTAVISTANDARD001/',
    ),
  },
  {
    name: 'Rockstar GTA VI page',
    href: pick(import.meta.env.PUBLIC_ROCKSTAR_URL, 'https://www.rockstargames.com/VI'),
  },
  {
    name: 'Microsoft Store search',
    href: pick(
      import.meta.env.PUBLIC_XBOX_STORE_URL,
      'https://www.microsoft.com/en-us/search/shop?q=Grand%20Theft%20Auto%20VI',
    ),
  },
] as const;

export const sources = {
  rockstar: {
    name: 'Rockstar Games, Grand Theft Auto VI',
    url: 'https://www.rockstargames.com/VI',
  },
  trailers: {
    name: 'Rockstar Games, trailer page',
    url: 'https://www.rockstargames.com/VI/launch-trailer',
  },
  preload: {
    name: 'Rockstar Games, Pre-Load Now (November 10, 2026)',
    url: 'https://www.rockstargames.com/VI/pre-load-now',
  },
  jason: {
    name: 'Rockstar Games, Jason',
    url: 'https://www.rockstargames.com/VI/jason',
  },
  taketwo: {
    name: 'Take-Two pre-order announcement (June 24, 2026)',
    url: 'https://taketwointeractivesoftwareinc.gcs-web.com/news-releases/news-release-details/rockstar-games-announces-pre-orders-grand-theft-auto-vi/',
  },
  playstation: {
    name: 'PlayStation Store, Grand Theft Auto VI',
    url: 'https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-GTAVISTANDARD001/',
  },
} as const;

export const disclaimer =
  'Vareno is not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto, Rockstar, and related marks belong to their owners. This is an unofficial guide.';

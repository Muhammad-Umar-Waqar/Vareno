import { site } from '../data/site';

export function canonicalFor(pathname: string) {
  if (pathname === '/' || pathname === '') return `${site.url}/`;
  return `${site.url}${pathname.replace(/\/$/, '')}`;
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/images/logo.webp`,
    description: site.description,
    sameAs: [
      'https://www.youtube.com/@VarenoPlay',
      'https://www.tiktok.com/@VarenoPlay',
      'https://www.instagram.com/VarenoPlay/',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    publisher: { '@type': 'Organization', name: site.name },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalFor(item.path),
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  ogType?: 'Article' | 'BlogPosting';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': input.ogType ?? 'Article',
    headline: input.headline,
    description: input.description,
    datePublished: site.updatedISO,
    dateModified: site.updatedISO,
    author: { '@type': 'Organization', name: site.author, url: `${site.url}/about` },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: `${site.url}/images/logo.webp` },
    },
    image: [`${site.url}/images/og.jpg`],
    mainEntityOfPage: canonicalFor(input.path),
  };
}

export function blogPostingSchema(input: {
  headline: string;
  description: string;
  path: string;
  published: Date;
  modified: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.headline,
    description: input.description,
    datePublished: input.published.toISOString(),
    dateModified: input.modified.toISOString(),
    author: { '@type': 'Organization', name: site.author, url: `${site.url}/about` },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: `${site.url}/images/logo.webp` },
    },
    image: [`${site.url}/images/og.jpg`],
    mainEntityOfPage: canonicalFor(input.path),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

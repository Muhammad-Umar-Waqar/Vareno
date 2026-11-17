import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const logoSrc = path.join(root, 'icons and logos', 'logo.jpeg');
const coverSrc = path.join(root, 'icons and logos', 'cover_picture.jpeg');
const imageDir = path.join(root, 'public', 'images');

await mkdir(imageDir, { recursive: true });

const logo = sharp(logoSrc).resize(256, 256, { fit: 'cover' }).webp({ quality: 82 });
const logoMeta = await logo.toFile(path.join(imageDir, 'logo.webp'));

const cover = sharp(coverSrc).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 });
const coverMeta = await cover.toFile(path.join(imageDir, 'cover.webp'));

await sharp(coverSrc)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 80 })
  .toFile(path.join(root, 'public', 'images', 'og.jpg'));

await sharp(logoSrc).resize(32, 32, { fit: 'cover' }).png().toFile(path.join(root, 'public', 'favicon.png'));
await sharp(logoSrc).resize(180, 180, { fit: 'cover' }).png().toFile(path.join(root, 'public', 'apple-touch-icon.png'));

const file = `export const logo = {
  src: '/images/logo.webp',
  width: ${logoMeta.width},
  height: ${logoMeta.height},
  alt: 'Vareno Play logo: a gold faceted V, a crown, and a white controller on black',
};

export const cover = {
  src: '/images/cover.webp',
  width: ${coverMeta.width},
  height: ${coverMeta.height},
  alt: 'Vareno Play cover art with a night city, palms, a helicopter, and a sports car',
};

export const og = {
  src: '/images/og.jpg',
  width: 1200,
  height: 630,
  alt: 'Vareno Play, gaming, clips, and entertainment',
};
`;

await writeFile(path.join(root, 'src', 'data', 'images.ts'), file);
console.log(`logo ${logoMeta.width}x${logoMeta.height}, cover ${coverMeta.width}x${coverMeta.height}`);

export const scenes = [
  {
    id: 'beach',
    label: 'Beach at dusk',
    detail: 'Palms, wet sand, and a low sun in a coastal city.',
    aspect: '3:4',
    prompt:
      "Keep this person's identity, face, age, and expression unchanged. Place them on a warm dusk beach in a humid neon coastal city, with palm silhouettes, wet sand, and a pastel sky. Photoreal natural skin. No logos, no readable text, no game interface.",
  },
  {
    id: 'downtown',
    label: 'Downtown at night',
    detail: 'Wet asphalt, amber streetlights, and glass towers.',
    aspect: '3:4',
    prompt:
      "Keep this person's identity, face, age, and expression unchanged. Place them on a downtown sidewalk at night in a humid coastal city, with amber streetlights, glass towers, and reflections on wet asphalt. Photoreal natural skin. No logos, no readable text, no game interface.",
  },
  {
    id: 'highway',
    label: 'Wetlands highway',
    detail: 'Golden hour, grass, and a blurred sports car.',
    aspect: '16:9',
    prompt:
      "Keep this person's identity, face, age, and expression unchanged. Place them beside a highway through grassy wetlands at golden hour, with a wide sky and a sports car blurred in the distance. Photoreal natural skin. No logos, no readable text, no game interface.",
  },
  {
    id: 'boardwalk',
    label: 'Boardwalk sunset',
    detail: 'A seaside walk with soft ferris-wheel lights.',
    aspect: '3:4',
    prompt:
      "Keep this person's identity, face, age, and expression unchanged. Place them on a seaside boardwalk at sunset, with warm wind and soft ferris-wheel lights in the background. Photoreal natural skin. No logos, no readable text, no game interface.",
  },
  {
    id: 'character',
    label: 'Original character',
    detail: 'Your face, restyled as an original open-world lead.',
    aspect: '3:4',
    prompt:
      "Keep this person's identity, face, and age unchanged. Dress them in a practical jacket as an original open-world lead, with gold-hour light and a coastal city skyline behind them. Invent an original look. Photoreal skin. Do not copy a famous video game character. No logos, no readable text, no game interface.",
  },
] as const;

export type SceneId = (typeof scenes)[number]['id'];

export function sceneById(id: string) {
  return scenes.find((scene) => scene.id === id) ?? null;
}

// Wrong: the normal map's Image Texture node left on sRGB, so Blender reads its colours as a picture.
// Right: Color Space set to Non-Color, so it reads them as directions.
import { node } from './nodes.mjs';

export default (kit) => {
  const bad = node(kit, 20, 20, 'Image Texture', { width: 200, outputs: ['Color'], fields: [['Image', 'stone-normal'], ['Color Space', 'sRGB']] });
  const good = node(kit, 260, 20, 'Image Texture', { width: 200, outputs: ['Color'], fields: [['Image', 'stone-normal'], ['Color Space', 'Non-Color']], mark: true });
  return kit.svg({ width: 480, height: 150 },
    bad.svg,
    `<rect x="28" y="87" width="184" height="17" rx="3" class="d-key-bad" fill-opacity="0.2" stroke-width="1.6"/>`,
    kit.tag(120, 136, 'sRGB: read as a picture', { tone: 'bad' }),
    good.svg,
    kit.tag(360, 136, 'Non-Color: read as directions'),
  );
};

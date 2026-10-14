// The two materials from this lesson's exercise, with no images: a floor of wooden planks whose
// grain is a Wave Texture, and a stone floor whose stones are a Voronoi Texture.
import { view } from '../../../diagrams/mesh.mjs';
import { planks, stones } from './surface.mjs';

export default (kit) => {
  const v = view({ at: [300, 120], scale: 62, azimuth: 20, elevation: 40 });
  return kit.svg({ width: 600, height: 230 },
    planks(kit, v, [-3.2, -1, -0.4, 1], { count: 5, grain: 3 }),
    stones(kit, v, [0.4, -1, 3.2, 1], { count: 4 }),
    kit.text(150, 222, 'wood: Wave Texture', { anchor: 'middle', size: 12 }),
    kit.text(440, 222, 'stone: Voronoi Texture', { anchor: 'middle', size: 12 }),
  );
};

// A wall, an eight-sided pillar and a crate rendered with Line Art: outlines round every piece and
// lines on their sharp edges, drawn over the shaded models.
import { view } from '../../../diagrams/mesh.mjs';
import { drawLineArt } from './lines.mjs';
import { wall, pillar, crate } from './kit.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 22, scale: 88, at: [270, 222] });
  return kit.svg({ width: 500, height: 280 },
    drawLineArt(kit, wall(), v, { threshold: 130 }),
    drawLineArt(kit, pillar(), v, { threshold: 130 }),
    drawLineArt(kit, crate(), v, { threshold: 130 }),
  );
};

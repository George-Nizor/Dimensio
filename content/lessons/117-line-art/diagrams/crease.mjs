// The same eight-sided pillar with Crease Threshold at 140 degrees, where every side edge gets a
// line because the sides meet at 135, and at 130, where only the outline and the top edge remain.
import { view, cylinder } from '../../../diagrams/mesh.mjs';
import { drawLineArt } from './lines.mjs';

export default (kit) => {
  const m = cylinder({ vertices: 8, radius: 0.6, depth: 1.8 });
  return kit.svg({ width: 440, height: 250 },
    drawLineArt(kit, m, view({ azimuth: 12, elevation: 20, scale: 70, at: [120, 120] }), { threshold: 140 }),
    drawLineArt(kit, m, view({ azimuth: 12, elevation: 20, scale: 70, at: [320, 120] }), { threshold: 130 }),
    kit.text(120, 232, 'Crease Threshold 140°', { anchor: 'middle', size: 12 }),
    kit.text(320, 232, 'Crease Threshold 130°', { anchor: 'middle', size: 12 }),
  );
};

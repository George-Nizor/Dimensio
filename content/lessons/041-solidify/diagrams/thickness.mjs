// A standing plane before and after Solidify: the same face given a thickness, measured across it.
import { view, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { solidify, panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';
import { standingPlane, twoSided } from './shapes.mjs';

export default (kit) => {
  const p = standingPlane(1.6, 1.6);
  const t = 0.45;
  const s = solidify(p, t);
  const v1 = view({ at: [114, 160], scale: 70, azimuth: 50 });
  const v2 = view({ at: [386, 160], scale: 70, azimuth: 50 });
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 200, 186, 'plane'),
    drawMesh(kit, twoSided(p), v1, { width: 1.6 }),
    pageArrow(kit, 226, 105, 274, 105),
    panel(kit, 286, 14, 200, 186, 'Solidify'),
    drawMesh(kit, s, v2, { width: 1.6 }),
    dimension(kit, v2, [0.8, 0, 1.6], [0.8, t, 1.6], { offset: [0, 0, 0.35], label: 'Thickness' }),
  );
};

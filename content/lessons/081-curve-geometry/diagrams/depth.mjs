// The same Bézier curve with Depth 0 (a line with its points and handles) and with a round bevel
// of Depth 0.15 m: a tube 0.3 m across.
import { view } from '../../../diagrams/mesh.mjs';
import { drawMesh } from '../../../diagrams/mesh.mjs';
import { DEFAULT_CURVE, drawPath, pathPoints, tube, panel } from './curves.mjs';

export default (kit) => {
  const left = view({ azimuth: 0, elevation: 50, at: [125, 92], scale: 92 });
  const right = view({ azimuth: 0, elevation: 50, at: [395, 92], scale: 92 });
  return kit.svg({ width: 520, height: 200 },
    panel(kit, 14, 14, 222, 156, 'depth 0'),
    drawPath(kit, left, DEFAULT_CURVE, { handles: true }),
    kit.line(250, 92, 288, 92, { cls: 'd-mark', width: 2 }), kit.arrowhead(288, 92, 0, { size: 8 }),
    panel(kit, 284 + 0, 14, 222, 156, 'depth 0.15 m'),
    drawMesh(kit, tube(pathPoints(DEFAULT_CURVE, 12), 0.15, 12), right, { width: 0.8 }),
  );
};

// The default Bézier curve with Depth 0.15 m. Wrong: the default resolutions (Preview U 12, bevel
// Resolution 4) give 288 triangles. Right: Preview U 4 and bevel Resolution 1 give 48.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { DEFAULT_CURVE, pathPoints, tube, panel } from './curves.mjs';

export default (kit) => {
  const left = view({ azimuth: 0, elevation: 50, at: [125, 88], scale: 92 });
  const right = view({ azimuth: 0, elevation: 50, at: [385, 88], scale: 92 });
  return kit.svg({ width: 510, height: 220 },
    panel(kit, 14, 14, 222, 150, 'U 12, resolution 4: 288 triangles'),
    drawMesh(kit, tube(pathPoints(DEFAULT_CURVE, 12), 0.15, 12), left, { width: 0.7 }),
    kit.tag(125, 208, 'too many triangles', { tone: 'bad' }),
    panel(kit, 274, 14, 222, 150, 'U 4, resolution 1: 48 triangles'),
    drawMesh(kit, tube(pathPoints(DEFAULT_CURVE, 4), 0.15, 6), right, { width: 1 }),
    kit.tag(385, 208, 'enough for a rope'),
  );
};

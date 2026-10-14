// A ramp's sloping top face extruded 0.8 m two ways. Left, with E: along its normal, so the new
// part leans forward. Right, with E then Z: straight up the world's Z axis.
import { view, drawMesh, facesWhere, extrude, keycap } from '../../../diagrams/mesh.mjs';
import { panel, extrudeAlong } from './helpers.mjs';
import { ramp } from './shapes.mjs';

export default (kit) => {
  const m = ramp();
  const slope = facesWhere(m, (c, n) => n[2] > 0.3 && n[1] < -0.3);
  const left = view({ at: [126, 116], scale: 34, azimuth: 70, elevation: 14, target: [0, 0, 0.3] });
  const right = view({ at: [384, 116], scale: 34, azimuth: 70, elevation: 14, target: [0, 0, 0.3] });
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 224, 190),
    drawMesh(kit, extrude(m, slope, 0.8).mesh, left, { width: 1.4, select: { faces: slope } }),
    keycap(kit, 126, 226, 'E'),
    panel(kit, 272, 14, 224, 190),
    drawMesh(kit, extrudeAlong(m, slope, [0, 0, 0.8]), right, { width: 1.4, select: { faces: slope } }),
    keycap(kit, 368, 226, 'E'), keycap(kit, 402, 226, 'Z'),
  );
};

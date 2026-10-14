// The inset top face pushed into the cube with E, making a sunken panel inside the border.
import { cube, view, drawMesh, facesWhere, extrude, keycap } from '../../../diagrams/mesh.mjs';
import { insetEven } from './helpers.mjs';

export default (kit) => {
  const start = cube();
  const [top] = facesWhere(start, (c, n) => n[2] > 0.9);
  const { mesh } = extrude(insetEven(start, top, 0.35).mesh, [top], -0.3);
  const v = view({ at: [180, 136], scale: 58, elevation: 36 });
  return kit.svg({ width: 400, height: 270 },
    drawMesh(kit, mesh, v, { width: 1.5, select: { faces: [top] } }),
    keycap(kit, 350, 130, 'E'),
  );
};

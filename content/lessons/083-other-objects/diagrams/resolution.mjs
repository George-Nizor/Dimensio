// The dome at Resolution Preview U and V of 2, 3 and 4. Converted, these give 98, 242 and 450
// triangles.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { dome, panel } from './shapes.mjs';

export default (kit) => kit.svg({ width: 540, height: 190 },
  [[2, 98], [3, 242], [4, 450]].map(([res, tris], i) => {
    const x = 14 + i * 176;
    const v = view({ azimuth: 30, elevation: 30, at: [x + 82, 96], scale: 52, target: [0, 0, 0.3] });
    return [panel(kit, x, 14, 164, 140, `${res} by ${res}: ${tris} triangles`), drawMesh(kit, dome({ res }).mesh, v, { width: 0.8 })];
  }),
);

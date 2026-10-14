// Edges settings. Left, the defaults: the cube slumps into a puddle on the plate. Right, Bending
// 3 with Pull and Push at 0.8: it lands, squashes a little and keeps its shape.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { plate, jelly, puddle } from './scene.mjs';
import { panel, field } from './helpers.mjs';

export default (kit) => {
  const cell = (x, mesh) => {
    const v = view({ azimuth: 30, elevation: 24, at: [x + 110, 96], scale: 68, target: [0, 0, 0.3] });
    return [panel(kit, x, 14, 220, 150), drawMesh(kit, plate(), v, { width: 1 }), drawMesh(kit, mesh, v, { width: 0.9 })];
  };
  return kit.svg({ width: 480, height: 314 },
    cell(10, puddle()),
    kit.text(120, 182, 'Bending 0, Pull and Push 0.5', { anchor: 'middle', size: 11 }),
    cell(250, jelly({ squash: 0.94, z: 0.4 })),
    kit.text(360, 182, 'Bending 3, Pull and Push 0.8', { anchor: 'middle', size: 11 }),
    `<rect x="250" y="196" width="220" height="110" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(260, 214, 'Edges', { size: 11 }),
    field(kit, 260, 222, 200, 'Pull', '0.8', { on: true, labelWidth: 0.4 }),
    field(kit, 260, 248, 200, 'Push', '0.8', { on: true, labelWidth: 0.4 }),
    field(kit, 260, 274, 200, 'Bending', '3', { on: true, labelWidth: 0.4 }),
  );
};

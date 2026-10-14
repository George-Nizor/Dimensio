// The Add > Empty menu with Plain Axes picked out, and the empty it adds on the ground under the
// car: six short lines along X, Y and Z.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { menu } from './helpers.mjs';
import { car, plainAxes } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 38, elevation: 26, at: [340, 130], scale: 46, target: [0, 0, 0.6] });
  return kit.svg({ width: 500, height: 240 },
    menu(kit, 14, 20, { title: 'Empty', items: ['Plain Axes', 'Arrows', 'Single Arrow', 'Circle', 'Cube', 'Sphere', 'Cone'], pick: 'Plain Axes', width: 150 }),
    drawMesh(kit, car().mesh, v, { mode: 'wire', cls: 'd-guide', width: 1 }),
    plainAxes(kit, v, [0, 0, 0], 0.7),
    kit.text(340, 228, 'Plain Axes under the car', { anchor: 'middle', size: 12 }),
  );
};

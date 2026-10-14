// The block car from the side with the empty under it, and the Outliner beside it: the empty Car
// holds Body, and Body holds the cabin and the four wheels.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { outliner } from './helpers.mjs';
import { car, plainAxes } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 70, elevation: 10, at: [150, 140], scale: 54, target: [0, 0, 0.6] });
  return kit.svg({ width: 520, height: 260 },
    drawMesh(kit, car().mesh, v, { width: 1.3 }),
    plainAxes(kit, v, [0, 0, 0], 0.3),
    kit.text(150, 245, 'Car, an empty, under the body', { anchor: 'middle', size: 12 }),
    outliner(kit, 310, 40, 196, [
      { name: 'Car', icon: 'empty', depth: 0, eye: true },
      { name: 'Body', icon: 'mesh', depth: 1, eye: true },
      { name: 'Cabin', icon: 'mesh', depth: 2, eye: true },
      { name: 'Wheel BL', icon: 'mesh', depth: 2, eye: true },
      { name: 'Wheel BR', icon: 'mesh', depth: 2, eye: true },
      { name: 'Wheel FL', icon: 'mesh', depth: 2, eye: true },
      { name: 'Wheel FR', icon: 'mesh', depth: 2, eye: true },
    ]),
  );
};

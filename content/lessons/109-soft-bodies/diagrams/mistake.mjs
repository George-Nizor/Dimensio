// Wrong: Goal left ticked, so the cube stays where it started, hanging in the air above the
// plate. Right: Goal unticked, and the cube falls and lands on the plate.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { plate, jelly } from './scene.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const cell = (x, z, squash) => {
    const v = view({ azimuth: 30, elevation: 20, at: [x + 110, 156], scale: 70, target: [0, 0, 0] });
    return [panel(kit, x, 14, 220, 170), drawMesh(kit, plate(), v, { width: 1 }), drawMesh(kit, jelly({ z, squash }), v, { width: 0.9 })];
  };
  return kit.svg({ width: 480, height: 216 },
    cell(10, 1.3, 1),
    kit.tag(120, 206, 'Goal on: stays up', { tone: 'bad' }),
    cell(250, 0.38, 0.9),
    kit.tag(360, 206, 'Goal off: falls'),
  );
};

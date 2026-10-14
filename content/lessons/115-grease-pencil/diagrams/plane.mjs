// The Drawing Plane pop-over with Front (X-Z) chosen, beside a stroke that lies on the X-Z plane
// through the object's origin, seen from above and to one side.
import { view, axes } from '../../../diagrams/mesh.mjs';
import { menu } from './ui-kit.mjs';
import { handStroke, chest } from './gp-kit.mjs';

export default (kit) => {
  const pop = menu(kit, 16, 30, ['View', { label: 'Front (X-Z)', mark: true }, 'Side (Y-Z)', 'Top (X-Y)', 'Cursor'], { width: 150, title: 'Drawing Plane' });
  const v = view({ azimuth: 35, elevation: 22, scale: 150, at: [330, 190] });
  const plane = [[-0.75, 0, -0.05], [0.75, 0, -0.05], [0.75, 0, 0.85], [-0.75, 0, 0.85]].map((p) => v.project(p));
  return kit.svg({ width: 480, height: 250 },
    pop.svg,
    kit.polyline([...plane, plane[0]], { cls: 'd-guide', width: 1.2, dash: '5 5' }),
    axes(kit, v, { length: 0.55, width: 1.4 }),
    handStroke(kit, v, chest.front.body, { closed: true, seed: 4 }),
    handStroke(kit, v, chest.front.lid, { seed: 5 }),
    kit.text(250, 236, 'strokes lie on the X-Z plane', { size: 12 }),
  );
};

// Orbiting: the view turns around the point you're looking at while the middle mouse button is
// held and dragged.
import { cube, view, drawMesh, mouse } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const v = view({ at: [150, 120], scale: 42 });
  return kit.svg({ width: 400, height: 230 },
    kit.ellipse(150, 126, 118, 34, { cls: 'd-guide', width: 1.4, dash: '5 6' }),
    drawMesh(kit, cube(), v, { width: 1.8 }),
    kit.arcArrow(48, 146, 252, 146, { lift: 44 }),
    mouse(kit, 330, 110, { button: 'middle', label: 'drag with the wheel' }),
  );
};

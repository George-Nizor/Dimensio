// The cone added as a cork, from the front: Radius 1 at the bottom, 0.07 m, and the wider Radius 2
// at the top, 0.09 m.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { body, neck, cork } from './bottle.mjs';

export default (kit) => {
  const v = views.front({ at: [170, 140], scale: 900, target: [0, 0, 0.32] });
  const radius = (z, r, label, dy) => {
    const [x0, y] = v.project([0, 0, z]);
    const [x1] = v.project([r, 0, z]);
    return [
      kit.line(x0, y, x1, y, { cls: 'd-mark', width: 2 }), kit.arrowhead(x1, y, 0, { size: 7 }),
      kit.dot(x0, y, { r: 3, cls: 'd-mark-fill' }),
      kit.line(x1 + 4, y, 300, y + dy, { cls: 'd-guide', width: 1.2 }),
      kit.text(306, y + dy + 4, label, { size: 12 }),
    ];
  };
  return kit.svg({ width: 420, height: 230 },
    drawMesh(kit, body(), v, { width: 1.2, cls: 'd-guide' }),
    drawMesh(kit, neck(), v, { width: 1.2, cls: 'd-guide' }),
    drawMesh(kit, cork(), v, { width: 1.8 }),
    radius(0.4, 0.09, 'Radius 2: 0.09 m', 0),
    radius(0.28, 0.07, 'Radius 1: 0.07 m', 20),
  );
};

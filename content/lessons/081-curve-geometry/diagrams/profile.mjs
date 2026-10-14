// Bevel set to Object: a flat closed curve 8 cm by 4 cm, the Rail profile, is swept along the rail's
// path. Fill Caps closes the two ends. The rail is drawn thicker than life so its shape reads.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { autoPath, pathPoints, sweep, rectangle, panel } from './curves.mjs';

export default (kit) => {
  const rail = autoPath([[-1.6, 0, 0], [0, 0.5, 0], [1.6, 0, 0]]);
  const v = view({ azimuth: 35, elevation: 30, at: [360, 100], scale: 62, target: [0, 0.2, 0] });
  return kit.svg({ width: 520, height: 210 },
    panel(kit, 14, 34, 130, 130, 'rail profile'),
    `<rect x="49" y="82" width="60" height="30" rx="1" class="d-paper" stroke-width="0"/>`,
    kit.polyline([[49, 82], [109, 82], [109, 112], [49, 112], [49, 82]], { cls: 'd-ink', width: 2 }),
    [[49, 82], [109, 82], [109, 112], [49, 112]].map(([x, y]) => kit.dot(x, y, { r: 3, cls: 'd-mark-fill' })),
    kit.text(79, 74, '8 cm', { anchor: 'middle', size: 11 }),
    kit.text(117, 101, '4 cm', { size: 11 }),
    kit.line(158, 100, 200, 100, { cls: 'd-mark', width: 2 }), kit.arrowhead(200, 100, 0, { size: 8 }),
    drawMesh(kit, sweep(pathPoints(rail, 6), rectangle(0.24, 0.12), { caps: true }), v, { width: 1.2 }),
    kit.text(360, 196, 'swept along the path, ends filled', { anchor: 'middle', size: 12 }),
  );
};

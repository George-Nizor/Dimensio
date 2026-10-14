// Delete Loose. Left, a 0.5 m box drawn see-through with the starter's three stray vertices inside.
// Right, after Delete Loose, they are gone.
import { view, drawMesh, translate, cube } from '../../../diagrams/mesh.mjs';
import { panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 24, at: [118, 106], scale: 224, target: [0, 0, 0.25] });
  const right = view({ azimuth: 30, elevation: 24, at: [392, 106], scale: 224, target: [0, 0, 0.25] });
  const box = translate(cube(0.5), [0, 0, 0.25]);
  const stray = [[0.05, 0.025, 0.2], [-0.075, 0.05, 0.275], [0.025, -0.1, 0.15]];
  return kit.svg({ width: 510, height: 230 },
    panel(kit, 14, 14, 208, 184, 'three loose vertices'),
    drawMesh(kit, box, left, { mode: 'xray', width: 1.4 }),
    stray.map((p) => { const [x, y] = left.project(p); return kit.dot(x, y, { r: 4, cls: 'd-mark-fill' }); }),
    step(kit, 232, 104, 278),
    panel(kit, 288, 14, 208, 184, 'after Delete Loose'),
    drawMesh(kit, box, right, { mode: 'xray', width: 1.4 }),
  );
};

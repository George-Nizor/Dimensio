// The finished low-poly character from the front, standing in a T pose. Its left half (on the
// right of the picture) is the modelled half, solid; the other half, made by the Mirror modifier,
// is drawn faint, with the mirror line down the middle.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character } from './charkit.mjs';

export default (kit) => {
  const v = views.front({ at: [240, 150], scale: 120, target: [0, 0, 0.9] });
  const [, top] = v.project([0, 0, 1.95]);
  const [, bottom] = v.project([0, 0, -0.05]);
  return kit.svg({ width: 480, height: 290 },
    drawMesh(kit, character().mesh, v, { cls: 'd-guide', width: 0.8 }),
    drawMesh(kit, character({}, { half: true }).mesh, v, { width: 1.1 }),
    kit.line(240, top, 240, bottom, { cls: 'd-mark', width: 1.4, dash: '6 5' }),
    kit.text(250, top + 14, 'mirror line', { size: 12 }),
    kit.text(110, 268, 'made by Mirror', { anchor: 'middle', size: 12 }),
    kit.text(370, 268, 'modelled', { anchor: 'middle', size: 12 }),
  );
};

// The crate with its origin at the middle of its base, half its height, 0.5 m, below its middle, so
// it stands on the floor at Location Z 0.
import { view, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { origin } from './parts.mjs';
import { crate } from './props.mjs';

export default (kit) => {
  const v = view({ at: [170, 130], scale: 120, target: [0, 0, 0.5] });
  const [bx, by] = v.project([0, 0, 0]);
  const [mx, my] = v.project([0, 0, 0.5]);
  return kit.svg({ width: 440, height: 280 },
    drawMesh(kit, crate(), v, { mode: 'xray', width: 1.6 }),
    kit.line(mx, my, bx, by, { cls: 'd-guide', width: 1.2, dash: '3 4' }),
    kit.dot(mx, my, { r: 3, cls: 'd-dot' }),
    origin(kit, bx, by),
    dimension(kit, v, [0.5, -0.5, 0], [0.5, -0.5, 0.5], { offset: [0.45, 0, 0], label: '0.5 m' }),
    kit.text(bx, 268, 'the origin at Location Z 0 stands it on the floor', { anchor: 'middle', size: 12 }),
  );
};

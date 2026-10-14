// The squash key's Value slider from 0 to 1, with the sack at 0 (the Basis), 0.5 (halfway) and 1
// (the full squash). Each sack is the Basis plus Value times the key's offsets.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { sack, frame } from './sackkit.mjs';

export default (kit) => {
  const cells = [0, 0.5, 1];
  const x0 = 84;
  const w = 292;
  return kit.svg({ width: 460, height: 250 },
    frame(kit, 14, 14, 432, 222),
    cells.map((val, i) => drawMesh(kit, sack(val), view({ at: [x0 + (w * i) / 2, 136], scale: 32, elevation: 18 }), { width: 1.1 })),
    `<rect x="${x0}" y="176" width="${w}" height="12" rx="6" class="d-key" stroke-width="1.2"/>`,
    `<rect x="${x0}" y="176" width="${w / 2}" height="12" rx="6" class="d-mark-fill"/>`,
    kit.circle(x0 + w / 2, 182, 9, { cls: 'd-mark', width: 2.4 }),
    cells.map((val, i) => kit.text(x0 + (w * i) / 2, 212, `Value ${val}`, { anchor: 'middle', size: 12 })),
  );
};

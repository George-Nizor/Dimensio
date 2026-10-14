// Seen from the top, three planks in a row turned 90 degrees. Left, with Individual Origins, each
// turns in place. Right, with Median Point, the row swings around its middle.
import { box, rotate, translate, views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';

export default (kit) => {
  const p = (x) => box({ size: [0.3, 1.2, 0.08], center: [x, 0, 0] });
  const xs = [-1, 0, 1];
  const cell = (x, label, turned) => {
    const v = views.top({ at: [x + 110, 100], scale: 54 });
    return [
      panel(kit, x, 14, 220, 172, label),
      xs.map((px) => drawMesh(kit, p(px), v, { mode: 'wire', cls: 'd-guide', width: 1.2 })),
      turned.map((m) => drawMesh(kit, m, v, { width: 1.8, cls: 'd-mark' })),
    ];
  };
  return kit.svg({ width: 500, height: 210 },
    cell(14, 'Individual Origins', xs.map((x) => translate(rotate(translate(p(x), [-x, 0, 0]), 'z', 90), [x, 0, 0]))),
    cell(266, 'Median Point', xs.map((x) => rotate(p(x), 'z', 90))),
  );
};

// A Wind force field turned 90 degrees on Y, so its Z axis, which it blows along, points along X.
// Its rings show the strength. The leaves drift with it as they fall.
import { field, leaf, push } from './helpers.mjs';

export default (kit) => {
  const rings = [0, 1, 2, 3].map((i) => kit.ellipse(70 + i * 14, 110, 10, 34, { cls: 'd-guide', width: 1.6 }));
  return kit.svg({ width: 500, height: 220 },
    kit.dot(70, 110, { r: 4 }),
    rings,
    push(kit, 70, 110, 150, 110, { width: 2.4, size: 9 }),
    kit.text(110, 96, 'Z', { size: 12, cls: 'd-label d-axis-z-text' }),
    [[180, 60, 20], [210, 90, 70], [244, 116, 140], [270, 150, 200], [300, 172, 260]].map(([x, y, a]) => leaf(kit, x, y, { size: 9, angle: a })),
    kit.path('M 176 56 Q 240 90 304 176', { cls: 'd-guide', width: 1.4, dash: '4 5' }),
    `<rect x="330" y="40" width="160" height="110" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(340, 60, 'Wind', { size: 11 }),
    field(kit, 336, 70, 148, 'Strength', '3', { on: true, labelWidth: 0.5 }),
    field(kit, 336, 98, 148, 'Rotation Y', '90°', { on: true, labelWidth: 0.5 }),
    kit.text(40, 200, 'Add > Force Field > Wind', { size: 12 }),
  );
};

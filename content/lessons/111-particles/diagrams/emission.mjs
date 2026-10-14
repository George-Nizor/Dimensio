// Velocity > Normal. Left, the default 1 m/s: particles shoot out of the canopy in every
// direction. Right, 0: they drop straight down. Beside them, the Emission settings for leaves.
import { panel, field, push } from './helpers.mjs';
import { random } from '../../../diagrams/lib.mjs';

export default (kit) => {
  const canopy = (x, out) => {
    const next = random(5);
    const parts = [kit.circle(x, 80, 34, { cls: 'd-ink', width: 1.6 })];
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2;
      const sx = x + Math.cos(a) * 34;
      const sy = 80 + Math.sin(a) * 34;
      if (out) parts.push(push(kit, sx, sy, sx + Math.cos(a) * 22, sy + Math.sin(a) * 22 + 8, { width: 1.4, size: 5 }));
      else parts.push(push(kit, sx, sy, sx, sy + 24 + next() * 10, { width: 1.4, size: 5 }));
    }
    return parts;
  };
  return kit.svg({ width: 500, height: 200 },
    panel(kit, 10, 14, 120, 150, 'Normal 1'), canopy(70, true),
    panel(kit, 140, 14, 120, 150, 'Normal 0'), canopy(200, false),
    `<rect x="280" y="14" width="210" height="150" rx="6" class="d-ui" stroke-width="1"/>`,
    field(kit, 288, 26, 194, 'Number', '150', { on: true, labelWidth: 0.42 }),
    field(kit, 288, 54, 194, 'End', '100', { on: true, labelWidth: 0.42 }),
    field(kit, 288, 82, 194, 'Lifetime', '250', { on: true, labelWidth: 0.42 }),
    kit.text(296, 124, 'Velocity', { size: 11 }),
    field(kit, 288, 132, 194, 'Normal', '0 m/s', { on: true, labelWidth: 0.42 }),
  );
};

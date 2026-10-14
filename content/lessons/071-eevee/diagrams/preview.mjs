// Z opens the shading pie in the 3D Viewport. Rendered, at the top, shows EEVEE's picture as you
// work.
import { cursor, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const cx = 250;
  const cy = 120;
  const item = (x, y, label, mark) => [
    `<rect x="${x - 62}" y="${y - 13}" width="124" height="26" rx="13" class="${mark ? 'd-ui-mark' : 'd-ui'}" stroke-width="1.2"/>`,
    kit.text(x, y + 4, label, { anchor: 'middle', size: 12 }),
  ];
  return kit.svg({ width: 480, height: 240 },
    kit.circle(cx, cy, 26, { cls: 'd-guide', width: 1.2 }),
    item(cx, cy - 76, 'Rendered', true),
    item(cx - 140, cy, 'Wireframe'),
    item(cx + 140, cy, 'Solid'),
    item(cx, cy + 76, 'Material Preview'),
    kit.line(cx, cy - 26, cx, cy - 62, { cls: 'd-mark', width: 2 }),
    cursor(kit, cx + 4, cy - 2),
    keycap(kit, 50, 36, 'Z'),
  );
};

// The Z pie menu over the 3D Viewport with Rendered picked out, the shading that shows your lights.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const cx = 220;
  const cy = 112;
  const items = [['Wireframe', -150, 0], ['Rendered', 150, 0], ['Solid', 0, -70], ['Material Preview', 0, 70]];
  return kit.svg({ width: 440, height: 220 },
    kit.circle(cx, cy, 16, { cls: 'd-guide', width: 1.4 }),
    items.map(([name, dx, dy]) => {
      const w = name.length * 7.2 + 20;
      const mark = name === 'Rendered';
      return [
        `<rect x="${cx + dx - w / 2}" y="${cy + dy - 13}" width="${w}" height="26" rx="13" class="${mark ? 'd-ui-mark' : 'd-ui'}" stroke-width="1.2"/>`,
        kit.text(cx + dx, cy + dy + 4, name, { size: 12, anchor: 'middle' }),
      ];
    }),
    keycap(kit, 50, 196, 'Z'),
  );
};

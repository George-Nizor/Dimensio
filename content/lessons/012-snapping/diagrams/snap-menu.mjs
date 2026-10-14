// The Snapping menu beside the magnet: Snap Base set to Closest at the top, and the Snap Target list
// below it with Vertex picked out.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const bases = ['Closest', 'Center', 'Median', 'Active'];
  const targets = ['Increment', 'Grid', 'Vertex', 'Edge', 'Face', 'Volume', 'Edge Center', 'Edge Perpendicular', 'Face Center'];
  const out = [
    `<rect x="20" y="20" width="38" height="26" rx="5" class="d-key-mark" stroke-width="1"/>`,
    kit.path('M 31 27 L 31 36 Q 39 44 47 36 L 47 27 M 31 31 L 35 31 M 43 31 L 47 31', { cls: 'd-paper', width: 2.2 }),
    `<rect x="62" y="20" width="28" height="26" rx="5" class="d-key" stroke-width="1"/>`,
    kit.path('M 70 30 L 76 36 L 82 30', { cls: 'd-ink', width: 1.6 }),
    `<rect x="20" y="54" width="300" height="${70 + targets.length * 22}" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(34, 76, 'Snap Base', { size: 12 }),
  ];
  bases.forEach((b, i) => {
    out.push(`<rect x="${34 + i * 70}" y="84" width="66" height="22" rx="4" class="${i === 0 ? 'd-ui-mark' : 'd-sunk'}" stroke-width="1"/>`);
    out.push(kit.text(67 + i * 70, 99, b, { anchor: 'middle', size: 11 }));
  });
  out.push(kit.text(34, 128, 'Snap Target', { size: 12 }));
  targets.forEach((t, i) => {
    const y = 136 + i * 22;
    if (t === 'Vertex') out.push(`<rect x="30" y="${y}" width="280" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(46, y + 14, t, { size: 11 }));
  });
  out.push(keycap(kit, 380, 33, 'Shift+Ctrl+Tab', { size: 10 }));
  out.push(kit.text(124, 38, 'magnet and menu', { size: 11 }));
  return kit.svg({ width: 460, height: 150 + targets.length * 22 }, out);
};

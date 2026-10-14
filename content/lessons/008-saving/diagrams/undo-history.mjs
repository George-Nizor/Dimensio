// Edit > Undo History: the most recent action at the top, the current step marked, and an earlier
// step clicked to go back to just after it.
import { cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const steps = ['Duplicate Objects', 'Scale', 'Move', 'Add Cylinder', 'Original'];
  const out = [
    kit.text(20, 24, 'Edit > Undo History', { size: 12 }),
    `<rect x="20" y="34" width="220" height="${steps.length * 24 + 10}" rx="5" class="d-paper" stroke-width="1.2"/>`,
  ];
  steps.forEach((step, i) => {
    const y = 40 + i * 24;
    if (i === 2) out.push(`<rect x="24" y="${y}" width="212" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(48, y + 15, step, { size: 12 }));
    if (i === 0) out.push(kit.dot(34, y + 11, { r: 3.4, cls: 'd-dot' }));
  });
  out.push(cursor(kit, 150, 98));
  out.push(kit.text(258, 64, 'now', { size: 12 }), kit.line(254, 60, 238, 52, { cls: 'd-guide', width: 1.2 }));
  out.push(kit.text(258, 114, 'click to go back here', { size: 12 }), kit.line(254, 110, 238, 100, { cls: 'd-guide', width: 1.2 }));
  return kit.svg({ width: 420, height: 170 }, out);
};

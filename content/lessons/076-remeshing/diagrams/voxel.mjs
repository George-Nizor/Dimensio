// Pressing R in Sculpt Mode shows the voxel size as a grid on the surface. Moving the mouse toward
// the grid's middle makes the voxels smaller; the Remesh panel shows the same Voxel Size.
import { keycap } from '../../../diagrams/mesh.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const grid = [];
  const cx = 150;
  const cy = 120;
  const s = 22;
  for (let i = -3; i <= 3; i += 1) {
    grid.push(kit.line(cx + i * s, cy - 3 * s, cx + i * s, cy + 3 * s, { cls: 'd-mark', width: 1.2 }));
    grid.push(kit.line(cx - 3 * s, cy + i * s, cx + 3 * s, cy + i * s, { cls: 'd-mark', width: 1.2 }));
  }
  return kit.svg({ width: 480, height: 240 },
    kit.circle(cx, cy, 100, { cls: 'd-ink', width: 2 }),
    grid,
    keycap(kit, 40, 26, 'R'),
    kit.text(cx, 232, 'one square: one voxel', { anchor: 'middle', size: 12 }),
    `<rect x="290" y="70" width="176" height="96" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(302, 92, 'Remesh', { size: 12 }),
    propRow(kit, 300, 104, 'Voxel Size', '0.03 m', { width: 156, split: 0.5, mark: true }),
    `<rect x="314" y="134" width="128" height="22" rx="4" class="d-key" stroke-width="1.2"/>`,
    kit.text(378, 149, 'Remesh', { anchor: 'middle', size: 11, cls: 'd-key-text' }),
  );
};

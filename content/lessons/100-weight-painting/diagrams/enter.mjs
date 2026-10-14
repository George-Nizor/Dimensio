// Entering Weight Paint with the armature: Armature clicked first, then Character with Shift held,
// so the mesh is active. Ctrl+Tab opens the mode pie, with Weight Paint picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { frame } from './shoulder.mjs';

export default (kit) => {
  const modes = ['Object Mode', 'Edit Mode', 'Sculpt Mode', 'Vertex Paint', 'Weight Paint', 'Texture Paint'];
  const cx = 340;
  const cy = 130;
  return kit.svg({ width: 480, height: 260 },
    frame(kit, 14, 14, 190, 96),
    kit.text(26, 36, 'Outliner', { size: 13 }),
    `<rect x="22" y="46" width="174" height="22" rx="3" class="d-paper" stroke-width="1"/>`,
    kit.text(32, 61, '1. Armature', { size: 12 }),
    `<rect x="22" y="74" width="174" height="22" rx="3" class="d-ui-mark" stroke-width="1.2"/>`,
    kit.text(32, 89, '2. Character (active)', { size: 12 }),
    keycap(kit, 110, 160, 'Ctrl+Tab', { size: 13 }),
    kit.circle(cx, cy, 14, { cls: 'd-guide', width: 1.4 }),
    modes.map((m, i) => {
      const a = (i / modes.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * 92;
      const y = cy + Math.sin(a) * 82;
      const w = 108;
      return [
        `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - 12).toFixed(1)}" width="${w}" height="24" rx="12" class="${m === 'Weight Paint' ? 'd-ui-mark' : 'd-paper'}" stroke-width="1.2"/>`,
        kit.text(x, y + 4, m, { anchor: 'middle', size: 12 }),
      ];
    }),
  );
};

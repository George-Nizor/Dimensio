// Wrong: on a laptop, the . key on the main keyboard opens the Pivot Point pie and the view stays
// put. Right: View Selected in the ` pie frames the selected object.
import { cube, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';

// A small pie with five blank choices and its name above it.
const mini = (kit, cx, cy, title) => {
  const out = [kit.circle(cx, cy, 7, { cls: 'd-guide', width: 3 }), kit.text(cx, cy - 50, title, { anchor: 'middle', size: 11 })];
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, 1], [0, -1], [-0.7, 0.62]]) {
    const x = cx + dx * 54;
    const y = cy + dy * 30;
    out.push(`<rect x="${(x - 26).toFixed(1)}" y="${(y - 8).toFixed(1)}" width="52" height="16" rx="8" class="d-paper" stroke-width="1"/>`);
  }
  return out;
};

export default (kit) => {
  const far = view({ at: [196, 156], scale: 7 });
  const near = view({ at: [386, 112], scale: 30 });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 176),
    drawMesh(kit, cube(), far, { width: 1.2, select: { faces: [0, 1, 2, 3, 4, 5] } }),
    keycap(kit, 36, 36, '.', { size: 12 }),
    mini(kit, 116, 104, 'Pivot Point'),
    kit.tag(124, 218, 'pivot pie, no framing', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 176),
    keycap(kit, 288, 36, '`', { size: 12 }),
    drawMesh(kit, cube(), near, { width: 1.8, select: { faces: [0, 1, 2, 3, 4, 5] } }),
    kit.tag(376, 218, 'View Selected frames it'),
  );
};

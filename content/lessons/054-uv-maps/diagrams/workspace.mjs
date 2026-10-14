// The UV Editing workspace: the UV Editor on the left, the 3D Viewport in Edit Mode on the right,
// and the Outliner and Properties editor at the far right.
import { cube, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { uvSquare, drawUVs, boxUVs, CROSS } from './uv.mjs';

export default (kit) => {
  const m = cube(1);
  const v = view({ at: [345, 140], scale: 62, target: [0, 0, 0] });
  return kit.svg({ width: 520, height: 260 },
    `<rect x="10" y="10" width="500" height="12" rx="2" class="d-ui" stroke-width="1"/>`,
    `<rect x="10" y="26" width="200" height="220" rx="3" class="d-ui-mark" stroke-width="1.2"/>`,
    `<rect x="214" y="26" width="226" height="220" rx="3" class="d-ui" stroke-width="1"/>`,
    `<rect x="444" y="26" width="66" height="70" rx="3" class="d-ui" stroke-width="1"/>`,
    `<rect x="444" y="100" width="66" height="146" rx="3" class="d-ui" stroke-width="1"/>`,
    uvSquare(kit, 40, 60, 140, { labels: false }),
    drawUVs(kit, boxUVs(m, CROSS), 40, 60, 140, { select: [0, 1, 2, 3, 4, 5] }),
    drawMesh(kit, m, v, { mode: 'solid', width: 1.4, select: { faces: [0, 1, 2, 3, 4, 5] } }),
    kit.text(110, 46, 'UV Editor', { anchor: 'middle', size: 12 }),
    kit.text(327, 46, '3D Viewport, Edit Mode', { anchor: 'middle', size: 12 }),
    kit.text(477, 64, 'Outliner', { anchor: 'middle', size: 10 }),
    kit.text(477, 176, 'Properties', { anchor: 'middle', size: 10 }),
  );
};

// The Retopology overlay, ticked under Shading in the Edit Mode overlays: the low-poly mesh turns
// see-through, so the sculpt shows under its edges.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { sculpt, lowStone } from './stone.mjs';
import { drawSculpt } from './sculpt.mjs';

export default (kit) => {
  const v = view({ at: [330, 116], scale: 72, elevation: 24 });
  return kit.svg({ width: 500, height: 230 },
    `<rect x="14" y="40" width="170" height="90" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 62, 'Shading', { size: 12 }),
    `<rect x="20" y="74" width="158" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    `<rect x="28" y="79" width="14" height="14" rx="3" class="d-paper" stroke-width="1.2"/>`,
    kit.path('M 31 86 L 34 89 L 39 82', { cls: 'd-ink', width: 2 }),
    kit.text(50, 91, 'Retopology', { size: 11 }),
    drawSculpt(kit, sculpt(), v, { width: 1.2 }),
    drawMesh(kit, lowStone(), v, { mode: 'xray', cls: 'd-mark', width: 1.6 }),
  );
};

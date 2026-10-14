// The Sculpting workspace: its tab picked out at the top, the ball in Sculpt Mode, and the asset
// shelf along the bottom of the viewport with the Draw brush chosen.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { ball, drawSculpt } from './sculpt.mjs';

export default (kit) => {
  const tabs = ['Layout', 'Modeling', 'Sculpting', 'UV Editing'];
  const brushes = ['Draw', 'Clay Strips', 'Smooth', 'Grab'];
  return kit.svg({ width: 500, height: 290 },
    tabs.map((name, i) => [
      `<rect x="${20 + i * 84}" y="12" width="80" height="22" rx="4" class="${name === 'Sculpting' ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`,
      kit.text(60 + i * 84, 27, name, { anchor: 'middle', size: 11 }),
    ]),
    `<rect x="20" y="42" width="460" height="238" rx="4" class="d-ui" stroke-width="1"/>`,
    drawSculpt(kit, ball(), view({ at: [250, 120], scale: 62 })),
    `<rect x="24" y="200" width="452" height="76" rx="4" class="d-paper" stroke-width="1.2"/>`,
    brushes.map((name, i) => [
      `<rect x="${36 + i * 108}" y="208" width="96" height="60" rx="5" class="${name === 'Draw' ? 'd-ui-mark' : 'd-ui'}" stroke-width="1.2"/>`,
      kit.circle(84 + i * 108, 228, 11, { cls: 'd-ink', width: 1.4 }),
      kit.text(84 + i * 108, 258, name, { anchor: 'middle', size: 11 }),
    ]),
    kit.text(470, 196, 'asset shelf', { anchor: 'end', size: 11, cls: 'd-label' }),
    keycap(kit, 434, 64, 'Shift+Space', { size: 10 }),
  );
};

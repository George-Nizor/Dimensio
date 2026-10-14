// Sculpt Mode for the Curves object, chosen from the mode menu in the 3D Viewport's header, and
// the brushes in the asset shelf along the bottom of the viewport.
import { menuPath } from './helpers.mjs';

export default (kit) => {
  const brushes = ['Add', 'Density', 'Comb', 'Grow/Shrink', 'Delete', 'Smooth'];
  return kit.svg({ width: 500, height: 210 },
    `<rect x="10" y="10" width="480" height="190" rx="6" class="d-ui" stroke-width="1"/>`,
    `<rect x="10" y="10" width="480" height="30" rx="6" class="d-sunk" stroke-width="1"/>`,
    `<rect x="18" y="15" width="120" height="20" rx="4" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(28, 29, 'Sculpt Mode  v', { size: 11 }),
    kit.text(150, 29, 'the mode menu', { size: 11 }),
    kit.text(250, 110, '3D Viewport', { anchor: 'middle', size: 12 }),
    `<rect x="10" y="146" width="480" height="54" rx="6" class="d-sunk" stroke-width="1"/>`,
    brushes.map((name, i) => [
      `<rect x="${20 + i * 78}" y="154" width="70" height="38" rx="5" class="${['Add', 'Comb', 'Grow/Shrink'].includes(name) ? 'd-ui-mark' : 'd-paper'}" stroke-width="1"/>`,
      kit.text(55 + i * 78, 178, name, { anchor: 'middle', size: 10 }),
    ]),
    kit.text(250, 138, 'asset shelf', { anchor: 'middle', size: 11 }),
  );
};

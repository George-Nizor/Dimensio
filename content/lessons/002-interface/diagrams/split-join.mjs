// Two areas side by side. Dragging the border between them resizes them; dragging from a corner
// into the area splits it, along the dashed line.
import { cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => kit.svg({ width: 480, height: 240 },
  `<rect x="20" y="20" width="250" height="190" rx="5" class="d-ui" stroke-width="1.2"/>`,
  `<rect x="276" y="20" width="184" height="190" rx="5" class="d-ui" stroke-width="1.2"/>`,
  kit.line(273, 90, 273, 140, { cls: 'd-mark', width: 3 }),
  kit.line(252, 115, 294, 115, { cls: 'd-mark', width: 2 }),
  kit.arrowhead(252, 115, Math.PI, { size: 8 }), kit.arrowhead(294, 115, 0, { size: 8 }),
  kit.text(300, 146, 'drag the border', { size: 12 }),
  kit.line(148, 30, 148, 200, { cls: 'd-guide', width: 1.6, dash: '6 6' }),
  kit.line(32, 32, 148, 32, { cls: 'd-mark', width: 2 }),
  kit.arrowhead(148, 32, 0, { size: 8 }),
  cursor(kit, 26, 26),
  kit.text(84, 64, 'drag from', { anchor: 'middle', size: 12 }),
  kit.text(84, 80, 'a corner', { anchor: 'middle', size: 12 }),
  kit.text(148, 228, 'the new split', { anchor: 'middle', size: 12 }),
);

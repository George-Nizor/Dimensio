// The snapping popover with Face Project chosen under Snap Target for Individual Elements, and a
// vertex moved with G sliding over the sculpt's surface instead of off it.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const surface = Array.from({ length: 41 }, (_, i) => { const t = i / 40; return [250 + t * 230, 150 - Math.sin(t * Math.PI) * 60 - Math.sin(t * 9) * 6]; });
  const at = (t) => surface[Math.round(t * 40)];
  return kit.svg({ width: 500, height: 210 },
    `<rect x="14" y="14" width="210" height="150" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 36, 'Snapping', { size: 12 }),
    kit.text(26, 60, 'Snap Target for', { size: 11, cls: 'd-label' }),
    kit.text(26, 74, 'Individual Elements', { size: 11, cls: 'd-label' }),
    `<rect x="22" y="86" width="194" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(36, 102, 'Face Project', { size: 11 }),
    kit.text(36, 130, 'Face Nearest', { size: 11 }),
    keycap(kit, 120, 190, 'Shift+Tab', { size: 11 }),
    kit.smooth(surface, { cls: 'd-ink', width: 2.4 }),
    kit.circle(...at(0.3), 4, { cls: 'd-guide', width: 1.6 }),
    kit.smooth([0.3, 0.38, 0.46, 0.54, 0.62].map(at).map(([x, y]) => [x, y - 10]), { cls: 'd-mark', width: 2, dash: '5 4' }),
    kit.arrowhead(at(0.62)[0], at(0.62)[1] - 10, 0.1, { size: 8 }),
    kit.dot(...at(0.66), { r: 5, cls: 'd-mark-fill' }),
    kit.text(365, 190, 'G slides it over the surface', { anchor: 'middle', size: 12 }),
  );
};

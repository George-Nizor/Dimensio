// The navigation gizmo with its four buttons below it: zoom (a magnifying glass), pan (a hand),
// the camera view and the projection. The zoom and pan buttons are picked out.
import { view, navGizmo } from '../../../diagrams/mesh.mjs';

const button = (kit, x, y, on, icon, label) => [
  `<circle cx="${x}" cy="${y}" r="16" class="${on ? 'd-ui-mark' : 'd-ui'}" stroke-width="1.2"/>`,
  icon,
  kit.text(x + 30, y + 4, label, { size: 12 }),
];

export default (kit) => {
  const cx = 70;
  const magnifier = [kit.circle(cx - 3, 108, 6, { cls: 'd-ink', width: 1.8 }), kit.line(cx + 1.5, 112.5, cx + 7, 118, { cls: 'd-ink', width: 2.2 })];
  const hand = [
    kit.path(`M ${cx - 6} 152 L ${cx - 6} 142 M ${cx - 2} 151 L ${cx - 2} 139 M ${cx + 2} 151 L ${cx + 2} 140 M ${cx + 6} 152 L ${cx + 6} 143`, { cls: 'd-ink', width: 2 }),
    kit.path(`M ${cx - 8} 150 Q ${cx - 8} 160 ${cx} 160 Q ${cx + 8} 160 ${cx + 8} 150`, { cls: 'd-ink', width: 1.8 }),
  ];
  const camera = [`<rect x="${cx - 8}" y="182" width="12" height="10" rx="2" class="d-key" stroke-width="1.6"/>`, kit.path(`M ${cx + 4} 185 L ${cx + 9} 182 L ${cx + 9} 192 L ${cx + 4} 189`, { cls: 'd-ink', width: 1.5 })];
  const grid = [kit.path(`M ${cx - 8} 236 L ${cx - 4} 224 L ${cx + 4} 224 L ${cx + 8} 236 Z M ${cx - 6} 230 L ${cx + 6} 230 M ${cx} 224 L ${cx} 236`, { cls: 'd-ink', width: 1.4 })];
  return kit.svg({ width: 300, height: 262 },
    navGizmo(kit, cx, 48, view({ scale: 20 }), { radius: 34 }),
    button(kit, cx, 112, true, magnifier, 'zoom: drag'),
    button(kit, cx, 152, true, hand, 'pan: drag'),
    button(kit, cx, 192, false, camera, 'look through the camera'),
    button(kit, cx, 232, false, grid, 'perspective or orthographic'),
  );
};

// The Curve to Tube modifier in the Properties editor: Scale (the radius), the profile's
// Resolution, Caps and UV Map, beside the tube it makes.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { DEFAULT_CURVE, pathPoints, tube } from './curves.mjs';

export default (kit) => {
  const row = (y, label, value, on) => [
    kit.text(40, y + 14, label, { size: 12 }),
    value === 'check'
      ? [`<rect x="150" y="${y + 3}" width="14" height="14" rx="3" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`]
      : [`<rect x="150" y="${y}" width="90" height="20" rx="4" class="d-sunk" stroke-width="1"/>`, kit.text(195, y + 14, value, { anchor: 'middle', size: 12, cls: 'd-key-text' })],
  ];
  const v = view({ azimuth: 0, elevation: 50, at: [392, 104], scale: 92 });
  return kit.svg({ width: 520, height: 210 },
    `<rect x="24" y="20" width="236" height="170" rx="6" class="d-ui" stroke-width="1"/>`,
    `<rect x="24" y="20" width="236" height="28" rx="6" class="d-sunk" stroke-width="1"/>`,
    kit.text(40, 39, 'Curve to Tube', { size: 12 }),
    row(58, 'Scale', '0.15 m'),
    row(90, 'Resolution', '6'),
    row(122, 'Caps', 'check', true),
    row(154, 'UV Map', 'check', true),
    drawMesh(kit, tube(pathPoints(DEFAULT_CURVE, 8), 0.15, 6, { caps: true }), v, { width: 1 }),
  );
};

// The material's name field reading Red, and the Base Color field opened into a colour wheel.
import { field } from './parts.mjs';

export default (kit) => {
  const out = [
    `<rect x="20" y="16" width="250" height="26" rx="4" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(32, 34, 'Red', { size: 12 }),
    kit.text(280, 34, 'double-click to rename', { size: 11 }),
    kit.text(20, 66, 'Surface: Principled BSDF', { size: 12 }),
    kit.text(82, 92, 'Base Color', { anchor: 'end', size: 11 }),
    `<rect x="90" y="80" width="140" height="20" rx="4" class="d-gizmo-x" stroke-width="1"/>`,
    field(kit, 20, 118, 'Metallic', '0.000', { labelWidth: 70, width: 140 }),
    field(kit, 20, 142, 'Roughness', '0.500', { labelWidth: 70, width: 140 }),
  ];
  // The colour wheel: rings of a few hues around a white middle, drawn with the theme's colours.
  const cx = 360;
  const cy = 150;
  const hues = ['d-gizmo-x', 'd-mark-fill', 'd-gizmo-y', 'd-gizmo-z'];
  for (let i = 0; i < 24; i += 1) {
    const a0 = (i / 24) * Math.PI * 2;
    const a1 = ((i + 1) / 24) * Math.PI * 2;
    const p = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    const [x0, y0] = p(a0, 70); const [x1, y1] = p(a1, 70);
    out.push(`<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A 70 70 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" class="${hues[Math.floor(i / 6)]}" stroke-width="0" opacity="0.85"/>`);
  }
  out.push(kit.circle(cx, cy, 70, { cls: 'd-ink', width: 1.2 }));
  out.push(`<circle cx="${cx}" cy="${cy}" r="22" class="d-paper" stroke-width="0" opacity="0.8"/>`);
  out.push(kit.circle(cx + 52, cy + 22, 6, { cls: 'd-ink', width: 2 }));
  out.push(kit.line(230, 90, 292, 120, { cls: 'd-guide', width: 1.2 }));
  return kit.svg({ width: 450, height: 240 }, out);
};

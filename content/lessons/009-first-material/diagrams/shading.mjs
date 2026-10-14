// The four shading buttons in the viewport header, Wireframe, Solid, Material Preview and
// Rendered, with Material Preview picked out, and Z for the same choices as a pie.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const names = [['Wireframe'], ['Solid'], ['Material', 'Preview'], ['Rendered']];
  const out = [`<rect x="20" y="24" width="292" height="40" rx="5" class="d-sunk" stroke-width="1"/>`];
  names.forEach((lines, i) => {
    const x = 30 + i * 72;
    const cx = x + 26;
    const on = i === 2;
    out.push(`<rect x="${x}" y="32" width="52" height="24" rx="4" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`);
    if (i === 0) out.push(kit.circle(cx, 44, 7, { cls: 'd-ink', width: 1.2 }), kit.line(cx - 7, 44, cx + 7, 44, { cls: 'd-ink', width: 1 }));
    if (i === 1) out.push(`<circle cx="${cx}" cy="44" r="7" class="d-face-3" stroke-width="0"/>`, kit.circle(cx, 44, 7, { cls: 'd-ink', width: 1.2 }));
    if (i === 2) out.push(kit.circle(cx, 44, 7, { cls: 'd-paper', width: 1.6 }));
    if (i === 3) out.push(kit.circle(cx, 44, 7, { cls: 'd-ink', width: 1.2 }), kit.dot(cx - 2, 41, { r: 2, cls: 'd-mark-fill' }));
    lines.forEach((line, j) => out.push(kit.text(cx, 84 + j * 15, line, { anchor: 'middle', size: 11, cls: on ? 'd-tag' : 'd-label' })));
  });
  out.push(keycap(kit, 360, 44, 'Z'));
  out.push(kit.text(360, 84, 'the same four', { anchor: 'middle', size: 11 }));
  out.push(kit.text(360, 99, 'as a pie', { anchor: 'middle', size: 11 }));
  return kit.svg({ width: 420, height: 112 }, out);
};

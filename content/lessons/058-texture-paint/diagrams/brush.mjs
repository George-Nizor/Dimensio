// Brushes: the asset shelf along the bottom of the 3D Viewport, with four of the Essentials
// brushes, also opened with Shift+Space. F
// changes the brush size and Shift+F its strength, by moving the mouse.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const out = [`<rect x="14" y="14" width="440" height="150" rx="4" class="d-ui" stroke-width="1"/>`];
  out.push(`<rect x="18" y="124" width="432" height="36" rx="3" class="d-ui-mark" stroke-width="1.2"/>`);
  ['Paint Hard', 'Paint Soft', 'Blur', 'Fill'].forEach((name, i) => {
    const x = 30 + i * 106;
    out.push(`<rect x="${x}" y="129" width="26" height="26" rx="4" class="d-key" stroke-width="1"/>`);
    out.push(`<circle cx="${x + 13}" cy="142" r="${i === 0 ? 8 : 6}" class="d-dot" stroke-width="0" opacity="${i === 1 ? 0.5 : 0.8}"/>`);
    out.push(kit.text(x + 31, 146, name, { size: 10 }));
  });
  out.push(kit.text(234, 118, 'asset shelf', { size: 12, anchor: 'middle', cls: 'd-tag' }));
  // Brush circles of two sizes, and the keys.
  out.push(kit.circle(110, 66, 16, { cls: 'd-ink', width: 1.4 }), kit.circle(175, 66, 30, { cls: 'd-ink', width: 1.4 }));
  out.push(kit.line(130, 66, 140, 66, { cls: 'd-mark', width: 1.6 }), kit.arrowhead(142, 66, 0, { size: 6 }));
  out.push(keycap(kit, 54, 66, 'F'));
  out.push(keycap(kit, 280, 66, 'Shift+F', { size: 12 }));
  out.push(`<circle cx="370" cy="66" r="24" class="d-dot" stroke-width="0" opacity="0.25"/>`, `<circle cx="420" cy="66" r="24" class="d-dot" stroke-width="0" opacity="0.8"/>`);
  out.push(kit.text(110, 108, 'size', { size: 12, anchor: 'middle' }), kit.text(395, 108, 'strength', { size: 12, anchor: 'middle' }));
  out.push(keycap(kit, 120, 196, 'Shift+Space', { size: 12 }), kit.text(186, 201, 'brushes at the mouse', { size: 12 }));
  return kit.svg({ width: 470, height: 220 }, out);
};

// With Dyntopo ticked, a brush stroke splits the faces under it into smaller ones, adding detail only
// where you sculpt. Beside it, the Dyntopo panel with its Detail Size in pixels.
import { propRow } from './props.mjs';

export default (kit) => {
  const out = [];
  const x0 = 20;
  const y0 = 30;
  const s = 40;
  const inStroke = (cx, cy) => Math.abs(cy - (y0 + 80 + Math.sin((cx - x0) / 50) * 24)) < 26;
  for (let i = 0; i < 6; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const x = x0 + i * s;
      const y = y0 + j * s;
      if (inStroke(x + s / 2, y + s / 2)) {
        const k = s / 4;
        for (let a = 0; a < 4; a += 1) {
          for (let b = 0; b < 4; b += 1) {
            const px = x + a * k;
            const py = y + b * k;
            out.push(kit.polyline([[px, py], [px + k, py], [px + k, py + k], [px, py + k], [px, py], [px + k, py + k]], { cls: 'd-mark', width: 0.9 }));
          }
        }
      }
      out.push(kit.polyline([[x, y], [x + s, y], [x + s, y + s], [x, y + s], [x, y]], { cls: 'd-ink', width: 1.4 }));
    }
  }
  const stroke = Array.from({ length: 25 }, (_, i) => { const x = x0 + (i / 24) * 6 * s; return [x, y0 + 80 + Math.sin((x - x0) / 50) * 24]; });
  return kit.svg({ width: 480, height: 222 },
    out,
    kit.smooth(stroke, { cls: 'd-mark', width: 3 }),
    kit.text(140, 214, 'small faces only along the stroke', { anchor: 'middle', size: 12 }),
    `<rect x="284" y="40" width="182" height="96" rx="6" class="d-paper" stroke-width="1.2"/>`,
    `<rect x="290" y="48" width="170" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    propRow(kit, 294, 51, '', 'Dyntopo', { width: 160, split: 0.0, tick: true }),
    propRow(kit, 294, 92, 'Detail Size', '12 px', { width: 164, split: 0.52 }),
  );
};

// The Sequencer's timeline as a schematic: channels as rows, strips as bars along them, a frame
// ruler, the playhead and the scene's frame range. Not a diagram itself.
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

const TONE = { movie: 'd-face-2', image: 'd-face-2', text: 'd-face-sel', sound: 'd-face-3', color: 'd-face-1' };

// strips: [{ ch, start, end, label, kind, mark, bad }]; frames: [first, last] shown; end: the
// scene's End frame, drawn as the edge of the shaded range.
export function timeline(kit, { x, y, w, channels = 3, frames = [0, 500], strips = [], playhead, end, ticks = 100, row = 30 }) {
  const fx = (f) => x + 40 + ((f - frames[0]) / (frames[1] - frames[0])) * (w - 50);
  const top = y + 22;
  const h = channels * row;
  const out = [box(x, y, w, h + 30, { cls: 'd-ui', rx: 4 })];
  out.push(box(x, y, w, 20, { cls: 'd-sunk', rx: 4 }));
  for (let f = frames[0]; f <= frames[1]; f += ticks) out.push(kit.text(fx(f), y + 14, String(f), { anchor: 'middle', size: 10 }));
  if (end !== undefined) {
    out.push(`<rect x="${fx(end).toFixed(1)}" y="${top}" width="${(x + w - fx(end)).toFixed(1)}" height="${h}" class="d-face-3" stroke-width="0"/>`);
  }
  for (let c = 0; c < channels; c += 1) {
    const cy = top + h - (c + 1) * row;
    out.push(kit.text(x + 14, cy + row / 2 + 4, String(c + 1), { anchor: 'middle', size: 10, cls: 'd-label' }));
    out.push(kit.line(x + 28, cy + row, x + w - 4, cy + row, { cls: 'd-guide', width: 0.6 }));
  }
  for (const s of strips) {
    const cy = top + h - s.ch * row + 4;
    const sx = fx(s.start);
    const sw = fx(s.end) - sx;
    const cls = s.mark ? 'd-ui-mark' : TONE[s.kind] || 'd-face-2';
    out.push(`<rect x="${sx.toFixed(1)}" y="${cy}" width="${sw.toFixed(1)}" height="${row - 8}" rx="3" class="${cls}" stroke-width="1.3" style="stroke:var(--d-${s.bad ? 'bad' : 'ink'})"/>`);
    if (s.kind === 'sound') {
      for (let i = 0; i < sw - 8; i += 5) {
        const a = 3 + Math.abs(Math.sin(i * 0.37) * 6 + Math.sin(i * 0.11) * 3);
        out.push(kit.line(sx + 4 + i, cy + (row - 8) / 2 - a / 2, sx + 4 + i, cy + (row - 8) / 2 + a / 2, { cls: 'd-guide', width: 1.4 }));
      }
    }
    if (s.label) out.push(kit.text(sx + 6, cy + (row - 8) / 2 + 4, s.label, { size: 11 }));
  }
  if (end !== undefined) {
    // Hatching over everything after End, which a render leaves out.
    const x0 = fx(end);
    const x1 = x + w - 4;
    for (let k = -h; k < x1 - x0; k += 9) {
      const a = [x0 + k, top + h];
      const b = [x0 + k + h, top];
      const clip = (p, q) => {
        if (p[0] < x0) { const t = (x0 - p[0]) / (q[0] - p[0]); p = [x0, p[1] + (q[1] - p[1]) * t]; }
        if (q[0] > x1) { const t = (x1 - p[0]) / (q[0] - p[0]); q = [x1, p[1] + (q[1] - p[1]) * t]; }
        return [p, q];
      };
      const [p, q] = clip(a, b);
      if (q[0] > p[0]) out.push(kit.line(p[0], p[1], q[0], q[1], { cls: 'd-guide', width: 1 }));
    }
    out.push(kit.line(x0, top - 2, x0, top + h, { cls: 'd-ink', width: 1.8, dash: '4 3' }));
  }
  if (playhead !== undefined) out.push(kit.line(fx(playhead), y + 18, fx(playhead), top + h + 4, { cls: 'd-mark', width: 2 }));
  return { svg: out, fx, height: h + 30 };
}

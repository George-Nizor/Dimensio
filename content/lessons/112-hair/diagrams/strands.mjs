// Hair strands as this lesson's diagrams draw them, seen from the side: each strand grows from a
// root on a surface line and curves by `lean` (pixels the tip moves sideways). Not a diagram.
import { random } from '../../../diagrams/lib.mjs';

// One strand from (x, y) going up `length` pixels, its tip pushed `lean` pixels sideways.
export function strand(kit, x, y, length, lean, { cls = 'd-ink', width = 1.6 } = {}) {
  return kit.path(`M ${x.toFixed(1)} ${y.toFixed(1)} Q ${(x + lean * 0.2).toFixed(1)} ${(y - length * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(y - length * Math.cos(Math.min(Math.abs(lean) / length, 1.2))).toFixed(1)}`, { cls, width });
}

// A tuft: `n` strands rooted near (x, y), fanning out a little.
export function tuft(kit, x, y, { n = 7, length = 36, lean = 0, seed = 1, spread = 10, cls = 'd-ink' } = {}) {
  const next = random(seed);
  return Array.from({ length: n }, (_, i) => {
    const rx = x + (i - (n - 1) / 2) * (spread / n) * 2;
    const fan = (i - (n - 1) / 2) * 3;
    return strand(kit, rx, y, length * (0.8 + next() * 0.4), lean + fan + (next() - 0.5) * 6, { cls });
  });
}

// A ground tile seen from the side: a flat slab.
export const tile = (kit, x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="16" rx="2" class="d-face-2 d-ink" stroke-width="1.8"/>`;

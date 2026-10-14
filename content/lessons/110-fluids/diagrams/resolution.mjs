// Resolution Divisions cut the domain's longest side into voxels, the cells the fluid lives in.
// Left, 16 cells up the side: a blocky flame, quick to work out. Right, 32: finer, and about
// eight times the work.
import { panel } from './helpers.mjs';

export default (kit) => {
  const grid = (x, n, label) => {
    const size = 160 / n;
    const out = [panel(kit, x, 14, 120, 176, label)];
    for (let r = 0; r < n; r += 1) {
      for (let c = 0; c < Math.round(n * 0.62); c += 1) {
        const cx = (c + 0.5) / Math.round(n * 0.62) - 0.5;
        const cy = 1 - (r + 0.5) / n;
        const inside = cy > 0.04 && cy < 0.9 && Math.abs(cx + 0.04 * Math.sin(cy * 12)) < 0.4 * Math.pow(Math.sin(Math.PI * Math.min(cy / 0.9, 1) * 0.85 + 0.15), 0.8) * (1 - cy * 0.75);
        out.push(`<rect x="${(x + 10 + c * size).toFixed(1)}" y="${(22 + r * size).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" class="${inside ? 'd-face-sel d-mark' : 'd-paper d-guide'}" stroke-width="0.6"/>`);
      }
    }
    return out;
  };
  return kit.svg({ width: 460, height: 220 },
    grid(20, 16, '16'),
    grid(170, 32, '32'),
    kit.text(320, 50, 'Resolution Divisions', { size: 12, cls: 'd-tag' }),
    kit.text(320, 80, 'start low to test,', { size: 12 }),
    kit.text(320, 100, 'raise it for the', { size: 12 }),
    kit.text(320, 120, 'final bake', { size: 12 }),
  );
};

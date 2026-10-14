// A flame as one closed stroke, for the animation diagrams. Not a diagram itself. `sway` bends the
// tip sideways and `height` stretches it, so neighbouring drawings differ a little, as a flicker
// does. Interpolating two flames is interpolating their settings.

export function flamePoints(cx, base, { size = 40, sway = 0, height = 1.6, lean = 0 } = {}) {
  // Local coordinates, y up, the round bottom a circle of radius `size` centred at the origin.
  const n = 12;
  const side = (dir) => Array.from({ length: n + 1 }, (_, i) => {
    const k = i / n;
    return [dir * size * (1 - k) ** 0.75 + (sway * k * k + lean * k) * size, height * size * k];
  });
  const right = side(1).reverse();
  const bottom = Array.from({ length: 13 }, (_, i) => {
    const t = -(i / 12) * Math.PI;
    return [Math.cos(t) * size, Math.sin(t) * size];
  });
  const left = side(-1);
  return [...right, ...bottom.slice(1, -1), ...left.slice(0, -1)].map(([x, y]) => [cx + x, base - size - y]);
}

export const mix = (a, b, t) => Object.fromEntries(Object.keys(a).map((k) => [k, a[k] + (b[k] - a[k]) * t]));

export const KEYS = [
  { sway: 0.0, height: 1.6, lean: 0.0 },
  { sway: 0.55, height: 1.85, lean: 0.1 },
  { sway: -0.4, height: 1.45, lean: -0.05 },
  { sway: 0.3, height: 1.95, lean: -0.1 },
];

export function flame(kit, cx, base, settings, { size = 40, cls = 'd-ink', width = 2.4, fill = 'd-face-sel' } = {}) {
  const pts = flamePoints(cx, base, { size, ...settings });
  const d = `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
  return [fill ? `<path d="${d}" class="${fill}"/>` : '', kit.smooth(pts, { cls, width, closed: true })];
}

// Shared by this lesson's diagrams: the mushroom seen as a cut through its middle, as 2D outlines,
// and a way to rebuild an outline from even steps the way a remesh does. Not a diagram itself.

// The cap's outline: the top of an ellipse with a flat underside, centred on (cx, cy).
export function capOutline(cx, cy, rx, ry, steps = 48) {
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const a = Math.PI + (Math.PI * i) / steps;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
}

// The stem: a rectangle from the ground up into the cap.
export function stemOutline(cx, ground, top, halfWidth) {
  return [[cx - halfWidth, ground], [cx - halfWidth, top], [cx + halfWidth, top], [cx + halfWidth, ground]];
}

// The joined outline after a remesh: cap and stem as one skin, sampled every `step` pixels, the
// way voxels of that size rebuild it. `noise` adds the small bumps of sculpted detail.
export function unionOutline(cx, cy, rx, ry, stemHalf, ground, step = 6, noise = 0) {
  const raw = [];
  // Up the left of the stem, round the cap and down the right of the stem.
  for (let y = ground; y > cy; y -= 1) raw.push([cx - stemHalf, y]);
  const joinA = Math.PI + Math.asin(Math.min(1, stemHalf / rx));
  for (let x = cx - stemHalf; x > cx - rx; x -= 1) raw.push([x, cy]);
  for (let i = 0; i <= 200; i += 1) { const a = Math.PI + (Math.PI * i) / 200; raw.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  for (let x = cx + rx; x > cx + stemHalf; x -= 1) raw.push([x, cy]);
  for (let y = cy; y <= ground; y += 1) raw.push([cx + stemHalf, y]);
  void joinA;
  // Resample at even spacing.
  const out = [raw[0]];
  let carry = 0;
  for (let i = 1; i < raw.length; i += 1) {
    const [x0, y0] = raw[i - 1];
    const [x1, y1] = raw[i];
    const d = Math.hypot(x1 - x0, y1 - y0);
    carry += d;
    if (carry >= step) { out.push(raw[i]); carry = 0; }
  }
  out.push(raw[raw.length - 1]);
  if (!noise) return out;
  return out.map(([x, y], i) => [x + Math.sin(i * 2.7) * noise * 0.4, y + Math.sin(i * 1.9 + 1) * noise]);
}

// An outline with a dot on every vertex.
export function withVerts(kit, pts, { cls = 'd-ink', width = 2, r = 2.2 } = {}) {
  return [kit.polyline(pts, { cls, width }), pts.map(([x, y]) => kit.dot(x, y, { r, cls: 'd-mark-fill' }))];
}

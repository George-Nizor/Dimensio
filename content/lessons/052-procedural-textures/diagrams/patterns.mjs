// Small versions of Blender's texture patterns, for this lesson's diagrams. Not a diagram itself.
// Each pattern is a function from (u, v), 0 to 1, to a value from 0 to 1, as a texture's Factor
// is. swatch() draws one as a grid of small squares in the ink colour, more opaque where the value
// is higher, so it reads as a grey pattern in either theme. cells() gives the polygons of a Voronoi
// pattern, for drawing stones.

export function rng(seed) {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// Value noise: random values on a grid, smoothly blended, with a second, finer layer on top.
export function noise(seed = 3, scale = 4) {
  const next = rng(seed);
  const size = 64;
  const grid = Array.from({ length: size * size }, () => next());
  const at = (i, j) => grid[((j % size) + size) % size * size + (((i % size) + size) % size)];
  const smooth = (t) => t * t * (3 - 2 * t);
  const layer = (u, v, s) => {
    const x = u * s;
    const y = v * s;
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = smooth(x - i);
    const fy = smooth(y - j);
    const a = at(i, j) + (at(i + 1, j) - at(i, j)) * fx;
    const b = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * fx;
    return a + (b - a) * fy;
  };
  return (u, v) => layer(u, v, scale) * 0.65 + layer(u + 7.3, v + 3.1, scale * 2.2) * 0.35;
}

// Seed points for Voronoi cells, one jittered point in each square of a grid.
function seeds(seed, count) {
  const next = rng(seed);
  const points = [];
  for (let j = -1; j <= count; j += 1) {
    for (let i = -1; i <= count; i += 1) points.push([(i + 0.15 + next() * 0.7) / count, (j + 0.15 + next() * 0.7) / count]);
  }
  return points;
}

// Voronoi, Distance (F1): 0 at each seed, rising towards the edges of its cell.
export function voronoi(seed = 5, count = 4) {
  const points = seeds(seed, count);
  return (u, v) => Math.min(1, Math.min(...points.map(([x, y]) => Math.hypot(u - x, v - y))) * count * 1.3);
}

// The Voronoi cells inside the unit square, as polygons: the square cut by the bisector between
// each seed and every other seed.
export function cells(seed = 5, count = 4) {
  const points = seeds(seed, count);
  const clip = (poly, [ax, ay], [bx, by]) => {
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;
    const nx = bx - ax;
    const ny = by - ay;
    const side = ([x, y]) => (x - mx) * nx + (y - my) * ny;
    const out = [];
    poly.forEach((p, i) => {
      const q = poly[(i + 1) % poly.length];
      const sp = side(p);
      const sq = side(q);
      if (sp <= 0) out.push(p);
      if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) {
        const t = sp / (sp - sq);
        out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
      }
    });
    return out;
  };
  return points.map((seedPoint) => {
    let poly = [[0, 0], [1, 0], [1, 1], [0, 1]];
    for (const other of points) if (other !== seedPoint) poly = clip(poly, seedPoint, other);
    return { seed: seedPoint, poly };
  }).filter(({ poly }) => poly.length >= 3);
}

// Wave, Bands: stripes across u, bent by a little noise.
export function wave(seed = 7, bands = 5, distortion = 0.08) {
  const n = noise(seed, 3);
  return (u, v) => 0.5 + 0.5 * Math.sin((v + (n(u, v) - 0.5) * distortion * 4) * bands * Math.PI * 2);
}

// Brick: rows offset by half a brick, 1 on the mortar.
export function brick(rows = 5, perRow = 3, mortar = 0.06) {
  return (u, v) => {
    const r = Math.floor(v * rows);
    const x = u * perRow + (r % 2 ? 0.5 : 0);
    const fx = x - Math.floor(x);
    const fy = v * rows - r;
    return fx < mortar || fy < mortar * 1.6 ? 1 : 0.25 + 0.15 * ((Math.floor(x) * 7 + r * 3) % 3);
  };
}

export function swatch(kit, x, y, size, f, { cells: n = 24, cls = 'd-dot', back = true } = {}) {
  const step = size / n;
  const out = back ? [`<rect x="${x}" y="${y}" width="${size}" height="${size}" class="d-paper" stroke-width="0"/>`] : [];
  for (let j = 0; j < n; j += 1) {
    for (let i = 0; i < n; i += 1) {
      const value = Math.max(0, Math.min(1, f((i + 0.5) / n, (j + 0.5) / n)));
      if (value > 0.04) out.push(`<rect x="${(x + i * step).toFixed(1)}" y="${(y + j * step).toFixed(1)}" width="${(step + 0.4).toFixed(1)}" height="${(step + 0.4).toFixed(1)}" class="${cls}" stroke-width="0" opacity="${value.toFixed(2)}"/>`);
    }
  }
  out.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" class="d-ink" fill="none" stroke-width="1.2"/>`);
  return out;
}

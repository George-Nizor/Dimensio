// The barrel from lesson 36 and the shading-barrel starter, ring by ring. Not a diagram itself.
// A 12-sided cylinder of radius 0.55 m and depth 1.2 m, cut at 0.24, 0.48, 0.72 and 0.96 m, the
// four inner rings scaled by 1.15, bands at 0.24 to 0.48 m and 0.72 to 0.96 m standing 0.04 m
// proud, and a lid inset 0.06 m and sunk 0.05 m.
import { mesh } from '../../../diagrams/mesh.mjs';

export const RADIUS = 0.55;
export const HEIGHT = 1.2;
const BODY = RADIUS * 1.15;
const BAND = BODY + 0.04;
const LID = RADIUS - 0.06 / Math.cos(Math.PI / 12);
const LID_DEPTH = 0.05;
const H = (f) => f * HEIGHT;

// The stages the lesson's steps pass through. 'done' is the finished barrel.
export function profile(stage = 'done') {
  if (stage === 'cylinder') return [[0, RADIUS], [HEIGHT, RADIUS]];
  if (stage === 'rings') return [0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => [H(f), RADIUS]);
  if (stage === 'bulge') return [[0, RADIUS], ...[0.2, 0.4, 0.6, 0.8].map((f) => [H(f), BODY]), [HEIGHT, RADIUS]];
  const bands = [[0, RADIUS], [H(0.2), BODY], [H(0.2), BAND], [H(0.4), BAND], [H(0.4), BODY], [H(0.6), BODY], [H(0.6), BAND], [H(0.8), BAND], [H(0.8), BODY], [HEIGHT, RADIUS]];
  if (stage === 'bands') return bands;
  if (stage === 'inset') return [...bands, [HEIGHT, LID]];
  return [...bands, [HEIGHT, LID], [HEIGHT - LID_DEPTH, LID]];
}

// A ring of `sides` points at height z and distance r from the axis, moved sideways by `shift`.
export const ring = (z, r, shift = [0, 0], sides = 12) => [...Array(sides).keys()].map((i) => [Math.cos((2 * Math.PI * i) / sides) * r + shift[0], Math.sin((2 * Math.PI * i) / sides) * r + shift[1], z]);

export function barrel(stage = 'done', sides = 12) {
  return fromRings(profile(stage).map(([z, r]) => ring(z, r, [0, 0], sides)), sides);
}

export function fromRings(points, sides = 12) {
  const rings = points.map((p) => [p[0][2]]);
  const verts = points.flat();
  const faces = [];
  for (let k = 0; k < rings.length - 1; k += 1) {
    for (let i = 0; i < sides; i += 1) {
      const j = (i + 1) % sides;
      faces.push([k * sides + i, k * sides + j, (k + 1) * sides + j, (k + 1) * sides + i]);
    }
  }
  const last = (rings.length - 1) * sides;
  faces.push([...Array(sides).keys()], [...Array(sides).keys()].map((i) => last + i));
  return outwards(mesh(verts, faces));
}

// The barrel is not convex, so each face is turned the way out for this shape: sides away from the
// axis (the lid's wall towards it, into the sunken lid), flat rings and caps up or down.
function outwards(m) {
  const n = (f) => {
    const [a, b, c] = f.map((i) => m.verts[i]);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    return [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
  };
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  m.faces = m.faces.map((f) => {
    const c = f.reduce((s, i) => [s[0] + m.verts[i][0] / f.length, s[1] + m.verts[i][1] / f.length, s[2] + m.verts[i][2] / f.length], [0, 0, 0]);
    const nn = n(f);
    const flat = Math.abs(nn[2]) > 0.99 * Math.hypot(...nn);
    let want;
    if (!flat) {
      const lidWall = f.every((i) => Math.hypot(m.verts[i][0], m.verts[i][1]) < LID + 1e-6);
      want = (nn[0] * c[0] + nn[1] * c[1]) * (lidWall ? -1 : 1);
    } else {
      // Down: the base and the undersides of the bands. Up: the band tops, the rim and the lid.
      const z = m.verts[f[0]][2];
      const down = near(z, 0) || near(z, H(0.2)) || near(z, H(0.6));
      want = nn[2] * (down ? -1 : 1);
    }
    return want < 0 ? [...f].reverse() : f;
  });
  return m;
}

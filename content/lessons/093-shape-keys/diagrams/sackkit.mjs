// The sack from this lesson's exercise. Not a diagram itself. A round body with a narrow neck and
// a small flare at the top, 12 segments around, built as rings of vertices the way a UV sphere's
// rings sit: the Basis. The squash key moves the same vertices lower and wider. sack(value) blends
// the two the way a relative shape key does: Basis + value x (key - Basis), vertex by vertex.

// [radius, height] of each ring, from the bottom up.
const PROFILE = [[0.62, 0.0], [0.95, 0.28], [1.0, 0.7], [0.88, 1.1], [0.55, 1.42], [0.26, 1.6], [0.42, 1.84]];
const SEGMENTS = 12;

function lathe(profile) {
  const verts = [[0, 0, profile[0][1]]];
  profile.forEach(([r, z]) => {
    for (let s = 0; s < SEGMENTS; s += 1) {
      const t = (s / SEGMENTS) * Math.PI * 2;
      verts.push([Math.cos(t) * r, Math.sin(t) * r, z]);
    }
  });
  const top = verts.push([0, 0, profile[profile.length - 1][1]]) - 1;
  const ring = (k, s) => 1 + k * SEGMENTS + (s % SEGMENTS);
  const faces = [];
  for (let s = 0; s < SEGMENTS; s += 1) faces.push([0, ring(0, s + 1), ring(0, s)]);
  for (let k = 0; k < profile.length - 1; k += 1) {
    for (let s = 0; s < SEGMENTS; s += 1) faces.push([ring(k, s), ring(k, s + 1), ring(k + 1, s + 1), ring(k + 1, s)]);
  }
  for (let s = 0; s < SEGMENTS; s += 1) faces.push([ring(profile.length - 1, s), ring(profile.length - 1, s + 1), top]);
  return { verts, faces };
}

const basis = () => lathe(PROFILE);
const squashed = () => lathe(PROFILE.map(([r, z]) => [r * 1.3, z * 0.58]));

export function sack(value = 0) {
  const a = basis();
  const b = squashed();
  return { verts: a.verts.map((v, i) => v.map((c, k) => c + value * (b.verts[i][k] - c))), faces: a.faces };
}

// A rounded frame with a label under it.
export function frame(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

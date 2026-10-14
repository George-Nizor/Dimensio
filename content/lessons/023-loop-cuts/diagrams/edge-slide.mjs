// A ramp with one loop round it, slid with G G. Left, with Even (E): the loop keeps an even distance
// from the slope, parallel to it. Right, with Flipped (F) too: parallel to the base instead.
import { view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { panel, cutBox, copyMesh } from './helpers.mjs';

// The default cube with a loop round it, made into a ramp by lowering the top front edge 1.5 m;
// the loop sits 0.25 m below the slope (even) or 0.25 m above the base (flipped).
function ramp(flipped) {
  const m = copyMesh(cutBox({ cuts: { z: [0] } }));
  m.verts = m.verts.map(([x, y, z]) => {
    const front = y < -0.9;
    if (z > 0.9) return [x, y, front ? -0.5 : 1];
    if (Math.abs(z) < 1e-6) return [x, y, front ? -0.75 : flipped ? -0.75 : 0.75];
    return [x, y, z];
  });
  return m;
}

export default (kit) => {
  const left = view({ at: [126, 112], scale: 46, azimuth: 60, elevation: 16 });
  const right = view({ at: [384, 112], scale: 46, azimuth: 60, elevation: 16 });
  const even = ramp(false);
  const flip = ramp(true);
  const edgesOf = (m) => m.faces.flatMap((f) => f.map((a, i) => [a, f[(i + 1) % f.length]])).filter(([a, b]) => {
    const pa = m.verts[a];
    const pb = m.verts[b];
    const onLoop = (p) => Math.abs(p[2] + 0.75) < 1e-6 || (Math.abs(p[2] - 0.75) < 1e-6);
    return onLoop(pa) && onLoop(pb);
  });
  return kit.svg({ width: 510, height: 270 },
    panel(kit, 14, 14, 224, 184, 'Even: with the slope'),
    drawMesh(kit, even, left, { width: 1.4, select: { edges: edgesOf(even) } }),
    keycap(kit, 126, 248, 'E'),
    panel(kit, 272, 14, 224, 184, 'Flipped: with the base'),
    drawMesh(kit, flip, right, { width: 1.4, select: { edges: edgesOf(flip) } }),
    keycap(kit, 368, 248, 'E'), keycap(kit, 402, 248, 'F'),
  );
};

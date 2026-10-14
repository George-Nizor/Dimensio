// The table and tablecloth this lesson's diagrams draw, as real meshes. Not a diagram itself.
// The table matches the cloth-table starter: a 1.2 x 0.8 m top, 0.77 m high, on four legs. The
// draped cloth is the 1.8 x 1.4 m starter cloth after the fall: flat on the top, hanging over
// the edges with soft folds. Its shape is drawn from a simple rule, not simulated.
import { box, plane, join, transform } from '../../../diagrams/mesh.mjs';

const TOP = 0.77;

export function table() {
  const parts = [box({ size: [1.2, 0.8, 0.05], center: [0, 0, TOP - 0.025] })];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) parts.push(box({ size: [0.06, 0.06, TOP - 0.05], center: [sx * 0.52, sy * 0.32, (TOP - 0.05) / 2] }));
  return join(...parts);
}

// The cloth before it falls: a flat sheet 0.25 m above the table, cut into a grid.
export const sheet = (segments = [18, 14], z = TOP + 0.25) => plane({ size: [1.8, 1.4], segments, z });

// The cloth after it falls: whatever lies over the top stays flat; the rest hangs down the
// sides by the length it reaches past the edge, flaring a little and rippling into folds.
export function draped(segments = [18, 14]) {
  return transform(plane({ size: [1.8, 1.4], segments }), ([x, y]) => {
    const dx = Math.max(Math.abs(x) - 0.62, 0);
    const dy = Math.max(Math.abs(y) - 0.42, 0);
    const hang = Math.hypot(dx, dy);
    const ripple = 0.035 * Math.sin((Math.abs(x) > 0.62 ? y : x) * 18) * Math.min(hang * 4, 1);
    const nx = dx > 0 ? Math.sign(x) * (0.62 + dx * 0.12 + ripple) : x;
    const ny = dy > 0 ? Math.sign(y) * (0.42 + dy * 0.12 + ripple) : y;
    return [nx, ny, TOP + 0.01 - hang * 0.92];
  });
}

// A flat sheet that stays flat because it has only its four corners: it lies across the top
// and sticks straight out past the edges.
export const stiff = () => plane({ size: [1.8, 1.4], segments: [1, 1], z: TOP + 0.01 });

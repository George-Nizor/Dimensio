// Straightening the lid's bent strip. Left, one of its faces unwrapped on its own (orange), a true
// rectangle, with the rest of the strip still bent. Right, after Follow Active Quads the whole strip
// follows that face in a straight line.
import { uvSquare, drawUVs } from './uv.mjs';
import { messy, even } from './chestuv.mjs';

export default (kit) => {
  const before = messy();
  const after = even();
  const strip = before.islands.lid;
  // The face unwrapped alone, drawn where Unwrap puts it: the straight strip's third face.
  const single = after.uvs[strip[2]].map(([u, v]) => [u + 0.2, v + 0.62]);
  const uvsBefore = before.uvs.map((uv, i) => (i === strip[2] ? single : uv));
  return kit.svg({ width: 520, height: 270 },
    uvSquare(kit, 30, 20, 210, { labels: false }),
    drawUVs(kit, uvsBefore, 30, 20, 210, { only: strip, select: [strip[2]] }),
    kit.text(135, 258, 'one face unwrapped alone', { anchor: 'middle', size: 12 }),
    uvSquare(kit, 290, 20, 210, { labels: false }),
    drawUVs(kit, after.uvs, 290, 20, 210, { only: strip, select: [strip[2]] }),
    kit.text(395, 258, 'Follow Active Quads', { anchor: 'middle', size: 12 }),
  );
};

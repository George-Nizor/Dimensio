// The Pipe in Face select mode with the band of faces in its fourth row selected, after Alt+click
// near a vertical edge inside the band.
import { view, drawMesh, cursor } from '../../../diagrams/mesh.mjs';
import { pipe, bandAt } from './shapes.mjs';

export default (kit) => {
  const t = pipe();
  const v = view({ at: [170, 140], scale: 82, target: [0, 0, 1] });
  const a = (2 * Math.PI * 11) / 12;
  const [x, y] = v.project([0.5 * Math.cos(a), 0.5 * Math.sin(a), 1.17]);
  return kit.svg({ width: 400, height: 280 },
    drawMesh(kit, t, v, { width: 1.3, select: { faces: bandAt(3) } }),
    cursor(kit, x, y),
    kit.text(300, 150, 'Alt + click, Face mode', { anchor: 'middle', size: 12 }),
  );
};

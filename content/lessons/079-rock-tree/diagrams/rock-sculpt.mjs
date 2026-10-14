// The rock begins as a cube scaled to about 0.6 m. Ctrl+R remeshes it into even quads to sculpt, and
// Grab and Clay Strips push it into a lumpy rock.
import { view, drawMesh, box, keycap, transform } from '../../../diagrams/mesh.mjs';

const roundCube = (round, lumps = 0) => transform(box({ size: [0.6, 0.6, 0.6], segments: [8, 8, 8] }), ([x, y, z]) => {
  const l = Math.hypot(x, y, z) || 1;
  const k = (1 - round) + round * (0.3 * 1.25) / l;
  const wave = 1 + lumps * (Math.sin(x * 14 + 1) * Math.sin(y * 11) + Math.sin(z * 13 + 2) * 0.6);
  return [x * k * wave, y * k * wave * 0.85, z * k * wave * 0.7];
});

export default (kit) => {
  const at = (x) => view({ scale: 150, elevation: 22, target: [0, 0, 0], at: [x, 112] });
  return kit.svg({ width: 520, height: 210 },
    drawMesh(kit, box({ size: [0.6, 0.6, 0.6] }), at(76), { width: 1.4 }),
    keycap(kit, 172, 70, 'Ctrl+R', { size: 11 }),
    kit.line(148, 112, 196, 112, { cls: 'd-mark', width: 2 }), kit.arrowhead(198, 112, 0, { size: 8 }),
    drawMesh(kit, roundCube(0.15), at(268), { width: 0.6 }),
    kit.line(338, 112, 376, 112, { cls: 'd-mark', width: 2 }), kit.arrowhead(378, 112, 0, { size: 8 }),
    drawMesh(kit, roundCube(0.6, 0.12), at(446), { width: 0.6 }),
    kit.text(76, 196, 'cube, 0.6 m', { anchor: 'middle', size: 12 }),
    kit.text(268, 196, 'remeshed', { anchor: 'middle', size: 12 }),
    kit.text(446, 196, 'sculpted', { anchor: 'middle', size: 12 }),
  );
};

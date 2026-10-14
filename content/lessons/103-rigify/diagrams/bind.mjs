// The body bound to the generated rig and posed: the left arm lifted by its wrist ring, the
// right foot stepped out by its foot box, the mesh bending with them. Ctrl+P, With Automatic
// Weights, does the binding.
import { silhouette, panel } from './helpers.mjs';
import { front } from './rig.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

const rad = (d) => (d * Math.PI) / 180;
const step = (from, length, degrees) => [from[0] + Math.cos(rad(degrees)) * length, from[1] + Math.sin(rad(degrees)) * length];

export default (kit) => {
  const p = front(150, 262, 118);
  const s = (pt) => p(pt);
  const sh = [0.17, 1.4];
  const elbowL = step(sh, 0.28, 30);
  const wristL = step(elbowL, 0.24, 75);
  const handL = step(wristL, 0.1, 80);
  const shR = [-0.17, 1.4];
  const elbowR = step(shR, 0.28, 210);
  const wristR = step(elbowR, 0.24, 210);
  const handR = step(wristR, 0.1, 210);
  const hipR = [-0.11, 0.9];
  const kneeR = step(hipR, 0.42, 252);
  const ankleR = step(kneeR, 0.4, 260);
  const r = 118;
  const parts = [
    [[0, 0.95], [0, 1.1], 0.15], [[0, 1.1], [0, 1.3], 0.14], [[0, 1.3], [0, 1.4], 0.16],
    [[0, 1.4], [0, 1.5], 0.05], [[0, 1.56], [0, 1.64], 0.095],
    [sh, shR, 0.06], [[0.11, 0.92], [-0.11, 0.92], 0.08],
    [sh, elbowL, 0.06], [elbowL, wristL, 0.046], [wristL, handL, 0.042],
    [shR, elbowR, 0.06], [elbowR, wristR, 0.046], [wristR, handR, 0.042],
    [[0.11, 0.9], [0.11, 0.48], 0.072], [[0.11, 0.48], [0.11, 0.085], 0.055], [[0.11, 0.085], [0.11, 0.04], 0.045],
    [hipR, kneeR, 0.072], [kneeR, ankleR, 0.055],
  ].map(([a, b, w]) => [s(a), s(b), w * r]);
  const [wx, wy] = s(wristL);
  const [fx, fy] = s(ankleR);
  return kit.svg({ width: 460, height: 300 },
    panel(kit, 20, 10, 260, 270),
    silhouette(kit, parts, { width: 1.4 }),
    kit.ellipse(wx, wy, 10, 10, { cls: 'd-mark', width: 2.2 }),
    `<rect x="${(fx - 13).toFixed(1)}" y="${(fy + 4).toFixed(1)}" width="26" height="10" rx="2" class="d-mark" fill="none" stroke-width="2.2"/>`,
    keycap(kit, 370, 110, 'Ctrl+P', { size: 13 }),
    kit.text(370, 146, 'With Automatic', { anchor: 'middle', size: 12 }),
    kit.text(370, 162, 'Weights', { anchor: 'middle', size: 12 }),
  );
};

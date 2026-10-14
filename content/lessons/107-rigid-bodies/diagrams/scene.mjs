// The wall, ball and ground this lesson's diagrams draw, built as real meshes. Not a diagram.
// Blocks are 0.25 x 0.5 x 0.5 m, five across and four high, standing on the ground at Y 0; the
// ball is 0.7 m across.
import { box, plane, uvSphere, translate, rotate, join } from '../../../diagrams/mesh.mjs';

export const block = (x, y, z, turn = 0, tilt = 0) => translate(rotate(rotate(box({ size: [0.25, 0.5, 0.5] }), 'z', turn), 'y', tilt), [x, y, z]);

// The standing wall.
export function wall() {
  const parts = [];
  for (let row = 0; row < 4; row += 1) for (let col = 0; col < 5; col += 1) parts.push(block(0, col * 0.52 - 1.04, 0.25 + row * 0.505));
  return join(...parts);
}

// The wall after the ball went through it: blocks tumbled and scattered, some still standing.
export function knocked() {
  const spots = [
    [0, -1.04, 0.25], [0, 1.04, 0.25], [0.1, -0.5, 0.25, 10], [0.2, 0.55, 0.25, -15], [0, 1.04, 0.755],
    [0.8, 0.2, 0.15, 40, 80], [1.2, -0.4, 0.15, -20, 90], [1.6, 0.6, 0.15, 60, 85], [1.0, 1.0, 0.15, 10, 90],
    [2.0, -0.1, 0.15, 30, 90], [1.4, -1.1, 0.15, -50, 85], [0.6, -0.9, 0.3, 20, 30], [2.4, 0.4, 0.15, 75, 90],
  ];
  return join(...spots.map(([x, y, z, turn = 0, tilt = 0]) => block(x, y, z, turn, tilt)));
}

export const ball = (x, y = 0, z = 0.35) => uvSphere({ segments: 12, rings: 6, radius: 0.35, center: [x, y, z] });
export const ground = (size = 7) => plane({ size: [size, size] });

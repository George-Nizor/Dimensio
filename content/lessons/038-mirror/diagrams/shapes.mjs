// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { mirror, join } from '../../../diagrams/mesh.mjs';
import { slab } from '../../037-modifiers/diagrams/modkit.mjs';

// The right half of the shield from the exercise: a board 1 m wide, 1.2 m tall and 0.1 m deep,
// cut down the middle, with its bottom corner moved to the middle line to make the point.
export function halfShield() {
  return slab([[0, 0.6], [0, -0.2], [0.5, -0.2], [0.5, 0.6], [0, -0.6]], [[1, 2, 3, 0], [4, 2, 1]], 0.1);
}

// The same half before the corner moved: half of the board.
export function halfBoard() {
  return slab([[0, 0.6], [0, -0.2], [0.5, -0.2], [0.5, 0.6], [0, -0.6], [0.5, -0.6]], [[1, 2, 3, 0], [4, 5, 2, 1]], 0.1);
}

// What the Mirror modifier adds: the half flipped across X 0, the plane through the origin.
export const mirrored = (m) => mirror(m, 'x');
export const whole = (m) => join(m, mirror(m, 'x'));

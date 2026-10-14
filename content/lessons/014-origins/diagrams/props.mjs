// The exercise's crate, door and lamp. Not a diagram itself.
import { box, cube, translate, join } from '../../../diagrams/mesh.mjs';

export const crate = (at = [0, 0]) => translate(cube(1), [at[0], at[1], 0.5]);
export const door = (at = [0, 0]) => box({ size: [0.9, 0.1, 2.1], center: [at[0], at[1], 1.05] });
export const lamp = () => join(
  box({ size: [0.4, 0.4, 0.1], center: [0, 0, 0.05] }),
  box({ size: [0.12, 0.12, 2.2], center: [0, 0, 1.2] }),
  box({ size: [0.3, 0.3, 0.3], center: [0, 0, 2.45] }),
);

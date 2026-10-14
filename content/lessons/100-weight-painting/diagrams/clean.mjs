// The Weights menu in Weight Paint mode with Normalize All and Limit Total, and Limit Total's
// options panel set to a Limit of 4, the most bone influences a glTF exporter writes by default.
import { menu, row } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from './shoulder.mjs';

export default (kit) => kit.svg({ width: 470, height: 240 },
  menu(kit, 20, 20, ['Normalize All', 'Normalize', 'Mirror', 'Invert', 'Clean', 'Limit Total', 'Smooth'], { w: 180, mark: 'Limit Total', title: 'Weights' }),
  frame(kit, 226, 40, 230, 96),
  kit.text(240, 64, 'Limit Total', { size: 13 }),
  row(kit, 230, 78, 70, 140, 'Limit', '4', { mark: true }),
  kit.text(226, 170, 'Normalize All: each vertex\'s', { size: 12 }),
  kit.text(226, 190, 'weights add up to 1', { size: 12 }),
  kit.text(226, 216, 'Limit Total: at most 4 bones a vertex', { size: 12 }),
);

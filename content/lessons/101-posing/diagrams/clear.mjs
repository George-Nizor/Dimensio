// Clearing a pose: with every bone selected (A), Alt+G, Alt+R and Alt+S clear location, rotation
// and scale, and the character returns to its rest pose.
import { views, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { pageArrow } from '../../092-drivers/diagrams/animkit.mjs';
import { character, frame } from '../../097-character-modelling/diagrams/charkit.mjs';
import { WAVE } from './poses.mjs';

export default (kit) => {
  const cell = (x, pose, label) => {
    const v = views.front({ at: [x + 90, 140], scale: 90, target: [0, 0, 0.95] });
    return [frame(kit, x, 14, 180, 230, label), drawMesh(kit, character(pose).mesh, v, { width: 0.7 })];
  };
  return kit.svg({ width: 520, height: 280 },
    cell(14, WAVE, 'posed'),
    keycap(kit, 260, 60, 'A', { size: 13 }),
    keycap(kit, 260, 100, 'Alt+G', { size: 13 }),
    keycap(kit, 260, 140, 'Alt+R', { size: 13 }),
    keycap(kit, 260, 180, 'Alt+S', { size: 13 }),
    pageArrow(kit, 214, 214, 316, 214),
    cell(326, {}, 'rest pose'),
  );
};

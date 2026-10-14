// Weight Paint mode on the left shoulder, seen from the front, with the upper arm's group active:
// full weight (strongest colour) along the arm, fading to none at the torso. Below, the colour
// scale from 0 to 1.
import { weightLegend } from '../../097-character-modelling/diagrams/charkit.mjs';
import { shoulder } from './shoulder.mjs';

export default (kit) => kit.svg({ width: 460, height: 210 },
  shoulder(kit, 170, 70, { weights: [0, 0.35, 0.7, 1, 1, 1, 1, 1] }),
  kit.text(142, 44, 'torso', { anchor: 'middle', size: 12 }),
  kit.text(250, 44, 'upper_arm.L', { anchor: 'middle', size: 12 }),
  weightLegend(kit, 170, 176, 160),
  kit.text(250, 202, 'weight', { anchor: 'middle', size: 12 }),
);

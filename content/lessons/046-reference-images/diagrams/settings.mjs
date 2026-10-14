// The Empty panel in the Object Data tab, set up for a reference picture: 1 m tall, standing on its
// bottom edge, behind the model, only in its own orthographic view, at half opacity.
import { settings } from './shapes.mjs';

export default (kit) => kit.svg({ width: 420, height: 290 },
  settings(kit, 40, 14, 340, 'Empty', [
    ['Size', '1 m'],
    ['Offset X', '-0.5'],
    ['Y', '0'],
    ['Depth', 'Back'],
    ['Show In', true, 'Orthographic'],
    ['', false, 'Perspective'],
    ['', true, 'Only Axis Aligned'],
    ['Opacity', true, '0.5'],
  ], { mark: ['Size', 'Y', 'Depth', 'Opacity'] }),
);

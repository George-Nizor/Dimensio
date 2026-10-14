// The Viewport Overlays popover with Face Orientation ticked, and the crate it shows: the backs of
// its top and front faces red, the other faces in their usual colour.
import { view } from '../../../diagrams/mesh.mjs';
import { crate, red, checkboxes } from './shapes.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 24, at: [150, 120], scale: 120, target: [0, 0, 0.5] });
  return kit.svg({ width: 500, height: 240 },
    paint(kit, crate(true), v, { width: 1.6, fill: red, fillOpacity: 0.75 }),
    checkboxes(kit, 290, 60, 'Viewport Overlays', [['Statistics', false], ['Face Orientation', true]]),
  );
};

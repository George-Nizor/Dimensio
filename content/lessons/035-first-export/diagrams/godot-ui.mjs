// The Godot editor as it opens: the Scene dock top left, the FileSystem dock below it, the 3D
// viewport in the middle and the Inspector on the right. crate.glb has been dragged onto the
// FileSystem dock and is listed there.
import { view } from '../../../diagrams/mesh.mjs';
import { dock, row, grid } from './godot.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 28, at: [250, 140], scale: 34, target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 250 },
    `<rect x="10" y="10" width="480" height="230" rx="6" class="d-ui" stroke-width="1"/>`,
    dock(kit, 16, 18, 120, 100, 'Scene'),
    row(kit, 16, 28 + 10, 120, '2D Scene'), row(kit, 16, 58, 120, '3D Scene'), row(kit, 16, 78, 120, 'User Interface'),
    dock(kit, 16, 124, 120, 110, 'FileSystem'),
    row(kit, 16, 146, 120, 'res://'), row(kit, 16, 166, 120, 'crate.glb', { mark: true, indent: 10 }),
    `<rect x="142" y="18" width="216" height="216" rx="4" class="d-paper" stroke-width="1"/>`,
    grid(kit, v, 4),
    kit.text(250, 226, 'viewport', { anchor: 'middle', size: 11 }),
    dock(kit, 364, 18, 120, 216, 'Inspector'),
  );
};

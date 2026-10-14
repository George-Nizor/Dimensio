// Dragging crate.glb from the file manager into Godot's FileSystem dock. Godot imports it and
// keeps the import settings in crate.glb.import beside it.
import { dock, file } from './godot.mjs';
import { cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => kit.svg({ width: 500, height: 210 },
  `<rect x="14" y="30" width="170" height="120" rx="5" class="d-paper" stroke-width="1.2"/>`,
  kit.text(26, 50, 'Exports', { size: 11, cls: 'd-key-text' }),
  file(kit, 32, 80, 'crate.glb', { mark: true }),
  file(kit, 32, 104, 'barrel.glb'),
  file(kit, 32, 128, 'chest.glb'),
  dock(kit, { x: 270, y: 14, w: 216, h: 160, tabs: ['FileSystem'] }),
  kit.text(282, 58, 'res://', { size: 11, cls: 'd-key-text' }),
  file(kit, 296, 82, 'crate.glb'),
  kit.arcArrow(150, 80, 330, 112, { lift: -26 }),
  cursor(kit, 330, 112),
  kit.text(250, 200, 'Godot writes crate.glb.import beside the file', { size: 12, anchor: 'middle' }),
);

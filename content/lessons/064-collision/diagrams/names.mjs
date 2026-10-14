// The Outliner in Blender with Crate and CrateCollision-convcolonly, and the scene tree Godot makes
// from them: the crate's MeshInstance3D and a StaticBody3D named CrateCollision with a
// CollisionShape3D inside.
import { tree, dock } from './godot.mjs';

export default (kit) => kit.svg({ width: 520, height: 200 },
  `<rect x="10" y="30" width="222" height="90" rx="4" class="d-ui" stroke-width="1"/>`,
  kit.text(24, 50, 'Outliner', { size: 11, cls: 'd-key-text' }),
  `<rect x="26" y="62" width="10" height="10" rx="2" class="d-key" stroke-width="1"/>`, kit.text(42, 72, 'Crate', { size: 11, cls: 'd-key-text' }),
  `<rect x="18" y="80" width="208" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  `<rect x="26" y="86" width="10" height="10" rx="2" class="d-key" stroke-width="1"/>`, kit.text(42, 96, 'CrateCollision-convcolonly', { size: 11, cls: 'd-key-text' }),
  kit.line(236, 76, 256, 76, { cls: 'd-mark', width: 2 }), kit.arrowhead(256, 76, 0, { size: 8 }),
  dock(kit, { x: 262, y: 14, w: 246, h: 140, tabs: ['Scene'] }),
  tree(kit, 276, 60, [[0, 'crate', 'Node3D'], [1, 'Crate', 'MeshInstance3D'], [1, 'CrateCollision', 'StaticBody3D', 'mark'], [2, 'CollisionShape3D', 'convex']], { width: 222 }),
  kit.text(385, 182, 'the suffix is gone from the name', { size: 12, anchor: 'middle' }),
);

// A piece named wall_2m-col in Blender, and what Godot makes of it: a MeshInstance3D named wall_2m
// with a StaticBody3D and its CollisionShape3D inside, the layout a MeshLibrary reads.
import { dock, tree } from './godot.mjs';

export default (kit) => kit.svg({ width: 520, height: 180 },
  `<rect x="14" y="30" width="180" height="96" rx="4" class="d-ui" stroke-width="1"/>`,
  kit.text(24, 50, 'Outliner', { size: 11, cls: 'd-key-text' }),
  ['floor_2m-col', 'wall_2m-col', 'wall_door-col'].map((name, i) => [
    i === 1 ? `<rect x="20" y="${58 + i * 20}" width="168" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
    `<rect x="28" y="${64 + i * 20}" width="10" height="10" rx="2" class="d-key" stroke-width="1"/>`,
    kit.text(44, 74 + i * 20, name, { size: 11, cls: 'd-key-text' }),
  ]),
  kit.line(204, 78, 236, 78, { cls: 'd-mark', width: 2 }), kit.arrowhead(236, 78, 0, { size: 8 }),
  dock(kit, { x: 246, y: 14, w: 262, h: 130, tabs: ['Scene'] }),
  tree(kit, 260, 60, [[0, 'kit', 'Node3D'], [1, 'wall_2m', 'MeshInstance3D', 'mark'], [2, 'StaticBody3D', null], [3, 'CollisionShape3D', null]], { width: 238 }),
  kit.text(377, 168, 'the mesh stays and gets a body', { size: 12, anchor: 'middle' }),
);

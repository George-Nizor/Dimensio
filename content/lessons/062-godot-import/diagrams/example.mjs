// Godot after this lesson: the FileSystem dock with three imported .glb files and an inherited
// scene for each, and the Scene dock showing crate.tscn with the imported nodes (inherited, drawn
// grey) and an added light.
import { dock, tree, file } from './godot.mjs';

export default (kit) => kit.svg({ width: 520, height: 230 },
  dock(kit, { x: 14, y: 14, w: 200, h: 200, tabs: ['FileSystem'] }),
  kit.text(26, 58, 'res://', { size: 11, cls: 'd-key-text' }),
  ['barrel.glb', 'barrel.tscn', 'chest.glb', 'chest.tscn', 'crate.glb', 'crate.tscn'].map((name, i) => file(kit, 40, 82 + i * 22, name, { mark: name === 'crate.tscn' })),
  dock(kit, { x: 236, y: 14, w: 270, h: 200, tabs: ['Scene', 'Import'] }),
  tree(kit, 252, 62, [[0, 'crate', 'Node3D', 'dim'], [1, 'Crate', 'MeshInstance3D', 'dim'], [1, 'OmniLight3D', 'added', 'mark']]),
  kit.text(252, 150, 'grey: from the import', { size: 11 }),
  kit.text(252, 170, 'picked out: your own node', { size: 11 }),
);

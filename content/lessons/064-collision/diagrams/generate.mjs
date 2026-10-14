// Advanced Import Settings with the chest's mesh node selected: Generate > Physics ticked, Body
// Type Static and Shape Type Box.
import { dock, tree, option, heading } from './godot.mjs';

export default (kit) => kit.svg({ width: 520, height: 230 },
  dock(kit, { x: 10, y: 10, w: 500, h: 210, tabs: ['Scene', 'Meshes', 'Materials'] }),
  tree(kit, 24, 60, [[0, 'chest', null], [1, 'Chest', null, 'mark'], [1, 'Lid', null]], { width: 170 }),
  heading(kit, 210, 60, 'Generate'),
  option(kit, 210, 84, 290, 'Physics', true, { mark: true, indent: 8 }),
  heading(kit, 210, 114, 'Physics'),
  option(kit, 210, 138, 290, 'Body Type', 'Static', { indent: 8 }),
  option(kit, 210, 162, 290, 'Shape Type', 'Box', { mark: true, indent: 8 }),
);

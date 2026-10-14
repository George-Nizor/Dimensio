// The Advanced Import Settings window: the Scene tab's tree of nodes, meshes and materials on the
// left, a 3D preview in the middle, and the options for the selected node on the right.
import { view, drawMesh, cube } from '../../../diagrams/mesh.mjs';
import { dock, tree, option } from './godot.mjs';

export default (kit) => {
  const v = view({ azimuth: 35, elevation: 25, scale: 34, at: [262, 132] });
  return kit.svg({ width: 520, height: 250 },
    dock(kit, { x: 10, y: 10, w: 500, h: 228, tabs: ['Scene', 'Meshes', 'Materials'] }),
    tree(kit, 24, 60, [[0, 'crate', null], [1, 'Crate', null, 'mark'], [2, 'crate_Crate', null], [3, 'Wood', null]], { width: 156 }),
    `<rect x="190" y="44" width="150" height="180" rx="4" class="d-sunk" stroke-width="1"/>`,
    drawMesh(kit, cube(), v, { width: 1.4 }),
    kit.text(265, 214, 'preview', { size: 11, anchor: 'middle' }),
    option(kit, 346, 62, 160, 'Skip Import', false),
    option(kit, 346, 86, 160, 'Physics', false),
    option(kit, 346, 110, 160, 'NavMesh', 'Disabled'),
    option(kit, 346, 134, 160, 'Occluder', 'Disabled'),
    kit.text(352, 170, 'options for the', { size: 11 }),
    kit.text(352, 186, 'selected node', { size: 11 }),
  );
};

// Wrong: an empty with a cube display named Crate-colonly, as in older Collada tutorials. Godot
// imports it from glTF as a plain Node3D with no collision. Right: a mesh box with the suffix
// becomes a StaticBody3D with a CollisionShape3D.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { crate, crateCollision, panel } from './shapes.mjs';
import { tree } from './godot.mjs';

export default (kit) => {
  const left = view({ azimuth: 28, elevation: 22, scale: 95, at: [125, 92], target: [0, 0, 0.42] });
  const right = view({ azimuth: 28, elevation: 22, scale: 95, at: [375, 92], target: [0, 0, 0.42] });
  return kit.svg({ width: 500, height: 260 },
    panel(kit, 14, 14, 222, 216),
    drawMesh(kit, crate(), left, { width: 1.2 }),
    drawMesh(kit, crateCollision(), left, { mode: 'wire', cls: 'd-bad', width: 1.4 }).map((s) => s.replace('stroke-width="1.4"', 'stroke-width="1.4" stroke-dasharray="5 4"')),
    kit.text(125, 160, 'empty: Crate-colonly', { size: 11, anchor: 'middle' }),
    tree(kit, 34, 190, [[0, 'Crate', 'Node3D']], { width: 190 }),
    kit.tag(125, 252, 'no collision', { tone: 'bad' }),
    panel(kit, 264, 14, 222, 216),
    drawMesh(kit, crate(), right, { width: 1.2 }),
    drawMesh(kit, crateCollision(), right, { mode: 'wire', cls: 'd-mark', width: 1.6 }),
    kit.text(375, 160, 'mesh: CrateCollision-colonly', { size: 11, anchor: 'middle' }),
    tree(kit, 284, 190, [[0, 'CrateCollision', 'StaticBody3D'], [1, 'CollisionShape3D', null]], { width: 190, step: 18 }),
    kit.tag(375, 252, 'a static body'),
  );
};

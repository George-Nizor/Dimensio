// Placing the crates. crate.glb dragged from the FileSystem dock onto the Node3D that 3D Scene
// made; Ctrl+D twice then makes two copies, listed under the Node3D.
import { dock, row } from './godot.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  return kit.svg({ width: 460, height: 230 },
    dock(kit, 20, 16, 170, 120, 'Scene'),
    row(kit, 20, 40, 170, 'Node3D', { mark: true }),
    row(kit, 20, 62, 170, 'crate', { indent: 16 }),
    row(kit, 20, 84, 170, 'crate2', { indent: 16 }),
    row(kit, 20, 106, 170, 'crate3', { indent: 16 }),
    dock(kit, 20, 148, 170, 66, 'FileSystem'),
    row(kit, 20, 170, 170, 'res://'),
    row(kit, 20, 190, 170, 'crate.glb', { mark: true, indent: 10 }),
    kit.arcArrow(176, 196, 176, 50, { lift: -46 }),
    kit.text(250, 128, 'drag onto Node3D', { size: 12 }),
    keycap(kit, 286, 82, 'Ctrl+D', { size: 12 }),
    kit.text(320, 87, 'twice: two copies', { size: 12 }),
  );
};

// The glTF 2.0 export options that matter here: Selected Objects ticked under Include, Apply
// Modifiers under Data > Mesh, and Animation Mode left at Actions.
import { row, checkbox } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from './chestkit.mjs';

export default (kit) => kit.svg({ width: 420, height: 250 },
  frame(kit, 14, 14, 392, 222),
  kit.text(28, 38, 'File > Export > glTF 2.0 (.glb/.gltf)', { size: 13 }),
  kit.text(28, 66, 'Include', { size: 12 }),
  checkbox(kit, 120, 54, true, 'Selected Objects', { mark: true }),
  kit.text(28, 104, 'Data > Mesh', { size: 12 }),
  checkbox(kit, 120, 92, true, 'Apply Modifiers'),
  kit.text(28, 142, 'Animation', { size: 12 }),
  row(kit, 100, 156, 120, 150, 'Animation Mode', 'Actions', { mark: true }),
  kit.text(28, 214, 'each action becomes an animation of the same name', { size: 12 }),
);

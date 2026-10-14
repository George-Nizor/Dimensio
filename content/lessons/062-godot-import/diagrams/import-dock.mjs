// The Import dock for crate.glb: Import As Scene, the Nodes options Root Type, Root Name, Apply
// Root Scale and Root Scale, some of the Meshes options, and the Advanced and Reimport buttons.
import { dock, option, heading, button } from './godot.mjs';

export default (kit) => {
  const x = 14;
  const w = 300;
  return kit.svg({ width: 460, height: 330 },
    dock(kit, { x, y: 14, w, h: 300, tabs: ['Import', 'Scene'] }),
    option(kit, x, 58, w, 'crate.glb', ''),
    option(kit, x, 80, w, 'Import As', 'Scene'),
    heading(kit, x, 108, 'Nodes'),
    option(kit, x, 130, w, 'Root Type', 'Node3D', { mark: true, indent: 8 }),
    option(kit, x, 152, w, 'Root Name', 'crate', { indent: 8 }),
    option(kit, x, 174, w, 'Apply Root Scale', true, { indent: 8 }),
    option(kit, x, 196, w, 'Root Scale', '1', { mark: true, indent: 8 }),
    heading(kit, x, 224, 'Meshes'),
    option(kit, x, 246, w, 'Generate LODs', true, { indent: 8 }),
    button(kit, x + 12, 278, 120, 'Advanced...'),
    button(kit, x + 168, 278, 120, 'Reimport', { mark: true }),
    kit.text(330, 134, 'the top node', { size: 12 }),
    kit.text(330, 200, 'resizes the model', { size: 12 }),
    kit.text(330, 293, 'applies changes', { size: 12 }),
  );
};

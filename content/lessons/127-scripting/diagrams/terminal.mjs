// Running the script with no window: Blender in the background on kit.blend, running the text
// export.py saved in it, and the four lines it prints.
import { box, code } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 500, height: 170 },
  box(10, 10, 480, 150, { cls: 'd-sunk', rx: 5, stroke: 1.2 }),
  code(kit, 22, 38, [
    '> blender -b kit.blend --python-text export.py',
    'Saved ...\\export\\Floor.glb',
    'Saved ...\\export\\Wall.glb',
    'Saved ...\\export\\Doorway.glb',
    'Saved ...\\export\\Pillar.glb',
  ], { size: 12, lead: 24, mark: [0], width: 460 }),
);

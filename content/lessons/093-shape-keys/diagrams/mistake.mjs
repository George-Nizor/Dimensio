// Wrong: the sack squashed with S in Object Mode. Its Scale reads 1.3, 1.3, 0.58, and it looks the
// same at Value 0 and Value 1. Right: the squash made in Edit Mode on the key. Scale stays 1, 1, 1;
// Value 0 shows the Basis and Value 1 the squash.
import { view, drawMesh, scale } from '../../../diagrams/mesh.mjs';
import { sack, frame } from './sackkit.mjs';

export default (kit) => {
  const side = (x, a, b, scaleText, tag, tone) => [
    frame(kit, x, 14, 244, 200),
    drawMesh(kit, a, view({ at: [x + 66, 150], scale: 30, elevation: 18 }), { width: 1 }),
    drawMesh(kit, b, view({ at: [x + 178, 150], scale: 30, elevation: 18 }), { width: 1 }),
    kit.text(x + 66, 186, 'Value 0', { anchor: 'middle', size: 12 }),
    kit.text(x + 178, 186, 'Value 1', { anchor: 'middle', size: 12 }),
    kit.text(x + 122, 40, scaleText, { anchor: 'middle', size: 12, cls: 'd-key-text' }),
    kit.tag(x + 122, 240, tag, { tone }),
  ];
  const objectScaled = scale(sack(0), [1.3, 1.3, 0.58]);
  return kit.svg({ width: 520, height: 256 },
    side(12, objectScaled, objectScaled, 'Scale 1.3, 1.3, 0.58', 'scaled in Object Mode', 'bad'),
    side(264, sack(0), sack(1), 'Scale 1, 1, 1', 'shaped in Edit Mode'),
  );
};

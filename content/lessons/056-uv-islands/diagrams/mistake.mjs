// The chest with a test grid. Wrong: Pack Islands run before Average Islands Scale, so the lid's
// squares come out far bigger than the body's. Right: averaged first, so the squares are one size
// all over.
import { view } from '../../../diagrams/mesh.mjs';
import { drawTextured } from './uv.mjs';
import { packed, packedUneven } from './chestuv.mjs';

export default (kit) => {
  const bad = packedUneven();
  const good = packed();
  const left = view({ at: [125, 140], scale: 140, target: [0, 0, 0.5] });
  const right = view({ at: [375, 140], scale: 140, target: [0, 0, 0.5] });
  return kit.svg({ width: 500, height: 270 },
    drawTextured(kit, bad.mesh, left, bad.uvs, { cells: 16 }),
    kit.tag(125, 258, 'packed, not averaged', { tone: 'bad' }),
    drawTextured(kit, good.mesh, right, good.uvs, { cells: 16 }),
    kit.tag(375, 258, 'averaged, then packed'),
  );
};

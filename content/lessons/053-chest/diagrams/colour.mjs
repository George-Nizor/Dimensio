// The closed chest with its two slots: the wood material on the body and lid, the metal one on the
// bands and the lock. The slot list beside it holds Wood and Metal, with Metal active.
import { view } from '../../../diagrams/mesh.mjs';
import { body, lid, band, lock, drawParts } from './chest.mjs';
import { drawPainted } from './painted.mjs';
import { slotList } from './slots.mjs';

export default (kit) => {
  const v = view({ at: [150, 150], scale: 130, azimuth: 30, elevation: 24, target: [0, 0, 0.5] });
  const list = slotList(kit, 300, 70, [['Wood', 'd-face-sel'], ['Metal', 'd-face-2']], { active: 1, editMode: true, mark: 'Assign' });
  return kit.svg({ width: 510, height: 260 },
    drawParts(kit, v, [body(), lid(), band(-0.4), band(0.4), lock()], drawPainted),
    list.svg,
  );
};

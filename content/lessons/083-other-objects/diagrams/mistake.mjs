// Metaballs only merge with others in the same family, the part of the name before the first dot.
// Wrong: "Slime" and "Blob" overlap but stay two shapes. Right: "Slime" and "Slime.001" merge.
import { drawBlob, panel } from './shapes.mjs';

export default (kit) => {
  const a = [{ x: 98, y: 92, r: 34 }];
  const b = [{ x: 156, y: 92, r: 34 }];
  const both = [{ x: 352, y: 92, r: 34 }, { x: 410, y: 92, r: 34 }];
  return kit.svg({ width: 500, height: 226 },
    panel(kit, 14, 14, 226, 160),
    drawBlob(kit, a, [20, 20, 236, 170]),
    drawBlob(kit, b, [20, 20, 236, 170]),
    kit.text(92, 160, 'Slime', { anchor: 'middle', size: 12 }), kit.text(160, 160, 'Blob', { anchor: 'middle', size: 12 }),
    kit.tag(127, 204, 'two families', { tone: 'bad' }),
    panel(kit, 260, 14, 226, 160),
    drawBlob(kit, both, [266, 20, 482, 170]),
    kit.text(346, 160, 'Slime', { anchor: 'middle', size: 12 }), kit.text(416, 160, 'Slime.001', { anchor: 'middle', size: 12 }),
    kit.tag(373, 204, 'one family'),
  );
};

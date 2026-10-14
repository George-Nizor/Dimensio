// Two metaballs. Apart, each is a round ball. Moved close, they flow into one shape like two drops
// of water.
import { drawBlob, ballRing, panel } from './shapes.mjs';

export default (kit) => {
  const apart = [{ x: 72, y: 96, r: 30 }, { x: 178, y: 96, r: 30 }];
  const close = [{ x: 352, y: 96, r: 30 }, { x: 418, y: 96, r: 30 }];
  return kit.svg({ width: 520, height: 200 },
    panel(kit, 14, 14, 236, 160, 'apart'),
    drawBlob(kit, apart, [20, 20, 244, 170]),
    apart.map((b) => ballRing(kit, b)),
    panel(kit, 270, 14, 236, 160, 'close: they merge'),
    drawBlob(kit, close, [276, 20, 500, 170]),
    close.map((b) => ballRing(kit, b)),
  );
};

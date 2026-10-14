// A crate painted in Texture Paint mode: darker dirt along the bottom of each side, and lighter wear
// along its edges and corners.
import { crate, dirt, wear } from './crate.mjs';

export default (kit) => kit.svg({ width: 320, height: 250 },
  crate(kit, { at: [160, 125], scale: 100, paint: (face) => [dirt(face), wear(face)] }),
);

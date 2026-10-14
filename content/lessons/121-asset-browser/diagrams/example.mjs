// The Asset Browser showing the My Props library: the Props catalog picked out on the left, the
// crate, barrel and lamp as preview tiles, and Append chosen as the import method.
import { browser } from './assets.mjs';

export default (kit) => kit.svg({ width: 490, height: 170 }, browser(kit, 10, 10, { h: 150 }).svg);

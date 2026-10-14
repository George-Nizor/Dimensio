// The first settings on the splash screen, set the way the course expects.
import { splash } from './splash-kit.mjs';

export default (kit) => kit.svg({ width: 360, height: 230 }, splash(kit, 30, 12, { width: 300, height: 206 }));

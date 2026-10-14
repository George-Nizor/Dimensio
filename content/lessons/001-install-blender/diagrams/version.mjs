// Where the version number is: the top right corner of the splash picture.
import { splash } from './splash-kit.mjs';

export default (kit) => kit.svg({ width: 360, height: 210 },
  splash(kit, 30, 12, { width: 300, height: 186, setup: false, markVersion: true }),
  kit.text(320, 52, 'starts with 5.2', { anchor: 'end', size: 12 }),
);

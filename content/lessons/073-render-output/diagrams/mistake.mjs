// Wrong: rendering straight to one video file, which is lost when Blender stops at frame 30.
// Right: rendering PNG frames, where the 30 finished frames stay on disk.
import { fileList } from './stage.mjs';

export default (kit) => kit.svg({ width: 480, height: 210 },
  fileList(kit, 20, 14, 200, 'turntable', ['turntable.mp4']),
  `<rect x="30" y="88" width="180" height="14" rx="3" class="d-ui" stroke-width="1"/>`,
  `<rect x="30" y="88" width="${180 * (30 / 48)}" height="14" rx="3" class="d-key-bad" stroke-width="0"/>`,
  kit.text(120, 124, 'stopped at frame 30', { anchor: 'middle', size: 11 }),
  kit.tag(120, 196, 'one video: nothing kept', { tone: 'bad' }),
  fileList(kit, 260, 14, 200, 'turntable', ['0001.png', '0002.png', '...', '0030.png']),
  kit.tag(360, 196, 'frames: 30 kept'),
);

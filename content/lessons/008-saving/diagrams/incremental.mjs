// Save Incremental: each Ctrl+Alt+S saves under the next number, potion_01, potion_02 and
// potion_03, and you carry on in the newest.
import { keycap } from '../../../diagrams/mesh.mjs';
import { file } from './files.mjs';

export default (kit) => kit.svg({ width: 500, height: 170 },
  [0, 1, 2].map((i) => {
    const x = 30 + i * 170;
    return [
      file(kit, x, 30, `potion_0${i + 1}.blend`, { mark: i === 2, w: 50 }),
      i < 2 ? [keycap(kit, x + 112, 62, 'Ctrl+Alt+S', { size: 9 }), kit.line(x + 66, 86, x + 158, 86, { cls: 'd-mark', width: 2 }), kit.arrowhead(x + 158, 86, 0, { size: 7 })] : '',
    ];
  }),
  kit.text(395, 150, 'you carry on here', { anchor: 'middle', size: 12 }),
);

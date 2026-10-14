// The Properties editor's Object Data tab for the meta-rig: the Rigify panel with Generate Rig
// picked out, and the Outliner after clicking it, with a new armature called rig.
import { button, push } from './helpers.mjs';

export default (kit) => {
  const tabs = [0, 1, 2, 3, 4, 5, 6];
  return kit.svg({ width: 480, height: 230 },
    `<rect x="10" y="10" width="260" height="210" rx="6" class="d-ui" stroke-width="1"/>`,
    tabs.map((i) => `<rect x="18" y="${20 + i * 26}" width="20" height="20" rx="4" class="${i === 5 ? 'd-ui-mark' : 'd-sunk'}" stroke-width="1"/>`),
    kit.text(50, 34, 'metarig', { size: 12 }),
    `<rect x="48" y="48" width="212" height="24" rx="4" class="d-sunk" stroke-width="1"/>`,
    kit.text(58, 64, 'Rigify', { size: 12 }),
    button(kit, 62, 82, 184, 'Generate Rig', { on: true, size: 12, h: 26 }),
    kit.text(62, 134, '>  Advanced', { size: 11 }),
    kit.text(62, 158, '>  Samples', { size: 11 }),
    kit.text(62, 182, '>  Bone Collection UI', { size: 11 }),
    kit.text(28, 214, 'Object Data tab', { size: 11 }),
    push(kit, 280, 95, 320, 95, { width: 2 }),
    `<rect x="330" y="40" width="140" height="120" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(340, 60, 'Outliner', { size: 11 }),
    ['Body', 'metarig', 'rig', 'WGTS_rig'].map((name, i) => [
      `<rect x="338" y="${70 + i * 22}" width="124" height="20" rx="3" class="${name === 'rig' ? 'd-ui-mark' : 'd-ui'}" stroke-width="${name === 'rig' ? 1 : 0}"/>`,
      kit.text(346, 84 + i * 22, name, { size: 11 }),
    ]),
  );
};

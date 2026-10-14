// Cut through the middle. Left, the cap and stem selected as two objects. Right, after Ctrl+J they
// are one object, but the stem's top still sits inside the cap as a second shell.
import { keycap } from '../../../diagrams/mesh.mjs';
import { capOutline, stemOutline } from './section.mjs';

export default (kit) => {
  const half = (x, joined) => {
    const cap = capOutline(x, 90, 80, 52);
    const stem = stemOutline(x, 190, 70, 18);
    return [
      kit.polyline([...cap, cap[0]], { cls: joined ? 'd-ink' : 'd-mark', width: 2.2 }),
      kit.polyline(stem, { cls: joined ? 'd-ink' : 'd-mark', width: 2.2 }),
      joined ? kit.polyline([[x - 18, 90], [x - 18, 70], [x + 18, 70], [x + 18, 90]], { cls: 'd-bad', width: 2, dash: '4 3' }) : '',
    ];
  };
  return kit.svg({ width: 480, height: 230 },
    half(110, false),
    kit.text(110, 220, 'two objects', { anchor: 'middle', size: 12 }),
    keycap(kit, 240, 110, 'Ctrl+J'),
    half(370, true),
    kit.text(370, 220, 'one object, stem still inside', { anchor: 'middle', size: 12 }),
  );
};

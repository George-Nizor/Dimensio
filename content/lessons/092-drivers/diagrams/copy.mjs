// The Outliner with three wheels selected and Wheel front left active, and the menu a right click
// on the driven Y rotation field opens, with Copy Driver to Selected picked out.
import { frame, menu } from './animkit.mjs';

export default (kit) => {
  const names = [['Cart', 0], ['Wheel back left', 1], ['Wheel back right', 1], ['Wheel front left', 2], ['Wheel front right', 1]];
  return kit.svg({ width: 520, height: 230 },
    frame(kit, 14, 14, 200, 150, 'the Outliner'),
    names.map(([name, state], i) => {
      const y = 26 + i * 26;
      return [
        state ? `<rect x="22" y="${y}" width="184" height="22" rx="3" class="${state === 2 ? 'd-ui-mark' : 'd-paper'}" stroke-width="1"/>` : '',
        kit.text(i ? 46 : 32, y + 15, name, { size: 12 }),
      ];
    }),
    kit.text(110, 196, 'driven wheel clicked last', { anchor: 'middle', size: 12 }),
    menu(kit, 250, 14, ['Delete Driver', 'Copy Driver', 'Paste Driver', 'Copy Driver to Selected', 'Edit Driver...', 'Open Drivers Editor'], { w: 230, mark: 'Copy Driver to Selected', title: 'right click on Y rotation' }),
  );
};

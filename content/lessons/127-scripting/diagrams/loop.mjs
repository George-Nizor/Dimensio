// The loop at the heart of the script, lines 7 to 16, with what each part does: pick one object,
// move it to the origin, export only the selection, put it back.
import { code } from '../../115-grease-pencil/diagrams/ui-kit.mjs';
import { SCRIPT } from './script.mjs';

export default (kit) => {
  const lines = SCRIPT.slice(6);
  const notes = [[0, 'each object in Kit'], [1, 'select only this one'], [4, 'move it to the origin'], [6, 'one .glb per object'], [8, 'put it back']];
  return kit.svg({ width: 600, height: 210 },
    code(kit, 14, 30, lines, { size: 11, lead: 18, mark: [0, 6, 7], width: 396 }),
    notes.map(([i, text]) => [
      kit.line(418, 26 + i * 18, 432, 26 + i * 18, { cls: 'd-guide', width: 1 }),
      kit.text(438, 30 + i * 18, text, { size: 11, cls: 'd-tag' }),
    ]),
  );
};

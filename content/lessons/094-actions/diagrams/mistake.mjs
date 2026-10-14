// Wrong: the X beside open clicked to start a fresh action. open is left with no users, Blender
// warns it will not be saved, and it is gone after reopening. Right: New Action clicked instead,
// which stashes open on a muted track and keeps it.
import { frame, actionHeader, strip } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const side = (x, mark, lines, tag, tone, stashed) => [
    frame(kit, x, 14, 246, 196),
    actionHeader(kit, x + 10, 26, { name: 'open', mark }).svg.slice(0, 5),
    lines.map((t, i) => kit.text(x + 14, 78 + i * 20, t, { size: 12 })),
    stashed ? [`<rect x="${x + 10}" y="150" width="226" height="30" rx="3" class="d-sunk" stroke-width="1"/>`, kit.text(x + 18, 169, '[Action Stash]', { size: 11 }), strip(kit, x + 128, x + 228, 154, 'open', { tone: 'muted' })] : '',
    kit.tag(x + 123, 236, tag, { tone }),
  ];
  return kit.svg({ width: 520, height: 250 },
    side(12, 'unlink', ['open has no users now:', '"will not be saved"', 'gone when you reopen'], 'unlinked with X', 'bad', false),
    side(264, 'new', ['open is stashed:', 'kept, and a copy', 'to work on'], 'New Action', 'mark', true),
  );
};

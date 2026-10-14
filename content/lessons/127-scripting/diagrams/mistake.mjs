// Wrong: the script run in a file that was never saved, so // has no folder and the files go to
// whatever folder Blender started in. Right: the file saved first, so the export folder sits
// beside kit.blend.
const tree = (kit, x, y, lines, { bad = false } = {}) => lines.map(([depth, text], i) => [
  depth ? kit.line(x + depth * 16 - 10, y + i * 22 - 4, x + depth * 16 - 4, y + i * 22 - 4, { cls: 'd-guide', width: 1 }) : '',
  kit.text(x + depth * 16, y + i * 22, text, { size: 12, cls: bad && i === 0 ? 'd-tag d-tag-bad' : 'd-key-text' }),
]);

export default (kit) => kit.svg({ width: 500, height: 200 },
  tree(kit, 20, 40, [[0, 'untitled, not saved'], [0, '...\\Blender'], [1, 'export'], [2, 'Floor.glb ...']], { bad: true }),
  kit.tag(120, 176, 'files land in Blender\'s folder', { tone: 'bad' }),
  tree(kit, 280, 40, [[0, 'Projects'], [1, 'kit.blend'], [1, 'export'], [2, 'Floor.glb ...']]),
  kit.tag(370, 176, 'saved first: beside kit.blend'),
);

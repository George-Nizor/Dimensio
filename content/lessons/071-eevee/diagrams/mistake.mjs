// Wrong: the render window closed without saving, so the folder holds only the .blend file. Right:
// the render saved with Image > Save As, so stage.png sits beside it.
const folder = (kit, x, files, mark) => [
  `<rect x="${x}" y="20" width="200" height="130" rx="6" class="d-paper" stroke-width="1.2"/>`,
  `<rect x="${x}" y="20" width="200" height="26" rx="6" class="d-sunk" stroke-width="1"/>`,
  kit.text(x + 12, 38, 'Renders folder', { size: 11 }),
  files.map((name, i) => [
    name === mark ? `<rect x="${x + 8}" y="${54 + i * 26}" width="184" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
    `<rect x="${x + 16}" y="${59 + i * 26}" width="11" height="13" rx="1.5" class="d-key" stroke-width="1"/>`,
    kit.text(x + 36, 70 + i * 26, name, { size: 11 }),
  ]),
];

export default (kit) => kit.svg({ width: 480, height: 200 },
  folder(kit, 20, ['stage.blend']),
  kit.tag(120, 182, 'closed without saving', { tone: 'bad' }),
  folder(kit, 260, ['stage.blend', 'stage.png'], 'stage.png'),
  kit.tag(360, 182, 'saved with Save As'),
);

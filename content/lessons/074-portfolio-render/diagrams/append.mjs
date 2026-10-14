// File > Append: inside crate.blend, the Object folder, with Crate picked and the Append button.
export default (kit) => {
  const items = ['Camera', 'Crate', 'Light'];
  return kit.svg({ width: 440, height: 210 },
    `<rect x="20" y="14" width="400" height="182" rx="6" class="d-ui" stroke-width="1.2"/>`,
    `<rect x="32" y="26" width="376" height="24" rx="4" class="d-key" stroke-width="1.2"/>`,
    kit.text(42, 42, 'Models\\crate.blend\\Object\\', { size: 11, cls: 'd-key-text' }),
    `<rect x="32" y="60" width="376" height="${items.length * 26 + 10}" rx="4" class="d-paper" stroke-width="1"/>`,
    items.map((name, i) => [
      name === 'Crate' ? `<rect x="36" y="${64 + i * 26}" width="368" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
      `<rect x="46" y="${70 + i * 26}" width="12" height="12" rx="6" class="d-key" stroke-width="1"/>`,
      kit.text(68, 81 + i * 26, name, { size: 11 }),
    ]),
    `<rect x="300" y="160" width="100" height="26" rx="4" class="d-key-mark" stroke-width="1.2"/>`,
    kit.text(350, 177, 'Append', { anchor: 'middle', size: 12, cls: 'd-key-text d-key-text-mark' }),
    kit.text(42, 177, 'File > Append', { size: 12, cls: 'd-label' }),
  );
};

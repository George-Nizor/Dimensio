// The glTF 2.0 export settings this lesson uses: Format set to glTF Binary (.glb); Include > Limit
// to: Selected Objects; Transform: +Y Up; Data > Mesh: Apply Modifiers.
export default (kit) => {
  const tick = (x, y, on) => [
    `<rect x="${x}" y="${y}" width="14" height="14" rx="3" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
    on ? kit.polyline([[x + 3, y + 7], [x + 6.5, y + 10.5], [x + 11, y + 3.5]], { cls: 'd-key', width: 1.8 }) : '',
  ];
  const sections = [
    ['Include', 'Limit to', 'Selected Objects'],
    ['Transform', '', '+Y Up'],
    ['Data > Mesh', '', 'Apply Modifiers'],
  ];
  return kit.svg({ width: 440, height: 236 },
    `<rect x="20" y="14" width="400" height="210" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(36, 38, 'Format', { size: 12 }),
    `<rect x="150" y="24" width="200" height="22" rx="4" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(160, 39, 'glTF Binary (.glb)', { size: 12 }),
    sections.map(([head, sub, label], i) => {
      const y = 66 + i * 50;
      return [
        kit.line(36, y, 404, y, { cls: 'd-guide', width: 0.8 }),
        kit.text(36, y + 18, head, { size: 12 }),
        sub ? kit.text(60, y + 38, sub, { size: 11 }) : '',
        tick(150, y + 25, true),
        kit.text(172, y + 37, label, { size: 12 }),
      ];
    }),
  );
};

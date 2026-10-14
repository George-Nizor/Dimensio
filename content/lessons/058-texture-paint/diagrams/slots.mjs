// Texture Slots in the 3D Viewport's header in Texture Paint mode: Mode Material, No Textures yet,
// and the + menu open with Base Color picked out.
export default (kit) => {
  const out = [
    `<rect x="14" y="14" width="190" height="24" rx="4" class="d-ui-mark" stroke-width="1.2"/>`,
    kit.text(26, 30, 'Texture Slots', { size: 12 }),
    kit.path('M 186 24 L 190 28 L 194 24', { cls: 'd-ink', width: 1.3 }),
    `<rect x="14" y="44" width="250" height="110" rx="6" class="d-paper" stroke-width="1.4"/>`,
    kit.text(70, 66, 'Mode', { size: 11, anchor: 'end' }),
    `<rect x="78" y="54" width="170" height="18" rx="3" class="d-sunk" stroke-width="1"/>`,
    kit.text(86, 67, 'Material', { size: 11, cls: 'd-key-text' }),
    `<rect x="26" y="86" width="190" height="52" rx="3" class="d-sunk" stroke-width="1"/>`,
    kit.text(121, 116, 'No Textures', { size: 11, anchor: 'middle', cls: 'd-label' }),
    `<rect x="222" y="86" width="26" height="22" rx="4" class="d-key-mark" stroke-width="1.2"/>`,
    kit.text(235, 102, '+', { size: 15, anchor: 'middle', cls: 'd-key-text d-key-text-mark' }),
  ];
  const items = ['Base Color', 'Specular IOR Level', 'Roughness', 'Metallic', 'Normal', 'Bump', 'Displacement'];
  out.push(`<rect x="270" y="86" width="160" height="${items.length * 19 + 10}" rx="5" class="d-paper" stroke-width="1.4"/>`);
  items.forEach((label, i) => {
    const y = 91 + i * 19;
    if (i === 0) out.push(`<rect x="274" y="${y}" width="152" height="18" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(284, y + 13, label, { size: 11 }));
  });
  return kit.svg({ width: 450, height: 240 }, out);
};

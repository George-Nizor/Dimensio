// The material: a Color Attribute node's Color output linked to the Base Color input of the
// Principled BSDF.
export default (kit) => {
  const node = (x, y, w, h, title) => [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-paper" stroke-width="1.4"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="24" rx="6" class="d-sunk" stroke-width="1"/>`,
    kit.text(x + 10, y + 16, title, { size: 12 }),
  ];
  const socket = (x, y, mark) => kit.dot(x, y, { r: 5, cls: mark ? 'd-mark-fill' : 'd-dot' });
  return kit.svg({ width: 460, height: 210 },
    node(20, 40, 150, 96, 'Color Attribute'),
    kit.text(160, 84, 'Color', { size: 11, anchor: 'end' }), socket(170, 80, true),
    kit.text(160, 110, 'Alpha', { size: 11, anchor: 'end' }), socket(170, 106),
    node(270, 20, 170, 170, 'Principled BSDF'),
    kit.text(430, 58, 'BSDF', { size: 11, anchor: 'end' }), socket(440, 54),
    socket(270, 84, true), kit.text(282, 88, 'Base Color', { size: 11 }),
    socket(270, 110), kit.text(282, 114, 'Metallic', { size: 11 }),
    socket(270, 136), kit.text(282, 140, 'Roughness', { size: 11 }),
    socket(270, 162), kit.text(282, 166, 'IOR', { size: 11 }),
    kit.path('M 175 80 C 220 80 225 84 265 84', { cls: 'd-mark', width: 2.4 }),
  );
};

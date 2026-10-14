// The Statistics overlay in the top left of the 3D Viewport with the chair selected: its
// Triangles line reads 1,152, far over a budget of 300 because of a Subdivision Surface modifier.
export default (kit) => {
  const rows = [['Objects', '1 / 3'], ['Vertices', '588'], ['Edges', '1,164'], ['Faces', '576'], ['Triangles', '1,152']];
  const out = [
    `<rect x="20" y="20" width="420" height="190" rx="4" class="d-ui" stroke-width="1"/>`,
    kit.text(34, 42, 'User Perspective', { size: 11 }),
    kit.text(34, 58, '(1) Collection | Cube.002', { size: 11 }),
  ];
  rows.forEach(([name, value], i) => {
    const y = 84 + i * 22;
    if (name === 'Triangles') out.push(`<rect x="28" y="${y - 15}" width="170" height="21" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(34, y, name, { size: 12, cls: 'd-key-text' }), kit.text(190, y, value, { size: 12, anchor: 'end', cls: 'd-key-text' }));
  });
  out.push(kit.text(250, 172, 'budget: 300', { size: 13, cls: 'd-tag d-tag-bad' }));
  out.push(kit.text(250, 192, 'Subdivision Surface left on', { size: 12 }));
  return kit.svg({ width: 460, height: 230 }, out);
};

// The Decimate modifier on Rock_LOD1: Collapse chosen, Ratio 0.5. Statistics then reads 992
// triangles for it.
export default (kit) => {
  const tabs = ['Collapse', 'Un-Subdivide', 'Planar'];
  const out = [
    `<rect x="14" y="14" width="300" height="150" rx="5" class="d-ui" stroke-width="1"/>`,
    kit.text(28, 38, 'Decimate', { size: 12, cls: 'd-key-text' }),
  ];
  tabs.forEach((name, i) => {
    const x = 28 + i * 94;
    out.push(`<rect x="${x}" y="52" width="90" height="22" rx="4" class="${i === 0 ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`);
    out.push(kit.text(x + 45, 67, name, { size: 11, anchor: 'middle', cls: i === 0 ? 'd-key-text d-key-text-mark' : 'd-key-text' }));
  });
  out.push(`<rect x="28" y="88" width="272" height="22" rx="4" class="d-ui-mark" stroke-width="1.2"/>`);
  out.push(kit.text(38, 103, 'Ratio', { size: 11 }), kit.text(290, 103, '0.500', { size: 11, anchor: 'end', cls: 'd-key-text' }));
  out.push(kit.text(38, 140, 'Face Count: 690', { size: 11 }));
  out.push(`<rect x="334" y="60" width="116" height="50" rx="4" class="d-paper" stroke-width="1.2"/>`);
  out.push(kit.text(344, 80, 'Statistics', { size: 11 }), kit.text(344, 100, 'Triangles 992', { size: 12, cls: 'd-key-text' }));
  return kit.svg({ width: 470, height: 180 }, out);
};

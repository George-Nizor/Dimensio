// An area's header with the Editor Type button at its left end picked out and its list open.
export default (kit) => {
  const names = ['3D Viewport', 'Image Editor', 'UV Editor', 'Compositor', 'Shader Editor', 'Video Sequencer'];
  const out = [
    `<rect x="20" y="20" width="420" height="190" rx="4" class="d-ui" stroke-width="1"/>`,
    `<rect x="20" y="20" width="420" height="26" rx="4" class="d-sunk" stroke-width="1"/>`,
    `<rect x="26" y="24" width="34" height="18" rx="3" class="d-key-mark" stroke-width="1.2"/>`,
    kit.path('M 48 31 L 52 35 L 56 31', { cls: 'd-ink', width: 1.6 }),
    `<rect x="31" y="27" width="10" height="12" rx="2" class="d-key" stroke-width="1"/>`,
    kit.text(70, 37, 'View   Select   Add   Object', { size: 11 }),
    `<rect x="26" y="50" width="150" height="${names.length * 22 + 10}" rx="4" class="d-paper" stroke-width="1.2"/>`,
  ];
  names.forEach((name, i) => {
    const y = 58 + i * 22;
    if (name === 'Shader Editor') out.push(`<rect x="30" y="${y - 2}" width="142" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(40, y + 12, name, { size: 11 }));
  });
  out.push(kit.text(250, 120, 'Editor Type button', { size: 12, cls: 'd-tag' }));
  out.push(...kit.arcArrow(246, 110, 64, 36, { lift: 30 }));
  return kit.svg({ width: 460, height: 230 }, out);
};

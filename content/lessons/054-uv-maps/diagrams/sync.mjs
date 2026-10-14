// The left end of the UV Editor's header: the Editor Type button, then the Sync Selection button,
// on by default in 5.2 and picked out, then the vertex, edge and face select modes.
export default (kit) => {
  const out = [`<rect x="14" y="20" width="440" height="30" rx="4" class="d-ui" stroke-width="1"/>`];
  const button = (x, w, on, draw) => {
    out.push(`<rect x="${x}" y="25" width="${w}" height="20" rx="4" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`);
    out.push(draw(x + w / 2, 35, on));
  };
  button(20, 34, false, (cx, cy) => `<rect x="${cx - 8}" y="${cy - 6}" width="16" height="12" rx="2" class="d-paper" stroke-width="0"/>`);
  // Sync Selection: two arrows chasing each other.
  button(62, 26, true, (cx, cy) => [kit.arcArrow(cx - 6, cy + 3, cx + 6, cy - 3, { lift: -6, cls: 'd-ink', width: 1.4 }), kit.arcArrow(cx + 6, cy + 4, cx - 6, cy + 4, { lift: -5, cls: 'd-ink', width: 1.4 })].flat().join(''));
  ['vertex', 'edge', 'face'].forEach((mode, i) => button(96 + i * 28, 26, i === 2, (cx, cy) => (mode === 'vertex' ? kit.dot(cx, cy, { r: 3 }) : mode === 'edge' ? kit.line(cx - 6, cy + 5, cx + 6, cy - 5, { cls: 'd-ink', width: 2 }) : `<rect x="${cx - 6}" y="${cy - 6}" width="12" height="12" class="d-paper" stroke-width="0"/>`)));
  out.push(kit.text(196, 40, 'View   Select   Image   UV', { size: 12 }));
  out.push(kit.line(75, 52, 75, 82, { cls: 'd-guide', width: 1.2 }), kit.text(75, 98, 'Sync Selection, on', { anchor: 'middle', size: 12, cls: 'd-tag' }));
  return kit.svg({ width: 470, height: 112 }, out);
};

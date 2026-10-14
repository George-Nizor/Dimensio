// The UV Editor with a small palette image: the table top's faces scaled down onto a light wood
// swatch and the legs' faces onto a darker one.
export default (kit) => {
  const fills = ['d-face-1', 'd-face-2', 'd-face-3', 'd-key-mark', 'd-gizmo-y', 'd-gizmo-z', 'd-gizmo-x', 'd-face-sel', 'd-sunk', 'd-ui', 'd-face-2', 'd-face-1', 'd-key-bad', 'd-face-3', 'd-ui-mark', 'd-face-1'];
  const out = [`<rect x="20" y="20" width="200" height="200" class="d-paper" stroke-width="1.2"/>`];
  fills.forEach((cls, i) => {
    const x = 20 + (i % 4) * 50;
    const y = 20 + Math.floor(i / 4) * 50;
    out.push(`<rect x="${x}" y="${y}" width="50" height="50" class="${cls}" stroke-width="0"/>`);
  });
  // Light wood is swatch 7, darker wood swatch 3; the islands sit inside them.
  const island = (cx, cy) => kit.polyline([[cx - 12, cy - 8], [cx + 12, cy - 8], [cx + 12, cy + 8], [cx - 12, cy + 8], [cx - 12, cy - 8]], { cls: 'd-ink', width: 1.6 });
  out.push(island(195, 95), island(195, 45));
  out.push(kit.line(222, 95, 270, 95, { cls: 'd-guide', width: 1.2 }), kit.text(278, 99, 'table top: light wood', { size: 12 }));
  out.push(kit.line(222, 45, 270, 45, { cls: 'd-guide', width: 1.2 }), kit.text(278, 49, 'legs: darker wood', { size: 12 }));
  out.push(kit.text(120, 240, 'one palette image for both pieces', { size: 12, anchor: 'middle' }));
  return kit.svg({ width: 460, height: 252 }, out);
};

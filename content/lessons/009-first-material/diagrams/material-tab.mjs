// The Properties editor with the Material tab picked out at the bottom of its column of tabs, and
// the New button beside the browse icon.
export default (kit) => {
  const tabs = 12;
  const out = [`<rect x="20" y="16" width="340" height="250" rx="4" class="d-ui" stroke-width="1"/>`];
  for (let i = 0; i < tabs; i += 1) {
    const y = 24 + i * 20;
    const on = i === tabs - 1;
    out.push(`<rect x="26" y="${y}" width="18" height="17" rx="3" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1"/>`);
  }
  out.push(kit.circle(35, 24 + (tabs - 1) * 20 + 8.5, 5, { cls: 'd-ink', width: 1.4 }));
  out.push(kit.text(64, 44, 'Material', { size: 12 }));
  out.push(`<rect x="64" y="56" width="280" height="54" rx="3" class="d-sunk" stroke-width="1"/>`);
  out.push(`<rect x="64" y="122" width="30" height="24" rx="4" class="d-key" stroke-width="1.2"/>`);
  out.push(kit.circle(79, 134, 6, { cls: 'd-ink', width: 1.4 }));
  out.push(`<rect x="98" y="122" width="120" height="24" rx="4" class="d-key-mark" stroke-width="1"/>`);
  out.push(kit.text(158, 139, '+ New', { anchor: 'middle', size: 12, cls: 'd-key-text d-key-text-mark' }));
  out.push(kit.text(79, 166, 'browse', { anchor: 'middle', size: 11 }));
  out.push(kit.line(52, 24 + (tabs - 1) * 20 + 8, 120, 236, { cls: 'd-guide', width: 1.2 }));
  out.push(kit.text(126, 240, 'the Material tab', { size: 12 }));
  return kit.svg({ width: 380, height: 280 }, out);
};

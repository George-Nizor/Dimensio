// The Material tab of the Properties editor with a new material. The tab, a sphere, is second from
// the bottom of the column of tabs. The Surface panel lists the Principled BSDF's main inputs, then
// its closed panels, and the Settings panel near the bottom holds Render Method. What this lesson
// uses is picked out.
import { field, panelHeader } from './spheres.mjs';

export default (kit) => {
  const x = 62;
  const w = 250;
  const out = [`<rect x="14" y="14" width="${w + 62}" height="430" rx="5" class="d-ui" stroke-width="1"/>`];
  const tab = 13;
  for (let i = 0; i < 15; i += 1) {
    const ty = 22 + i * 23;
    out.push(`<rect x="22" y="${ty}" width="22" height="19" rx="4" class="${i === tab ? 'd-key-mark' : 'd-key'}" stroke-width="1"/>`);
  }
  const ty = 22 + tab * 23 + 9.5;
  out.push(`<circle cx="33" cy="${ty}" r="5.5" class="d-paper" stroke-width="0"/>`);
  out.push(kit.line(48, ty, 58, ty, { cls: 'd-mark', width: 2 }));
  let y = 24;
  out.push(panelHeader(kit, x, y, w, 'Surface', { open: true }));
  y += 28;
  out.push(field(kit, x, y, w, 'Surface', { value: 'Principled BSDF' }));
  y += 26;
  const rows = [['Base Color', { swatch: 'd-face-2', mark: true }], ['Metallic', { value: '0.000', mark: true }], ['Roughness', { value: '0.500', mark: true }], ['IOR', { value: '1.500' }], ['Alpha', { value: '1.000', mark: true }], ['Normal', { value: 'Default' }]];
  for (const [label, options] of rows) {
    out.push(field(kit, x, y, w, label, options));
    y += 23;
  }
  y += 4;
  for (const name of ['Diffuse', 'Subsurface', 'Specular', 'Transmission', 'Coat', 'Sheen', 'Emission', 'Thin Film']) {
    out.push(panelHeader(kit, x + 12, y, w - 12, name, { mark: name === 'Emission' }));
    y += 21;
  }
  y += 6;
  for (const name of ['Volume', 'Displacement', 'Settings']) {
    out.push(panelHeader(kit, x, y, w, name, { mark: name === 'Settings' }));
    y += 22;
  }
  out.push(kit.text(338, ty + 4, 'Material tab', { size: 12, cls: 'd-tag' }));
  return kit.svg({ width: 440, height: 458 }, out, kit.line(330, ty, 312, ty, { cls: 'd-guide', width: 1.2 }));
};

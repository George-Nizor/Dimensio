// The Brush tool's three buttons, Stroke, Fill and Both, and what each makes of the same shape:
// an outline only, a filled area with no outline, and a filled area with its outline.
import { button } from './ui-kit.mjs';

const blob = (cx, cy) => Array.from({ length: 24 }, (_, i) => {
  const t = (i / 24) * Math.PI * 2;
  const r = 44 + Math.sin(t * 3) * 6;
  return [cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.8];
});

export default (kit) => {
  const shapes = ['Stroke', 'Fill', 'Both'].map((name, i) => {
    const cx = 90 + i * 150;
    const pts = blob(cx, 130);
    const d = `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
    return [
      button(kit, cx - 30, 30, name, { mark: name === 'Both', width: 60 }),
      name !== 'Stroke' ? `<path d="${d}" class="d-face-2"/>` : '',
      name !== 'Fill' ? kit.smooth(pts, { cls: 'd-ink', width: 2.6, closed: true }) : '',
      kit.text(cx, 200, name === 'Stroke' ? 'outline only' : name === 'Fill' ? 'fill only' : 'fill and outline', { anchor: 'middle', size: 12 }),
    ];
  });
  return kit.svg({ width: 460, height: 220 }, shapes);
};

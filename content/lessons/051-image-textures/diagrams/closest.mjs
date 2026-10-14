// A 4 by 4 pixel image shown large. Left, Interpolation Linear: neighbouring pixels blend into each
// other. Right, Closest: every pixel stays a sharp square.
const CLASSES = ['d-gizmo-x', 'd-gizmo-z', 'd-gizmo-y', 'd-mark-fill', 'd-face-1', 'd-dot', 'd-gizmo-x', 'd-gizmo-z', 'd-gizmo-y', 'd-face-1', 'd-mark-fill', 'd-gizmo-x', 'd-dot', 'd-gizmo-z', 'd-gizmo-x', 'd-gizmo-y'];

function pixels(kit, x, y, size, blur) {
  const cell = size / 4;
  const out = [];
  const clip = `pixels-${Math.round(x)}`;
  out.push(`<clipPath id="${clip}"><rect x="${x}" y="${y}" width="${size}" height="${size}"/></clipPath>`);
  const inner = [];
  CLASSES.forEach((cls, i) => {
    const cx = x + (i % 4) * cell;
    const cy = y + Math.floor(i / 4) * cell;
    if (blur) {
      // Linear: each pixel spread into its neighbours in fading rings.
      for (let k = 3; k >= 0; k -= 1) inner.push(`<rect x="${(cx - k * cell * 0.18).toFixed(1)}" y="${(cy - k * cell * 0.18).toFixed(1)}" width="${(cell + k * cell * 0.36).toFixed(1)}" height="${(cell + k * cell * 0.36).toFixed(1)}" rx="${(k * cell * 0.25).toFixed(1)}" class="${cls}" stroke-width="0" opacity="${k ? 0.22 : 0.55}"/>`);
    } else {
      inner.push(`<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" class="${cls}" stroke-width="0"/>`);
    }
  });
  out.push(`<g clip-path="url(#${clip})">${inner.join('')}</g>`);
  out.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" class="d-ink" fill="none" stroke-width="1.4"/>`);
  return out;
}

export default (kit) => kit.svg({ width: 420, height: 200 },
  pixels(kit, 40, 14, 150, true),
  kit.text(115, 188, 'Linear: blended', { anchor: 'middle', size: 12 }),
  pixels(kit, 230, 14, 150, false),
  kit.text(305, 188, 'Closest: sharp pixels', { anchor: 'middle', size: 12 }),
);

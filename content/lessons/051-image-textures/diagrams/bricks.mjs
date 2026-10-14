// A patch of brick wall, for this lesson's diagrams. Not a diagram itself. Rows of bricks offset by
// half a brick, with mortar between. `relief` draws a light top edge and a dark lower edge on each
// brick, as a normal map makes the lighting do; `dark` lays a dark wash over everything, as the
// wall looks when the normal map is linked straight to Normal.

export function bricks(kit, x, y, w, h, { rows = 6, perRow = 4, relief = true, dark = false } = {}) {
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-face-1" stroke-width="0"/>`];
  const clip = `bricks-${Math.round(x)}-${Math.round(y)}`;
  out.push(`<clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`);
  const inner = [];
  const bh = h / rows;
  const bw = w / perRow;
  const gap = Math.max(2, bh * 0.14);
  for (let r = 0; r < rows; r += 1) {
    const offset = r % 2 ? -bw / 2 : 0;
    for (let c = 0; c <= perRow; c += 1) {
      const bx = x + offset + c * bw + gap / 2;
      const by = y + r * bh + gap / 2;
      const rw = bw - gap;
      const rh = bh - gap;
      inner.push(`<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}" class="d-gizmo-x" stroke-width="0"/>`);
      if (relief) {
        inner.push(`<rect x="${bx.toFixed(1)}" y="${(by + rh - 3).toFixed(1)}" width="${rw.toFixed(1)}" height="3" class="d-face-3" stroke-width="0" style="mix-blend-mode:multiply"/>`);
        inner.push(`<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${rw.toFixed(1)}" height="2" class="d-gizmo-text" stroke-width="0" opacity="0.45"/>`);
      }
    }
  }
  // Multiplying by d-face-3 darkens in the dark theme and d-dot in the light one, so both together
  // darken in either.
  if (dark) inner.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-face-3" stroke-width="0" style="mix-blend-mode:multiply"/>`, `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-dot" stroke-width="0" opacity="0.55" style="mix-blend-mode:multiply"/>`);
  out.push(`<g clip-path="url(#${clip})">${inner.join('')}</g>`);
  out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-ink" fill="none" stroke-width="1.4"/>`);
  return out;
}

// Spheres in different materials, for this lesson's diagrams. Not a diagram itself. Each one is a
// disc with a shadow on its lower right and a highlight whose size follows Roughness: a small hard
// spot at 0, a wide soft glow at 0.5, none at 1. White highlights use d-gizmo-text, the one theme
// fill that is white in both themes.
//
//   sphere(kit, cx, cy, r, { body, roughness, metal, glow, alpha, glass })
//   stripes(kit, x, y, w, h)   a striped backdrop to see through glass and alpha

const ellipse = (cx, cy, rx, ry, cls, opacity = 1, extra = '') => `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" class="${cls}" stroke-width="0" opacity="${opacity}"${extra}/>`;

export function sphere(kit, cx, cy, r, { body = 'd-face-2', roughness = 0.5, metal = false, glow = false, alpha = 1, glass = false } = {}) {
  const out = [];
  if (glow) {
    for (let i = 3; i >= 1; i -= 1) out.push(`<circle cx="${cx}" cy="${cy}" r="${(r * (1 + i * 0.16)).toFixed(1)}" class="${body}" stroke-width="0" opacity="${(0.12 * (4 - i)).toFixed(2)}"/>`);
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2;
      out.push(kit.line(cx + Math.cos(a) * r * 1.62, cy + Math.sin(a) * r * 1.62, cx + Math.cos(a) * r * 1.85, cy + Math.sin(a) * r * 1.85, { cls: 'd-mark', width: 1.6 }));
    }
  }
  const clip = `sphere-${Math.round(cx)}-${Math.round(cy)}-${Math.round(r)}`;
  out.push(`<clipPath id="${clip}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`);
  const inside = [];
  // Shadow: the disc minus a lit disc shifted up and left, in three soft steps. Multiply blending
  // darkens whatever is underneath in both themes.
  const shade = (strength) => {
    const steps = [];
    for (let k = 1; k <= 3; k += 1) {
      const lr = r * (1.08 - 0.13 * k);
      const lx = cx - r * 0.28;
      const ly = cy - r * 0.3;
      steps.push(`<path d="M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z M ${(lx - lr).toFixed(1)} ${ly.toFixed(1)} a ${lr.toFixed(1)} ${lr.toFixed(1)} 0 1 1 ${(2 * lr).toFixed(1)} 0 a ${lr.toFixed(1)} ${lr.toFixed(1)} 0 1 1 ${(-2 * lr).toFixed(1)} 0 Z" fill-rule="evenodd" class="d-face-3" stroke-width="0" opacity="${strength}" style="mix-blend-mode:multiply"/>`);
    }
    return steps;
  };
  if (glass) {
    // Glass bends what is behind it: the stripes show flipped and squeezed inside the sphere.
    inside.push(`<circle cx="${cx}" cy="${cy}" r="${r}" class="d-paper" stroke-width="0"/>`);
    for (let i = -3; i <= 3; i += 1) inside.push(`<rect x="${(cx + i * r * 0.26 - r * 0.06).toFixed(1)}" y="${cy - r}" width="${(r * 0.12).toFixed(1)}" height="${2 * r}" class="d-dot" stroke-width="0" opacity="0.3"/>`);
    inside.push(...shade(0.35));
  } else {
    inside.push(`<circle cx="${cx}" cy="${cy}" r="${r}" class="${body}" stroke-width="0"/>`);
    if (metal) {
      // A metal shows its surroundings, tinted: a dark ground below a bright horizon.
      inside.push(`<path d="M ${cx - r} ${cy + r * 0.12} Q ${cx} ${cy + r * 0.3} ${cx + r} ${cy + r * 0.12} L ${cx + r} ${cy + r} L ${cx - r} ${cy + r} Z" class="d-face-3" stroke-width="0" style="mix-blend-mode:multiply"/>`);
      inside.push(`<path d="M ${cx - r} ${cy + r * 0.12} Q ${cx} ${cy + r * 0.3} ${cx + r} ${cy + r * 0.12} L ${cx + r} ${cy + r} L ${cx - r} ${cy + r} Z" class="d-face-3" stroke-width="0" opacity="0.6" style="mix-blend-mode:multiply"/>`);
      inside.push(ellipse(cx, cy + r * 0.04, r * 1.1, r * 0.1, 'd-gizmo-text', 0.55));
      inside.push(...shade(0.5));
    } else if (!glow) inside.push(...shade(0.45));
  }
  // The highlight: hard and small when smooth, soft and wide when rough, gone at 1.
  const hx = cx - r * 0.36;
  const hy = cy - r * 0.38;
  if (roughness < 0.25) inside.push(ellipse(hx, hy, r * 0.13, r * 0.09, 'd-gizmo-text', 1));
  else if (roughness < 0.75) for (let i = 1; i <= 4; i += 1) inside.push(ellipse(hx, hy, r * 0.12 * i, r * 0.09 * i, 'd-gizmo-text', 0.16));
  out.push(`<g clip-path="url(#${clip})" opacity="${alpha}">${inside.join('')}</g>`);
  out.push(kit.circle(cx, cy, r, { cls: 'd-ink', width: 1.6, dash: alpha < 1 ? '4 4' : undefined }));
  return out;
}

export function stripes(kit, x, y, w, h, { width = 12 } = {}) {
  const out = [];
  for (let sx = x; sx < x + w - 0.1; sx += width * 2) out.push(`<rect x="${sx}" y="${y}" width="${Math.min(width, x + w - sx)}" height="${h}" class="d-dot" stroke-width="0" opacity="0.18"/>`);
  return out;
}

// A field from the Properties editor: a label and a value or swatch in a sunk box.
export function field(kit, x, y, w, label, { value, swatch, mark = false, bad = false } = {}) {
  const out = [];
  if (mark || bad) out.push(`<rect x="${x - 4}" y="${y - 3}" width="${w + 8}" height="22" rx="4" class="${bad ? 'd-key-bad' : 'd-ui-mark'}" stroke-width="1" opacity="${bad ? 0.35 : 1}"/>`);
  out.push(kit.text(x + 76, y + 12, label, { size: 11, anchor: 'end' }));
  out.push(`<rect x="${x + 82}" y="${y}" width="${w - 82}" height="16" rx="3" class="d-sunk" stroke-width="1"/>`);
  if (value !== undefined) out.push(kit.text(x + w - 6, y + 12, value, { size: 11, anchor: 'end', cls: 'd-key-text' }));
  if (swatch) out.push(`<rect x="${x + 84}" y="${y + 2}" width="${w - 86}" height="12" rx="2" class="${swatch}" stroke-width="0"/>`);
  return out;
}

// A collapsible panel header from the Properties editor, open or closed.
export function panelHeader(kit, x, y, w, label, { open = false, mark = false } = {}) {
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="18" rx="3" class="${mark ? 'd-ui-mark' : 'd-sunk'}" stroke-width="1"/>`];
  out.push(open
    ? kit.path(`M ${x + 8} ${y + 7} L ${x + 12} ${y + 11} L ${x + 16} ${y + 7}`, { cls: 'd-ink', width: 1.4 })
    : kit.path(`M ${x + 10} ${y + 5} L ${x + 14} ${y + 9} L ${x + 10} ${y + 13}`, { cls: 'd-ink', width: 1.4 }));
  out.push(kit.text(x + 22, y + 13, label, { size: 11 }));
  return out;
}

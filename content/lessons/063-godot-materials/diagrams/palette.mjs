// The sign's board with each setting. Left, Interpolation Linear: towards each edge the red mixes
// with the swatches around it in the palette (Godot's Filter becomes Linear Mipmap). Right,
// Closest: one flat red (Nearest Mipmap in Godot).
import { panel } from './shapes.mjs';

// A face drawn as a grid of small cells. In the blurred one, cells towards an edge take the
// neighbouring swatch's colour more and more often, the way a bilinear blend fades across a face.
function board(kit, x, y, w, h, blurred) {
  const cols = 16;
  const rows = 8;
  const out = [];
  if (!blurred) {
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-gizmo-x" stroke-width="0"/>`);
    out.push(kit.polyline([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], { cls: 'd-ink', width: 1.6 }));
    return out;
  }
  const neighbour = (cx, cy) => (cy < rows / 2 ? 'd-face-sel' : cx < cols / 2 ? 'd-key-bad' : 'd-key-mark');
  for (let cy = 0; cy < rows; cy += 1) {
    for (let cx = 0; cx < cols; cx += 1) {
      const edge = Math.min(cx + 0.5, cols - cx - 0.5, (cy + 0.5) * 2, (rows - cy - 0.5) * 2) / 4;
      const mix = Math.max(0, 1 - edge);
      const pick = ((cx * 7 + cy * 13) % 10) / 10 < mix;
      const cls = pick ? neighbour(cx, cy) : 'd-gizmo-x';
      out.push(`<rect x="${(x + (cx * w) / cols).toFixed(1)}" y="${(y + (cy * h) / rows).toFixed(1)}" width="${(w / cols + 0.4).toFixed(1)}" height="${(h / rows + 0.4).toFixed(1)}" class="${cls}" stroke-width="0"/>`);
    }
  }
  out.push(kit.polyline([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], { cls: 'd-ink', width: 1.6 }));
  return out;
}

export default (kit) => kit.svg({ width: 500, height: 250 },
  panel(kit, 14, 14, 222, 170),
  board(kit, 44, 50, 162, 80, true),
  kit.text(125, 210, 'Interpolation: Linear', { size: 12, anchor: 'middle' }),
  kit.text(125, 230, 'Godot: Linear Mipmap', { size: 12, anchor: 'middle' }),
  panel(kit, 264, 14, 222, 170),
  board(kit, 294, 50, 162, 80, false),
  kit.text(375, 210, 'Interpolation: Closest', { size: 12, anchor: 'middle', cls: 'd-tag' }),
  kit.text(375, 230, 'Godot: Nearest Mipmap', { size: 12, anchor: 'middle' }),
);

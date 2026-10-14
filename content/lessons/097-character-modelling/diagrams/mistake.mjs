// Wrong: a middle vertex dragged off the mirror line, so a gap opens down the seam between the
// half and its Mirror copy. Right: with Clipping on, the middle vertices stay on the line and the
// halves meet.
import { views, drawMesh, box, mirror } from '../../../diagrams/mesh.mjs';
import { frame } from './charkit.mjs';

export default (kit) => {
  const half = box({ size: [0.19, 0.22, 0.5], segments: [1, 1, 2], center: [0.095, 0, 1.2] });
  const pulled = { verts: half.verts.map((p) => (Math.abs(p[0]) < 1e-6 && p[2] > 1.1 ? [0.035, p[1], p[2]] : p)), faces: half.faces };
  const side = (x, m, tag, tone) => {
    const v = views.front({ at: [x + 122, 116], scale: 260, target: [0, 0, 1.2] });
    return [
      frame(kit, x, 14, 244, 200),
      drawMesh(kit, mirror(m, 'x'), v, { width: 1, cls: 'd-guide' }),
      drawMesh(kit, m, v, { width: 1.4 }),
      kit.line(x + 122, 24, x + 122, 204, { cls: 'd-mark', width: 1.2, dash: '5 5' }),
      kit.tag(x + 122, 240, tag, { tone }),
    ];
  };
  return kit.svg({ width: 520, height: 254 },
    side(12, pulled, 'gap down the seam', 'bad'),
    side(264, half, 'Clipping on'),
  );
};

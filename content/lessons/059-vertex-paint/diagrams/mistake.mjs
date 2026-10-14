// Wrong: the trunk painted with the brush and no face mask, so its colour runs onto the lowest
// faces of the canopy. Right: the trunk filled through the face mask, its colour stopping at the
// edge where trunk and canopy meet.
import { view, centroid } from '../../../diagrams/mesh.mjs';
import { tree, drawPainted, panel } from './parts.mjs';

export default (kit) => {
  const { mesh, part } = tree();
  // The canopy faces nearest the trunk top, the ones a brush stroke along the trunk reaches.
  const spill = (i) => {
    const c = centroid(mesh, mesh.faces[i]);
    return part(i) === 'low' && c[2] < 1.2 && Math.hypot(c[0], c[1]) < 0.5;
  };
  // Seen from a little below, where the underside of the canopy meets the trunk.
  const left = view({ azimuth: 30, elevation: -18, scale: 120, at: [125, 92], target: [0, 0, 1.0] });
  const right = view({ azimuth: 30, elevation: -18, scale: 120, at: [375, 92], target: [0, 0, 1.0] });
  const wrong = (i) => (part(i) === 'trunk' || spill(i) ? 'd-key-mark' : 'd-gizmo-y');
  const good = (i) => (part(i) === 'trunk' ? 'd-key-mark' : 'd-gizmo-y');
  return kit.svg({ width: 500, height: 250 },
    `<clipPath id="vp-mistake-l"><rect x="14" y="14" width="222" height="196" rx="6"/></clipPath>`,
    `<clipPath id="vp-mistake-r"><rect x="264" y="14" width="222" height="196" rx="6"/></clipPath>`,
    panel(kit, 14, 14, 222, 196),
    `<g clip-path="url(#vp-mistake-l)">${drawPainted(kit, mesh, left, wrong, { width: 1.1 }).join('')}</g>`,
    kit.tag(125, 236, 'brush runs over', { tone: 'bad' }),
    panel(kit, 264, 14, 222, 196),
    `<g clip-path="url(#vp-mistake-r)">${drawPainted(kit, mesh, right, good, { width: 1.1 }).join('')}</g>`,
    kit.tag(375, 236, 'mask and fill'),
  );
};

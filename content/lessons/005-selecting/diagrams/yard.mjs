// Barrels and crates for this lesson's diagrams, drawn back to front with their selection state.
// Not a diagram itself.
import { cube, cylinder, translate, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { origin } from './parts.mjs';

export const barrel = (x, y) => translate(cylinder({ vertices: 12, radius: 0.35, depth: 0.9 }), [x, y, 0.45]);
export const crate = (x, y) => translate(cube(0.8), [x, y, 0.4]);

export const yardView = (o = {}) => view({ azimuth: 25, elevation: 40, scale: 34, ...o });

// items: [{ mesh, at: [x, y], state: 'none' | 'selected' | 'active', dot }]. Selected objects are
// drawn with orange edges, the active one also filled. `dot` draws its origin.
export function drawYard(kit, v, items) {
  const sorted = [...items].sort((a, b) => v.depth([...a.at, 0.4]) - v.depth([...b.at, 0.4]));
  return sorted.map((item) => {
    const all = item.mesh.faces.map((_, i) => i);
    const style = item.state === 'active' ? { cls: 'd-mark', width: 2.4, select: { faces: all } }
      : item.state === 'selected' ? { cls: 'd-mark', width: 2.2 }
        : { width: 1.4 };
    const out = [drawMesh(kit, item.mesh, v, style)];
    if (item.dot) { const [x, y] = v.project([...item.at, 0.42]); out.push(origin(kit, x, y)); }
    return out;
  });
}

export const B = (x, y, state = 'none', dot = false) => ({ mesh: barrel(x, y), at: [x, y], state, dot });
export const C = (x, y, state = 'none', dot = false) => ({ mesh: crate(x, y), at: [x, y], state, dot });

// The mesh kit for lesson diagrams. Delineare draws lines and boxes on paper; Dimensio's lessons
// draw meshes. A diagram builds a real mesh here (a cube, a box with loop cuts, an extruded face),
// looks at it from a view, and draws it with the drawing kit from lib.mjs, so every edge in a
// picture is an edge the mesh really has.
//
// Coordinates are Blender's: X to the right, Y away from the front view, Z up, in metres. A view
// takes an azimuth (0 looks from the front, 90 from the right) and an elevation (90 looks down).
//
// Classes the app styles, so diagrams follow the theme: d-face-1 to d-face-3 (lit, mid and dark
// faces), d-face-sel (a selected face), d-axis-x, d-axis-y, d-axis-z and d-axis-*-text (Blender's
// red, green and blue), d-ui and d-ui-mark (the window schematic), d-key, d-key-mark, d-key-text and
// d-key-text-mark (keys and mouse buttons, plain and picked out), d-key-bad (a setting picked out
// as the wrong one), d-cursor (the mouse pointer), d-gizmo-x, -y, -z, their -neg
// forms, d-gizmo-mark and d-gizmo-text (the navigation gizmo), plus lib.mjs's own d-ink, d-guide,
// d-mark, d-mark-fill, d-bad, d-label, d-tag and d-sunk (a recessed panel).

const rad = (deg) => (deg * Math.PI) / 180;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const key = (p) => p.map((v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(5)).join(',');

// ---- Building meshes ---------------------------------------------------------------------------

export function mesh(verts, faces) {
  return { verts: verts.map((v) => [...v]), faces: faces.map((f) => [...f]) };
}

export function centroid(m, face) {
  const c = [0, 0, 0];
  for (const i of face) { c[0] += m.verts[i][0]; c[1] += m.verts[i][1]; c[2] += m.verts[i][2]; }
  return mul(c, 1 / face.length);
}

// Newell's method: a face normal that holds for any flat polygon, convex or not.
export function normal(m, face) {
  const n = [0, 0, 0];
  for (let i = 0; i < face.length; i += 1) {
    const a = m.verts[face[i]];
    const b = m.verts[face[(i + 1) % face.length]];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]);
    n[1] += (a[2] - b[2]) * (a[0] + b[0]);
    n[2] += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return norm(n);
}

// Turns every face to point away from the middle. Only right for shapes with no dents (boxes,
// cylinders, spheres), which is what the primitives here make.
export function orientOutward(m) {
  const middle = mul(m.verts.reduce((s, v) => add(s, v), [0, 0, 0]), 1 / m.verts.length);
  m.faces = m.faces.map((f) => (dot3(normal(m, f), sub(centroid(m, f), middle)) < 0 ? [...f].reverse() : f));
  return m;
}

// A box, `size` metres along X, Y and Z, cut into `segments` along each axis. segments [1, 1, 1]
// is Blender's default cube when size is [2, 2, 2]; [1, 1, 3] is that cube with two horizontal loop
// cuts.
export function box({ size = [2, 2, 2], segments = [1, 1, 1], center = [0, 0, 0] } = {}) {
  const verts = [];
  const index = new Map();
  const at = (p) => {
    const k = key(p);
    if (!index.has(k)) { index.set(k, verts.length); verts.push(p); }
    return index.get(k);
  };
  const faces = [];
  const half = size.map((s) => s / 2);
  // Each side of the box is a grid on one axis' plane, at -half and +half.
  for (const axis of [0, 1, 2]) {
    const [u, v] = [0, 1, 2].filter((a) => a !== axis);
    for (const side of [-1, 1]) {
      for (let i = 0; i < segments[u]; i += 1) {
        for (let j = 0; j < segments[v]; j += 1) {
          const corner = (a, b) => {
            const p = [0, 0, 0];
            p[axis] = center[axis] + side * half[axis];
            p[u] = center[u] - half[u] + (size[u] * (i + a)) / segments[u];
            p[v] = center[v] - half[v] + (size[v] * (j + b)) / segments[v];
            return at(p);
          };
          faces.push([corner(0, 0), corner(1, 0), corner(1, 1), corner(0, 1)]);
        }
      }
    }
  }
  return orientOutward({ verts, faces });
}

export function cube(size = 2) {
  return box({ size: [size, size, size] });
}

// A flat grid on the floor (Z = 0), like Add > Mesh > Plane or Grid.
export function plane({ size = [2, 2], segments = [1, 1], z = 0 } = {}) {
  const verts = [];
  for (let j = 0; j <= segments[1]; j += 1) {
    for (let i = 0; i <= segments[0]; i += 1) {
      verts.push([-size[0] / 2 + (size[0] * i) / segments[0], -size[1] / 2 + (size[1] * j) / segments[1], z]);
    }
  }
  const row = segments[0] + 1;
  const faces = [];
  for (let j = 0; j < segments[1]; j += 1) {
    for (let i = 0; i < segments[0]; i += 1) faces.push([j * row + i, j * row + i + 1, (j + 1) * row + i + 1, (j + 1) * row + i]);
  }
  return { verts, faces };
}

// A cylinder standing on its axis, like Add > Mesh > Cylinder. caps 'ngon' closes each end with
// one face, 'fan' with triangles to a middle vertex, 'none' leaves the ends open.
export function cylinder({ vertices = 8, radius = 1, depth = 2, caps = 'ngon', center = [0, 0, 0] } = {}) {
  const verts = [];
  for (const z of [-depth / 2, depth / 2]) {
    for (let i = 0; i < vertices; i += 1) {
      const t = (i / vertices) * Math.PI * 2;
      verts.push([center[0] + Math.cos(t) * radius, center[1] + Math.sin(t) * radius, center[2] + z]);
    }
  }
  const faces = [];
  for (let i = 0; i < vertices; i += 1) {
    const j = (i + 1) % vertices;
    faces.push([i, j, vertices + j, vertices + i]);
  }
  if (caps === 'ngon') {
    faces.push([...Array(vertices).keys()]);
    faces.push([...Array(vertices).keys()].map((i) => vertices + i));
  } else if (caps === 'fan') {
    const bottom = verts.push([center[0], center[1], center[2] - depth / 2]) - 1;
    const top = verts.push([center[0], center[1], center[2] + depth / 2]) - 1;
    for (let i = 0; i < vertices; i += 1) {
      const j = (i + 1) % vertices;
      faces.push([i, j, bottom], [vertices + i, vertices + j, top]);
    }
  }
  return orientOutward({ verts, faces });
}

// A UV sphere, like Add > Mesh > UV Sphere: quads between rings, triangles at the poles.
export function uvSphere({ segments = 16, rings = 8, radius = 1, center = [0, 0, 0] } = {}) {
  const verts = [[center[0], center[1], center[2] - radius]];
  for (let r = 1; r < rings; r += 1) {
    const phi = -Math.PI / 2 + (Math.PI * r) / rings;
    for (let s = 0; s < segments; s += 1) {
      const t = (s / segments) * Math.PI * 2;
      verts.push([center[0] + Math.cos(phi) * Math.cos(t) * radius, center[1] + Math.cos(phi) * Math.sin(t) * radius, center[2] + Math.sin(phi) * radius]);
    }
  }
  const top = verts.push([center[0], center[1], center[2] + radius]) - 1;
  const ring = (r, s) => 1 + (r - 1) * segments + (s % segments);
  const faces = [];
  for (let s = 0; s < segments; s += 1) faces.push([0, ring(1, s + 1), ring(1, s)]);
  for (let r = 1; r < rings - 1; r += 1) {
    for (let s = 0; s < segments; s += 1) faces.push([ring(r, s), ring(r, s + 1), ring(r + 1, s + 1), ring(r + 1, s)]);
  }
  for (let s = 0; s < segments; s += 1) faces.push([ring(rings - 1, s), ring(rings - 1, s + 1), top]);
  return orientOutward({ verts, faces });
}

// A box with every edge bevelled once (one segment), `width` metres wide: the shape Ctrl+B with one
// segment, or a Bevel modifier, gives a cube.
export function bevelledBox({ size = [2, 2, 2], width = 0.2, center = [0, 0, 0] } = {}) {
  const h = size.map((s) => s / 2);
  const verts = [];
  const id = new Map();
  // Each corner of the box splits into three vertices, one on each face that meets there.
  const corner = (sx, sy, sz, onAxis) => {
    const k = `${sx}${sy}${sz}${onAxis}`;
    if (!id.has(k)) {
      const p = [sx * (h[0] - width), sy * (h[1] - width), sz * (h[2] - width)];
      p[onAxis] = [sx, sy, sz][onAxis] * h[onAxis];
      id.set(k, verts.push(add(p, center)) - 1);
    }
    return id.get(k);
  };
  const signs = [-1, 1];
  const faces = [];
  for (const axis of [0, 1, 2]) {
    const [u, v] = [0, 1, 2].filter((a) => a !== axis);
    for (const s of signs) {
      const c = (a, b) => { const p = [0, 0, 0]; p[axis] = s; p[u] = a; p[v] = b; return corner(p[0], p[1], p[2], axis); };
      faces.push([c(-1, -1), c(1, -1), c(1, 1), c(-1, 1)]);
    }
  }
  // A long thin face along every edge of the original box.
  for (const along of [0, 1, 2]) {
    const [a, b] = [0, 1, 2].filter((x) => x !== along);
    for (const sa of signs) {
      for (const sb of signs) {
        const p = (t, onAxis) => { const q = [0, 0, 0]; q[along] = t; q[a] = sa; q[b] = sb; return corner(q[0], q[1], q[2], onAxis); };
        faces.push([p(-1, a), p(1, a), p(1, b), p(-1, b)]);
      }
    }
  }
  // A triangle at every corner.
  for (const sx of signs) for (const sy of signs) for (const sz of signs) faces.push([corner(sx, sy, sz, 0), corner(sx, sy, sz, 1), corner(sx, sy, sz, 2)]);
  return orientOutward({ verts, faces });
}

// ---- Changing meshes ---------------------------------------------------------------------------

export function transform(m, fn) {
  return { verts: m.verts.map((v) => fn([...v])), faces: m.faces.map((f) => [...f]) };
}

export const translate = (m, by) => transform(m, (v) => add(v, by));
export const scale = (m, by) => transform(m, (v) => [v[0] * by[0], v[1] * by[1], v[2] * by[2]]);

// Turns a mesh about an axis ('x', 'y' or 'z') through the origin, in degrees, the way R X 90 does.
export function rotate(m, axis, degrees) {
  const c = Math.cos(rad(degrees));
  const s = Math.sin(rad(degrees));
  return transform(m, ([x, y, z]) => {
    if (axis === 'x') return [x, y * c - z * s, y * s + z * c];
    if (axis === 'y') return [x * c + z * s, y, -x * s + z * c];
    return [x * c - y * s, x * s + y * c, z];
  });
}

// Puts several meshes into one, as joining objects with Ctrl+J does.
export function join(...meshes) {
  const out = { verts: [], faces: [] };
  for (const m of meshes) {
    const offset = out.verts.length;
    out.verts.push(...m.verts.map((v) => [...v]));
    out.faces.push(...m.faces.map((f) => f.map((i) => i + offset)));
  }
  return out;
}

// A mirrored copy across one axis, the way the Mirror modifier makes the other half.
export function mirror(m, axis = 'x') {
  const i = { x: 0, y: 1, z: 2 }[axis];
  return { verts: m.verts.map((v) => { const p = [...v]; p[i] = -p[i]; return p; }), faces: m.faces.map((f) => [...f].reverse()) };
}

// Extrudes faces as one region along their average normal, `distance` metres, the way E does in
// face select mode. Returns the new mesh and the indices of the moved faces, which stay selected.
export function extrude(m, faceIndices, distance) {
  const out = { verts: m.verts.map((v) => [...v]), faces: m.faces.map((f) => [...f]) };
  const chosen = new Set(faceIndices);
  const direction = norm(faceIndices.reduce((s, f) => add(s, normal(m, m.faces[f])), [0, 0, 0]));
  // Edges used by exactly one chosen face are the region's border; each grows a side wall.
  const count = new Map();
  for (const f of faceIndices) {
    const face = m.faces[f];
    face.forEach((a, i) => { const b = face[(i + 1) % face.length]; const k = a < b ? `${a}-${b}` : `${b}-${a}`; count.set(k, (count.get(k) || 0) + 1); });
  }
  const moved = new Map();
  const copy = (i) => { if (!moved.has(i)) moved.set(i, out.verts.push(add(m.verts[i], mul(direction, distance))) - 1); return moved.get(i); };
  for (const f of faceIndices) {
    const face = m.faces[f];
    face.forEach((a, i) => {
      const b = face[(i + 1) % face.length];
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (count.get(k) === 1) out.faces.push([a, b, copy(b), copy(a)]);
    });
    out.faces[f] = face.map(copy);
  }
  return { mesh: out, faces: [...chosen] };
}

// Insets one face, the way I does: a smaller copy of the face, `amount` of the way to its middle
// (0 to 1), joined to the old border by a ring of faces. Returns the mesh and the new inner face.
export function inset(m, faceIndex, amount = 0.25) {
  const out = { verts: m.verts.map((v) => [...v]), faces: m.faces.map((f) => [...f]) };
  const face = m.faces[faceIndex];
  const middle = centroid(m, face);
  const inner = face.map((i) => out.verts.push(add(m.verts[i], mul(sub(middle, m.verts[i]), amount))) - 1);
  face.forEach((a, i) => {
    const j = (i + 1) % face.length;
    out.faces.push([a, face[j], inner[j], inner[i]]);
  });
  out.faces[faceIndex] = inner;
  return { mesh: out, face: faceIndex };
}

// ---- Choosing parts of a mesh ------------------------------------------------------------------

export function edges(m) {
  const seen = new Map();
  m.faces.forEach((face, f) => face.forEach((a, i) => {
    const b = face[(i + 1) % face.length];
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!seen.has(k)) seen.set(k, { a: Math.min(a, b), b: Math.max(a, b), faces: [] });
    seen.get(k).faces.push(f);
  }));
  return [...seen.values()];
}

// Picks by position: facesWhere(m, (c, n) => n[2] > 0.9) is every face pointing up.
export const facesWhere = (m, test) => m.faces.map((f, i) => [i, test(centroid(m, f), normal(m, f), f)]).filter(([, ok]) => ok).map(([i]) => i);
export const vertsWhere = (m, test) => m.verts.map((v, i) => [i, test(v)]).filter(([, ok]) => ok).map(([i]) => i);
export const edgesWhere = (m, test) => edges(m).filter((e) => test(m.verts[e.a], m.verts[e.b])).map((e) => [e.a, e.b]);

// ---- Looking at meshes -------------------------------------------------------------------------

// A view of the scene. azimuth 0 is the front view (numpad 1), 90 the right view (numpad 3);
// elevation 90 is the top view (numpad 7). The default matches Blender's opening view: in front, to
// the right and a little above. `scale` is pixels per metre and `at` is where `target` lands.
// The view is orthographic unless `distance` is set: then it is a perspective view from that many
// metres away, so nearer parts look bigger, as numpad 5 switches between.
export function view({ azimuth = 40, elevation = 28, scale = 60, at = [180, 120], target = [0, 0, 0], distance = 0 } = {}) {
  const az = rad(azimuth);
  const el = rad(elevation);
  const toward = [Math.cos(el) * Math.sin(az), -Math.cos(el) * Math.cos(az), Math.sin(el)];
  const right = [Math.cos(az), Math.sin(az), 0];
  const up = cross(toward, right);
  const depth = (p) => dot3(sub(p, target), toward);
  const project = (p) => {
    const d = sub(p, target);
    const f = distance ? distance / Math.max(distance - depth(p), 0.01) : 1;
    return [at[0] + dot3(d, right) * scale * f, at[1] - dot3(d, up) * scale * f];
  };
  // In perspective a face can face the camera even when it points slightly away from the view
  // direction, so facing tests use the direction from the face to the eye.
  const eye = distance ? add(target, mul(toward, distance)) : null;
  return { project, depth, toward, scale, eye };
}

export const views = {
  front: (o = {}) => view({ azimuth: 0, elevation: 0, ...o }),
  right: (o = {}) => view({ azimuth: 90, elevation: 0, ...o }),
  top: (o = {}) => view({ azimuth: 0, elevation: 90, ...o }),
  user: (o = {}) => view(o),
};

const facing = (m, face, v) => dot3(normal(m, face), v.eye ? sub(v.eye, centroid(m, face)) : v.toward) > 1e-6;
const points = (m, face, v) => face.map((i) => v.project(m.verts[i]));

// Draws a mesh. mode 'solid' fills faces in three tones by how they face the light and hides what
// is behind; 'wire' draws every edge alike; 'xray' draws front edges solid and back edges dashed.
// select: { faces, edges, verts } in Blender's selection colour (the accent); width is the edge
// weight in pixels.
export function drawMesh(kit, m, v, { mode = 'solid', select = {}, width = 2, cls = 'd-ink', light = [-0.4, -0.6, 0.7] } = {}) {
  const out = [];
  const selFaces = new Set(select.faces || []);
  const lightDir = norm(light);
  if (mode === 'solid') {
    const order = m.faces.map((f, i) => ({ f, i, d: Math.max(...f.map((j) => v.depth(m.verts[j]))) * 0.25 + f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length }))
      .filter(({ f }) => facing(m, f, v) || m.faces.length < 3)
      .sort((a, b) => a.d - b.d);
    for (const { f, i } of order) {
      const lit = dot3(normal(m, f), lightDir);
      const tone = selFaces.has(i) ? 'd-face-sel' : lit > 0.45 ? 'd-face-1' : lit > -0.1 ? 'd-face-2' : 'd-face-3';
      const pts = points(m, f, v);
      out.push(`<path d="M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z" class="${tone}"/>`);
      out.push(kit.polyline([...pts, pts[0]], { cls, width }));
    }
  } else {
    for (const e of edges(m)) {
      const front = mode === 'wire' || e.faces.length < 2 || e.faces.some((f) => facing(m, m.faces[f], v));
      const a = v.project(m.verts[e.a]);
      const b = v.project(m.verts[e.b]);
      out.push(kit.line(a[0], a[1], b[0], b[1], front ? { cls, width } : { cls: 'd-guide', width: width * 0.7, dash: '4 5' }));
    }
  }
  // A selected edge behind the model is drawn dashed in solid and x-ray views, as Blender hides it.
  const byKey = new Map(edges(m).map((e) => [`${e.a}-${e.b}`, e]));
  for (const [a, b] of select.edges || []) {
    const e = byKey.get(a < b ? `${a}-${b}` : `${b}-${a}`);
    const hidden = mode !== 'wire' && e && e.faces.length > 1 && !e.faces.some((f) => facing(m, m.faces[f], v));
    const p = v.project(m.verts[a]);
    const q = v.project(m.verts[b]);
    out.push(kit.line(p[0], p[1], q[0], q[1], hidden ? { cls: 'd-mark', width: width * 0.9, dash: '4 5' } : { cls: 'd-mark', width: width * 1.8 }));
  }
  for (const i of select.verts || []) {
    const [x, y] = v.project(m.verts[i]);
    out.push(kit.dot(x, y, { r: width * 1.9, cls: 'd-mark-fill' }));
  }
  return out;
}

// An arrow between two points in the scene, for a move or an extrusion.
export function arrow(kit, v, from, to, { cls = 'd-mark', width = 2 } = {}) {
  const a = v.project(from);
  const b = v.project(to);
  return [kit.line(a[0], a[1], b[0], b[1], { cls, width }), kit.arrowhead(b[0], b[1], Math.atan2(b[1] - a[1], b[0] - a[0]), { cls, width })];
}

// The three axes from a point, in Blender's colours, with their letters.
export function axes(kit, v, { origin = [0, 0, 0], length = 1, labels = true, width = 2 } = {}) {
  return [['x', [1, 0, 0]], ['y', [0, 1, 0]], ['z', [0, 0, 1]]].flatMap(([name, dir]) => {
    const end = add(origin, mul(dir, length));
    const [x, y] = v.project(end);
    const o = v.project(origin);
    const angle = Math.atan2(y - o[1], x - o[0]);
    return [
      kit.line(o[0], o[1], x, y, { cls: `d-axis-${name}`, width }),
      kit.arrowhead(x, y, angle, { cls: `d-axis-${name}`, width }),
      labels ? kit.text(x + Math.cos(angle) * 12, y + Math.sin(angle) * 12 + 5, name.toUpperCase(), { cls: `d-label d-axis-${name}-text`, anchor: 'middle', size: 13 }) : '',
    ];
  });
}

// A measurement between two points, as on a technical drawing: extension lines, a line with an
// arrowhead at each end, and the length in the middle. `offset` pushes it clear of the model.
export function dimension(kit, v, from, to, { offset = [0, 0, 0], label, cls = 'd-mark', width = 1.6 } = {}) {
  const a0 = v.project(from);
  const b0 = v.project(to);
  const a = v.project(add(from, offset));
  const b = v.project(add(to, offset));
  const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const text = label ?? `${Math.hypot(...sub(to, from)).toFixed(2).replace(/\.?0+$/, '')} m`;
  // The label sits beside the line, on the side away from the model.
  let side = [a[0] - a0[0], a[1] - a0[1]];
  if (Math.hypot(...side) < 1) side = [Math.sin(angle), -Math.cos(angle)];
  const along = Math.hypot(...side);
  const lx = (a[0] + b[0]) / 2 + (side[0] / along) * 14;
  const ly = (a[1] + b[1]) / 2 + (side[1] / along) * 14 + 4;
  const anchor = Math.abs(side[0] / along) > 0.7 ? (side[0] > 0 ? 'start' : 'end') : 'middle';
  return [
    kit.line(a0[0], a0[1], a[0], a[1], { cls: 'd-guide', width: 1.2 }),
    kit.line(b0[0], b0[1], b[0], b[1], { cls: 'd-guide', width: 1.2 }),
    kit.line(a[0], a[1], b[0], b[1], { cls, width }),
    kit.arrowhead(a[0], a[1], angle + Math.PI, { cls, width, size: 7 }),
    kit.arrowhead(b[0], b[1], angle, { cls, width, size: 7 }),
    kit.text(anchor === 'middle' ? lx : lx - (side[0] / along) * 8, ly, text, { anchor, size: 12 }),
  ];
}

// ---- The Blender window ------------------------------------------------------------------------

// A plain schematic of Blender's Layout workspace, for lessons about the interface. `highlight`
// names the areas to pick out: topbar, toolbar, header, viewport, sidebar, outliner, properties,
// timeline, statusbar. Proportions follow the default 1920 by 1080 window.
export function blenderWindow(kit, { x = 0, y = 0, width = 480, height = 270, highlight = [], labels = true, sidebar = false } = {}) {
  const top = height * 0.045;
  const status = height * 0.035;
  const right = width * 0.22;
  const timeline = height * 0.17;
  const header = height * 0.05;
  const body = height - top - status;
  const outlinerH = body * 0.3;
  const leftW = width - right;
  const viewportH = body - timeline;
  const areas = {
    topbar: [x, y, width, top],
    header: [x, y + top, leftW, header],
    toolbar: [x, y + top + header, width * 0.035, viewportH - header],
    viewport: [x, y + top + header, leftW, viewportH - header],
    sidebar: [x + leftW - width * 0.14, y + top + header, width * 0.14, viewportH - header],
    outliner: [x + leftW, y + top, right, outlinerH],
    properties: [x + leftW, y + top + outlinerH, right, body - outlinerH],
    timeline: [x, y + top + viewportH, leftW, timeline],
    statusbar: [x, y + height - status, width, status],
  };
  const names = { topbar: 'Topbar', header: 'Header', toolbar: 'Toolbar', viewport: '3D Viewport', sidebar: 'Sidebar', outliner: 'Outliner', properties: 'Properties', timeline: 'Timeline', statusbar: 'Status bar' };
  const order = ['viewport', 'header', 'toolbar', ...(sidebar || highlight.includes('sidebar') ? ['sidebar'] : []), 'outliner', 'properties', 'timeline', 'topbar', 'statusbar'];
  const out = [];
  for (const name of order) {
    const [ax, ay, aw, ah] = areas[name];
    const on = highlight.includes(name);
    out.push(`<rect x="${ax.toFixed(1)}" y="${ay.toFixed(1)}" width="${aw.toFixed(1)}" height="${ah.toFixed(1)}" rx="2" class="${on ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`);
  }
  if (labels) {
    for (const name of order) {
      if (highlight.length && !highlight.includes(name)) continue;
      const [ax, ay, aw, ah] = areas[name];
      if (ah < 14 || aw < 40) continue;
      out.push(kit.text(ax + aw / 2, ay + ah / 2 + 4, names[name], { anchor: 'middle', size: 11 }));
    }
  }
  return { svg: out, areas };
}

// A key cap with its label, for diagrams that show which key to press.
export function keycap(kit, x, y, label, { size = 14 } = {}) {
  const w = Math.max(size * 2, label.length * size * 0.62 + size);
  const h = size * 2;
  return [
    `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="5" class="d-key" stroke-width="1.4"/>`,
    kit.text(x, y + size * 0.36, label, { anchor: 'middle', size, cls: 'd-key-text' }),
  ];
}

// A mouse seen from above, with one button or the wheel picked out: 'left', 'right', 'middle' (the
// wheel pressed and dragged) or 'wheel' (rolled). `label` is a short line under it.
export function mouse(kit, x, y, { button, label, size = 1 } = {}) {
  const w = 54 * size;
  const h = 84 * size;
  const top = y - h / 2;
  const split = top + h * 0.42;
  const out = [kit.path(`M ${x - w / 2} ${split} L ${x - w / 2} ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${top + w / 2} L ${x + w / 2} ${y + h / 2 - w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x - w / 2} ${y + h / 2 - w / 2} Z`, { cls: 'd-ink', width: 2 })];
  const half = (dir) => `<path d="M ${x} ${top} A ${w / 2} ${w / 2} 0 0 ${dir < 0 ? 0 : 1} ${x + (dir * w) / 2} ${top + w / 2} L ${x + (dir * w) / 2} ${split} L ${x} ${split} Z" class="d-key-mark" stroke-width="0"/>`;
  if (button === 'left') out.push(half(-1));
  if (button === 'right') out.push(half(1));
  out.push(kit.line(x - w / 2, split, x + w / 2, split, { cls: 'd-ink', width: 1.6 }), kit.line(x, top, x, split, { cls: 'd-ink', width: 1.6 }));
  const wheel = button === 'middle' || button === 'wheel';
  out.push(`<rect x="${(x - 5 * size).toFixed(1)}" y="${(top + h * 0.12).toFixed(1)}" width="${(10 * size).toFixed(1)}" height="${(h * 0.2).toFixed(1)}" rx="${(5 * size).toFixed(1)}" class="${wheel ? 'd-key-mark' : 'd-key'}" stroke-width="1.6"/>`);
  if (button === 'wheel') {
    out.push(kit.arrowhead(x, top + h * 0.07, -Math.PI / 2, { size: 6, width: 1.8 }), kit.arrowhead(x, top + h * 0.37, Math.PI / 2, { size: 6, width: 1.8 }));
  }
  if (label) out.push(kit.text(x, y + h / 2 + 18, label, { anchor: 'middle', size: 12 }));
  return out;
}

// The numeric keypad, with keys picked out by their labels ('1', '3', '7', '5', '.', '0').
export function numpad(kit, x, y, { highlight = [], size = 1, label } = {}) {
  const k = 26 * size;
  const g = 4 * size;
  const rows = [['Num', '/', '*', '-'], ['7', '8', '9', '+'], ['4', '5', '6', null], ['1', '2', '3', 'Enter'], ['0', null, '.', null]];
  const out = [];
  rows.forEach((row, r) => row.forEach((name, c) => {
    if (!name) return;
    let w = k;
    let h = k;
    if (name === '+' || name === 'Enter') h = 2 * k + g;
    if (name === '0') w = 2 * k + g;
    const kx = x + c * (k + g);
    const ky = y + r * (k + g);
    const on = highlight.includes(name);
    out.push(`<rect x="${kx.toFixed(1)}" y="${ky.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="4" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.4"/>`);
    out.push(kit.text(kx + w / 2, ky + h / 2 + 4 * size, name, { anchor: 'middle', size: (name.length > 2 ? 9 : 12) * size, cls: on ? 'd-key-text d-key-text-mark' : 'd-key-text' }));
  }));
  if (label) out.push(kit.text(x + 2 * (k + g) - g / 2, y + 5 * (k + g) + 14, label, { anchor: 'middle', size: 12 }));
  return out;
}

// Blender's navigation gizmo for a view: a circle with a ball for each axis, the positive ends
// lettered and coloured, as in the top right of the 3D Viewport.
export function navGizmo(kit, x, y, v, { radius = 34, highlight } = {}) {
  const o = v.project([0, 0, 0]);
  const balls = [['x', [1, 0, 0]], ['y', [0, 1, 0]], ['z', [0, 0, 1]], ['-x', [-1, 0, 0]], ['-y', [0, -1, 0]], ['-z', [0, 0, -1]]].map(([name, dir]) => {
    const p = v.project(dir);
    const dx = (p[0] - o[0]) / v.scale;
    const dy = (p[1] - o[1]) / v.scale;
    return { name, px: x + dx * radius * 0.8, py: y + dy * radius * 0.8, depth: dot3(dir, v.toward) };
  }).sort((a, b) => a.depth - b.depth);
  const out = [`<circle cx="${x}" cy="${y}" r="${radius}" class="d-ui" stroke-width="1"/>`];
  for (const b of balls) {
    const axis = b.name.replace('-', '');
    const positive = !b.name.startsWith('-');
    if (positive) out.push(kit.line(x, y, b.px, b.py, { cls: `d-axis-${axis}`, width: 2 }));
    const r = positive ? 8 : 6;
    const ring = highlight === b.name ? ' d-gizmo-mark' : '';
    out.push(`<circle cx="${b.px.toFixed(1)}" cy="${b.py.toFixed(1)}" r="${r}" class="d-gizmo-${axis}${positive ? '' : '-neg'}${ring}" stroke-width="1.6"/>`);
    if (positive) out.push(kit.text(b.px, b.py + 4, axis.toUpperCase(), { anchor: 'middle', size: 10, cls: 'd-gizmo-text' }));
  }
  return out;
}

// The mouse pointer, its tip at (x, y), for showing where the mouse is when a key is pressed.
export function cursor(kit, x, y, { size = 1, cls = 'd-ink' } = {}) {
  const p = [[0, 0], [0, 17], [4.5, 13], [7.5, 20], [10, 19], [7, 12], [12.5, 12]].map(([a, b]) => [x + a * size, y + b * size]);
  return `<path d="M ${p.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L ')} Z" class="d-cursor ${cls}" stroke-width="1.4" stroke-linejoin="round"/>`;
}

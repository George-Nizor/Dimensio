// Wrong: the Statistics overlay turned on in one file, but File > New > General opens without it,
// because the startup file was never saved. Right: after Save Startup File, every new file shows it.
import { cube, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

const viewport = (kit, x, stats) => [
  box(x, 16, 220, 160, { cls: 'd-ui', rx: 4 }),
  stats ? ['Objects 0 / 3', 'Vertices 8', 'Triangles 12'].map((t, i) => kit.text(x + 10, 36 + i * 15, t, { size: 10 })) : '',
  drawMesh(kit, cube(), view({ scale: 26, at: [x + 120, 112] }), { width: 1.2 }),
  kit.text(x + 110, 196, 'File > New > General', { anchor: 'middle', size: 11 }),
];

export default (kit) => kit.svg({ width: 500, height: 240 },
  viewport(kit, 16, false),
  kit.tag(126, 226, 'not saved: back to defaults', { tone: 'bad' }),
  viewport(kit, 264, true),
  kit.tag(374, 226, 'after Save Startup File'),
);

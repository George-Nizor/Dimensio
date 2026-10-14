// The 3D Viewport with the Toolbar (T) on its left edge and the Sidebar (N) on its right edge.
import { cube, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const v = view({ at: [230, 140], scale: 30 });
  const tools = [0, 1, 2, 3, 4, 5].map((i) => `<rect x="30" y="${54 + i * 26}" width="20" height="20" rx="3" class="d-key" stroke-width="1"/>`);
  return kit.svg({ width: 460, height: 250 },
    `<rect x="20" y="20" width="420" height="210" rx="4" class="d-ui" stroke-width="1"/>`,
    `<rect x="20" y="20" width="420" height="24" rx="4" class="d-sunk" stroke-width="1"/>`,
    drawMesh(kit, cube(), v, { width: 1.4 }),
    `<rect x="24" y="48" width="32" height="170" rx="4" class="d-ui-mark" stroke-width="1.4"/>`, tools,
    `<rect x="330" y="48" width="104" height="170" rx="4" class="d-ui-mark" stroke-width="1.4"/>`,
    kit.text(382, 74, 'Item', { anchor: 'middle', size: 11 }),
    [0, 1, 2, 3].map((i) => kit.line(344, 98 + i * 22, 420, 98 + i * 22, { cls: 'd-guide', width: 5 })),
    keycap(kit, 92, 200, 'T'), kit.text(110, 205, 'Toolbar', { size: 12 }),
    keycap(kit, 292, 200, 'N'), kit.text(274, 205, 'Sidebar', { anchor: 'end', size: 12 }),
  );
};

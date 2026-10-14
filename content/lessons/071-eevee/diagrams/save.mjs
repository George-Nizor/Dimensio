// F12 renders into the render window. Image > Save As (Shift+Alt+S) writes the picture to a file.
import { keycap } from '../../../diagrams/mesh.mjs';
import { smallWindow } from './stage.mjs';
import { renderedStage } from './glow.mjs';

export default (kit) => {
  const items = ['New', 'Open', 'Save', 'Save As'];
  return kit.svg({ width: 500, height: 280 },
    keycap(kit, 44, 150, 'F12'),
    kit.line(68, 150, 96, 150, { cls: 'd-mark', width: 2 }), kit.arrowhead(98, 150, 0, { size: 8 }),
    smallWindow(kit, 110, 14, 370, 252, 'Blender Render', ['View', 'Image']),
    renderedStage(kit, 120, 56, 350, { clip: 'eevee-save' }),
    `<rect x="${166}" y="${60}" width="164" height="${items.length * 24 + 10}" rx="4" class="d-paper" stroke-width="1.2"/>`,
    items.map((name, i) => [
      name === 'Save As' ? `<rect x="170" y="${65 + i * 24}" width="156" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
      kit.text(180, 80 + i * 24, name, { size: 11 }),
      name === 'Save As' ? kit.text(320, 80 + i * 24, 'Shift Alt S', { anchor: 'end', size: 10, cls: 'd-label' }) : '',
    ]),
    `<rect x="164" y="38" width="48" height="19" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(170, 51, 'Image', { size: 11 }),
  );
};

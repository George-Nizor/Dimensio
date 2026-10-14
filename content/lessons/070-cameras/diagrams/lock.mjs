// The Sidebar's View tab with Camera to View ticked under View Lock. In camera view the frame is
// outlined in red-orange dashes, and orbiting moves the camera with the view.
import { drawMesh } from '../../../diagrams/mesh.mjs';
import { props, cameraPanel, shot, propRow } from './stage.mjs';

export default (kit) => {
  const p = cameraPanel(kit, 230, 30, 250, 170, { frame: 0.8, locked: true, clip: 'cameras-lock' });
  const v = shot(p.frame, [3.4, -5.0, 1.9]);
  const tabs = ['Item', 'Tool', 'View'].map((name, i) => [
    `<rect x="${186}" y="${40 + i * 50}" width="22" height="46" rx="3" class="${name === 'View' ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`,
    `<text x="${200}" y="${63 + i * 50}" class="d-label" font-size="10" text-anchor="middle" transform="rotate(90 ${200} ${63 + i * 50})">${name}</text>`,
  ]);
  return kit.svg({ width: 500, height: 230 },
    `<rect x="16" y="30" width="170" height="160" rx="5" class="d-paper" stroke-width="1.2"/>`,
    tabs,
    kit.text(28, 52, 'View Lock', { size: 12 }),
    propRow(kit, 28, 66, 'Lock to Object', '', { width: 150, split: 0.62 }),
    propRow(kit, 28, 92, 'Lock', 'To 3D Cursor', { width: 150, split: 0.25, tick: false }),
    `<rect x="24" y="114" width="156" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    propRow(kit, 28, 117, '', 'Camera to View', { width: 150, split: 0.25, tick: true }),
    p.svg, p.inside(drawMesh(kit, props(), v, { width: 1.5 })), p.border,
    kit.arcArrow(270, 186, 440, 186, { lift: -16 }),
    kit.text(355, 222, 'orbiting moves the camera', { anchor: 'middle', size: 12 }),
  );
};

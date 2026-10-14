// The Texture Paint workspace: the Image Editor on the left in Paint mode, showing the image being
// painted, and the 3D Viewport on the right in Texture Paint mode.
import { crate, dirt, wear } from './crate.mjs';

export default (kit) => kit.svg({ width: 520, height: 260 },
  `<rect x="10" y="10" width="500" height="12" rx="2" class="d-ui" stroke-width="1"/>`,
  `<rect x="10" y="26" width="200" height="222" rx="3" class="d-ui" stroke-width="1"/>`,
  `<rect x="214" y="26" width="226" height="222" rx="3" class="d-ui-mark" stroke-width="1.2"/>`,
  `<rect x="444" y="26" width="66" height="70" rx="3" class="d-ui" stroke-width="1"/>`,
  `<rect x="444" y="100" width="66" height="148" rx="3" class="d-ui" stroke-width="1"/>`,
  kit.text(110, 46, 'Image Editor, Paint', { anchor: 'middle', size: 12 }),
  `<rect x="40" y="62" width="140" height="140" class="d-mark-fill" stroke-width="0"/>`,
  `<rect x="40" y="170" width="140" height="32" class="d-face-3" stroke-width="0" opacity="0.8" style="mix-blend-mode:multiply"/>`,
  `<rect x="40" y="62" width="140" height="140" class="d-ink" fill="none" stroke-width="1.2"/>`,
  kit.text(327, 46, '3D Viewport, Texture Paint', { anchor: 'middle', size: 12 }),
  crate(kit, { at: [327, 150], scale: 64, paint: (face) => [dirt(face), wear(face)] }),
  kit.text(477, 64, 'Outliner', { anchor: 'middle', size: 10 }),
  kit.text(477, 176, 'Properties', { anchor: 'middle', size: 10 }),
);

// Edit > Preferences > System > Cycles Render Devices: a tab for each kind of graphics card, and a
// tick beside your card.
export default (kit) => {
  const tabs = ['None', 'CUDA', 'OptiX', 'HIP', 'oneAPI'];
  return kit.svg({ width: 480, height: 200 },
    `<rect x="20" y="10" width="440" height="154" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(36, 40, 'Cycles Render Devices', { size: 12 }),
    tabs.map((name, i) => [
      `<rect x="${36 + i * 80}" y="54" width="76" height="24" rx="3" class="${name === 'OptiX' ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
      kit.text(74 + i * 80, 70, name, { anchor: 'middle', size: 11, cls: name === 'OptiX' ? 'd-key-text d-key-text-mark' : 'd-key-text' }),
    ]),
    `<rect x="36" y="94" width="396" height="26" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    `<rect x="46" y="100" width="14" height="14" rx="3" class="d-paper" stroke-width="1.2"/>`,
    kit.path('M 49 107 L 52 110 L 57 103', { cls: 'd-ink', width: 2 }),
    kit.text(70, 112, 'your graphics card', { size: 11 }),
    `<rect x="46" y="134" width="14" height="14" rx="3" class="d-paper" stroke-width="1.2"/>`,
    kit.text(70, 146, 'CPU', { size: 11 }),
    kit.text(240, 188, 'NVIDIA: OptiX or CUDA.  AMD: HIP.  Intel: oneAPI.', { anchor: 'middle', size: 11, cls: 'd-label' }),
  );
};

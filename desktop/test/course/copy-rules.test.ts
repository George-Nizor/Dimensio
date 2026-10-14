import { describe, expect, it } from 'vitest';
// @ts-expect-error The copy rules are a plain script module shared with the content build.
import { isKeys, lintProse } from '../../scripts/copy-rules.mjs';

describe('copy rules', () => {
  it('block the banned patterns', () => {
    const rules = (text: string) => lintProse(text).filter((f: { level: string }) => f.level === 'error').map((f: { rule: string }) => f.rule);
    expect(rules('Just press G.')).toEqual(['filler']);
    expect(rules('Press G \u2014 then move.')).toEqual(['dash']);
    expect(rules('Great job!')).toEqual(['exclamation', 'praise']);
    expect(rules('Master Blender in a week.')).toEqual(['puffed-up word']);
    expect(rules('Press `Tab` to enter Edit Mode.')).toEqual([]);
  });

  it('know a key from anything else in backticks', () => {
    for (const keys of ['Tab', 'G', 'Ctrl+R', 'Shift+A', 'Numpad 7', 'Numpad Period', 'Ctrl+Numpad 1', 'Home', '90', 'Shift']) expect(isKeys(keys)).toBe(true);
    for (const text of ['bpy.ops.mesh', 'Add > Mesh > Cube', 'Subdivision Surface']) expect(isKeys(text)).toBe(false);
  });
});

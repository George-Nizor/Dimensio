import { describe, expect, it } from 'vitest';
import { olderBlender } from '../../src/course/content/types';
import { evaluate, evaluateAll, type MeasureReport, type ReportObject } from '../../src/course/engine/measure';

const part = (name: string, fields: Partial<ReportObject> = {}): ReportObject => ({
  name, type: 'MESH', verts: 8, edges: 12, faces: 6, tris: 12, quads: 6, ngons: 0, nonManifoldEdges: 0,
  looseVerts: 0, looseEdges: 0, doubles: 0, flippedFaces: 0, scaleApplied: true, rotationApplied: true,
  materials: 1, uvLayers: 1, shading: 'flat', ...fields,
});

const report = (objects: ReportObject[], totals?: MeasureReport['totals']): MeasureReport => ({ format: 1, objects, totals });

describe('measurements as plain facts', () => {
  it('counts problems as "found"', () => {
    const r = report([part('Seat', { ngons: 2 }), part('Leg', { ngons: 1 })]);
    expect(evaluate(r, { metric: 'ngons', max: 0, label: 'No n-gons' })).toEqual({ label: 'No n-gons', fact: 'No n-gons (3 found)', held: false });
    expect(evaluate(report([part('Seat')]), { metric: 'ngons', max: 0, label: 'No n-gons' })).toEqual({ label: 'No n-gons', fact: 'No n-gons (0 found)', held: true });
  });

  it('prefers the totals the report gives', () => {
    const r = report([part('Seat')], { tris: 212, objects: 3, meshes: 1 });
    expect(evaluate(r, { metric: 'tris', max: 300, label: 'Under 300 triangles' }).fact).toBe('Under 300 triangles (212 triangles)');
    expect(evaluate(r, { metric: 'objects', equals: 3, label: 'Three objects' }).held).toBe(true);
  });

  it('counts sizes with the right noun', () => {
    const r = report([part('Seat'), part('Leg 1'), part('Leg 2'), part('Leg 3'), part('Leg 4')]);
    expect(evaluate(r, { metric: 'meshes', min: 5, label: 'A seat and four legs' })).toEqual({ label: 'A seat and four legs', fact: 'A seat and four legs (5 meshes)', held: true });
    expect(evaluate(report([part('Seat')]), { metric: 'verts', max: 8, label: 'Eight corners' }).fact).toBe('Eight corners (8 vertices)');
    expect(evaluate(report([part('Seat', { tris: 1 })]), { metric: 'tris', max: 8, label: 'Tiny' }).fact).toBe('Tiny (1 triangle)');
  });

  it('names the objects a flag does not hold on', () => {
    const r = report([part('Seat', { scaleApplied: false }), part('Leg 1'), part('Leg 2', { scaleApplied: false })]);
    expect(evaluate(r, { metric: 'scaleApplied', equals: true, label: 'Scale applied' })).toEqual({ label: 'Scale applied', fact: 'Scale applied (not on Seat and Leg 2)', held: false });
    expect(evaluate(report([part('Seat')]), { metric: 'scaleApplied', equals: true, label: 'Scale applied' }).fact).toBe('Scale applied (every object)');
    const many = report(['A', 'B', 'C', 'D', 'E'].map((name) => part(name, { rotationApplied: false })));
    expect(evaluate(many, { metric: 'rotationApplied', equals: true, label: 'No rotation' }).fact).toBe('No rotation (not on A, B and 3 more)');
  });

  it('reports shading and per-object counts', () => {
    const r = report([part('Seat', { shading: 'smooth' }), part('Leg')]);
    expect(evaluate(r, { metric: 'shading', equals: 'flat', label: 'Flat shading' }).fact).toBe('Flat shading (smooth on Seat)');
    const bare = report([part('Seat'), part('Leg', { materials: 0 })]);
    expect(evaluate(bare, { metric: 'materials', min: 1, label: 'Every part has a material' })).toEqual({ label: 'Every part has a material', fact: 'Every part has a material (0 materials on Leg)', held: false });
  });

  it('ignores objects that are not meshes and never shows a figure for the outline', () => {
    const r: MeasureReport = { ...report([part('Seat'), { name: 'Camera', type: 'CAMERA' }]), silhouette: { front: { match: 0.91, overlay: 'front-overlay.png' } } };
    const facts = evaluateAll(r, [{ metric: 'meshes', min: 1, label: 'At least one mesh' }, { metric: 'scaleApplied', equals: true, label: 'Scale applied' }]);
    expect(facts.map((f) => f.held)).toEqual([true, true]);
    expect(facts.map((f) => f.fact).join(' ')).not.toMatch(/0\.91|91|%/);
  });

  it('leaves out objects the check excluded, such as a Boolean cutter drawn as wire', () => {
    const r = report([part('Seat', { ngons: 1 }), { name: 'Cutter', type: 'MESH', excluded: 'wire' }, { name: 'Broken', type: 'MESH', error: 'odd mesh' }]);
    expect(evaluate(r, { metric: 'meshes', equals: 1, label: 'One part' }).held).toBe(true);
    expect(evaluate(r, { metric: 'scaleApplied', equals: true, label: 'Scale applied' }).fact).toBe('Scale applied (every object)');
    expect(evaluate(r, { metric: 'ngons', max: 0, label: 'No n-gons' }).fact).toBe('No n-gons (1 found)');
  });

  it('counts after modifiers, and before them with base.', () => {
    const r = report([part('Seat', { tris: 96, base: { tris: 12, ngons: 2 } }), part('Leg')], { tris: 108, ngons: 0, base: { tris: 24, ngons: 2 } });
    expect(evaluate(r, { metric: 'tris', max: 100, label: 'Under 100 triangles' }).fact).toBe('Under 100 triangles (108 triangles)');
    expect(evaluate(r, { metric: 'base.tris', max: 100, label: 'Under 100 before modifiers' }).fact).toBe('Under 100 before modifiers (24 triangles)');
    expect(evaluate(r, { metric: 'base.ngons', max: 0, label: 'No n-gons before modifiers' })).toMatchObject({ fact: 'No n-gons before modifiers (2 found)', held: false });
    const noTotals = report([part('Seat', { ngons: 0, base: { ngons: 3 } }), part('Leg')]);
    expect(evaluate(noTotals, { metric: 'base.ngons', max: 0, label: 'No n-gons' }).fact).toBe('No n-gons (3 found)');
  });

  it('shows nothing before a model is measured', () => {
    expect(evaluateAll(null, [{ metric: 'ngons', max: 0, label: 'No n-gons' }])).toEqual([]);
  });
});

describe('resource lines', () => {
  it('name the Blender version only when it is older than 5.0', () => {
    expect(olderBlender({ blender: '4.0' })).toBe('Blender 4.0');
    expect(olderBlender({ blender: '3.6' })).toBe('Blender 3.6');
    expect(olderBlender({ blender: '5.0' })).toBe('');
    expect(olderBlender({ blender: null })).toBe('');
  });
});

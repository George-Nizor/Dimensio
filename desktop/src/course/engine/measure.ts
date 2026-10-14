// What a practice item's measurements say about a learner's model, as plain facts: "No n-gons
// (0 found)", "Under 300 triangles (212 triangles)". Pure functions over the report that
// blender/dimensio_check.py writes (docs/course/PLAN.md, "Measurement"). A fact either holds or
// does not hold yet. There is no score, grade or percentage, and the silhouette match figure is
// never shown.
//
// Counts are of the model as it renders, after modifiers; "base.ngons" counts before them. Objects
// the check marks `excluded` (hidden, or drawn as wire like a Boolean cutter) are not the model and
// never count.
import type { CountMetric, Measure, MetricName, View } from '../content/types';
import METRICS from './metrics.json';

type Counts = Partial<Record<CountMetric, number>>;

export interface ReportObject extends Counts {
  name: string;
  type: string;
  excluded?: string;
  error?: string;
  // The counts before modifiers, when the object has any.
  base?: Counts;
  scaleApplied?: boolean;
  rotationApplied?: boolean;
  dimensions?: number[];
  modifiers?: string[];
  materials?: number;
  uvLayers?: number;
  shading?: string;
}

export interface MeasureReport {
  format: number;
  blender?: string;
  file?: string;
  units?: { system: string; scaleLength: number };
  objects: ReportObject[];
  totals?: Counts & { objects?: number; meshes?: number; base?: Counts };
  renders?: Partial<Record<View, string>>;
  silhouette?: Partial<Record<View, { match?: number; overlay?: string }>>;
  // Sentences from the check about the file, such as "Nothing was rendered: the scene has no
  // visible solid geometry."
  warnings?: string[];
}

interface MetricDefinition {
  from: 'totals' | 'sum' | 'fewest' | 'every';
  kind: 'size' | 'problem' | 'flag' | 'text';
  one?: string;
  many?: string;
  values?: string[];
}

const DEFINITIONS = METRICS as Record<string, MetricDefinition>;

export interface MeasureResult {
  label: string;
  // The plain fact shown to the learner: the label and what was found.
  fact: string;
  held: boolean;
}

// The meshes that make up the model.
const meshes = (report: MeasureReport) => report.objects.filter((object) => object.type === 'MESH' && !object.excluded && !object.error);

const count = (n: number, definition: MetricDefinition) => `${n} ${n === 1 ? definition.one : definition.many}`;

// Names for "not on Seat, Leg front left and 2 more".
function names(list: string[]): string {
  if (list.length <= 3) return list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list.at(-1)}` : list[0] ?? '';
  return `${list.slice(0, 2).join(', ')} and ${list.length - 2} more`;
}

function compare(value: number, measure: Measure): boolean {
  if (measure.max !== undefined) return value <= measure.max;
  if (measure.min !== undefined) return value >= measure.min;
  return value === measure.equals;
}

export function evaluate(report: MeasureReport, measure: Measure): MeasureResult {
  const before = measure.metric.startsWith('base.');
  const name = (before ? measure.metric.slice(5) : measure.metric) as Exclude<MetricName, `base.${string}`>;
  const definition = DEFINITIONS[name];
  const parts = meshes(report);
  const { label } = measure;
  if (!definition || (before && definition.from !== 'sum')) return { label, fact: `${label} (not measured)`, held: false };

  if (definition.from === 'every') {
    const wanted = measure.equals;
    const value = (object: ReportObject) => object[name as 'scaleApplied' | 'rotationApplied' | 'shading'];
    const off = parts.filter((object) => value(object) !== wanted).map((object) => object.name);
    if (!parts.length) return { label, fact: `${label} (no mesh objects found)`, held: false };
    if (!off.length) return { label, fact: `${label} (every object)`, held: true };
    if (definition.kind === 'text') {
      const values = [...new Set(parts.map((object) => String(value(object) ?? 'unknown')))].filter((v) => v !== wanted);
      return { label, fact: `${label} (${values.join(' and ')} on ${names(off)})`, held: false };
    }
    return { label, fact: `${label} (not on ${names(off)})`, held: false };
  }

  if (definition.from === 'fewest') {
    if (!parts.length) return { label, fact: `${label} (no mesh objects found)`, held: false };
    const key = name as 'materials' | 'uvLayers';
    const fewest = Math.min(...parts.map((object) => object[key] ?? 0));
    const held = compare(fewest, measure);
    if (held) return { label, fact: `${label} (every object)`, held };
    const short = parts.filter((object) => !compare(object[key] ?? 0, measure)).map((object) => object.name);
    return { label, fact: `${label} (${count(fewest, definition)} on ${names(short)})`, held };
  }

  let value: number;
  if (name === 'objects' || name === 'meshes') {
    const total = report.totals?.[name];
    value = typeof total === 'number' ? total : name === 'objects' ? report.objects.length : parts.length;
  } else {
    const key = name as CountMetric;
    const total = before ? report.totals?.base?.[key] : report.totals?.[key];
    value = typeof total === 'number' ? total : parts.reduce((sum, object) => sum + ((before ? object.base?.[key] ?? object[key] : object[key]) ?? 0), 0);
  }
  const held = compare(value, measure);
  const fact = definition.kind === 'problem' ? `${label} (${value} found)` : `${label} (${count(value, definition)})`;
  return { label, fact, held };
}

export function evaluateAll(report: MeasureReport | null | undefined, measures: readonly Measure[]): MeasureResult[] {
  return report ? measures.map((measure) => evaluate(report, measure)) : [];
}

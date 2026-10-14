// The shape of public/content.json, written by scripts/build-content.mjs.

export type InlineNode =
  | { t: 'text'; v: string }
  | { t: 'code'; v: string }
  | { t: 'strong'; c: InlineNode[] }
  | { t: 'em'; c: InlineNode[] }
  | { t: 'link'; href: string; c: InlineNode[] };

export type Inline = InlineNode[];

export interface LessonEntry {
  slug: string;
  number: number;
  part: number;
  title: string;
  summary: string;
  written: boolean;
}

export interface Part {
  number: number;
  title: string;
  lessons: LessonEntry[];
}

export interface Step {
  title: string;
  text: Inline;
  diagram: string | null;
}

export interface Lesson {
  slug: string;
  number: number;
  part: number;
  title: string;
  summary: string;
  intro: Inline[];
  needs: string[];
  example: string | null;
  steps: Step[];
  howNotes: Inline[];
  mistake: { diagram: string | null; text: Inline[] } | null;
  checkIntro: Inline[];
  checks: Inline[];
  checkNotes: Inline[];
  watch: string[];
  exercise: string;
  practice: string[];
  prose: number;
}

export type PracticeKind = 'drill' | 'warm-up' | 'timed' | 'copy' | 'fix' | 'project' | 'imagination' | 'retest';

export interface Round {
  label: string;
  seconds: number;
}

export interface ReferenceImage {
  src: string;
  credit: string;
  alt: string;
}

export type View = 'persp' | 'front' | 'right' | 'top';

export const VIEWS: readonly View[] = ['persp', 'front', 'right', 'top'];

export const VIEW_LABEL: Record<View, string> = { persp: 'Perspective', front: 'Front', right: 'Right', top: 'Top' };

// An example model: a .blend in public/reference/ and its renders, made by our own scripts from a
// CC0 or public-domain model.
export interface ReferenceModel {
  id: string;
  title: string;
  // App-relative path of the .blend, such as "reference/models/stool/stool.blend".
  file: string;
  renders: Partial<Record<View, string>>;
  credit: string;
  alt: string;
  licence: string;
  source: string | null;
}

export type Reference =
  | { type: 'none' }
  | { type: 'diagram'; diagram: string }
  | { type: 'prompt'; prompt: string }
  | { type: 'images'; images: ReferenceImage[]; prompt: string }
  | { type: 'model'; model: string; prompt: string };

// Counts of the model as it renders, after modifiers. "base.ngons" is the same count before them.
export type CountMetric = 'verts' | 'edges' | 'faces' | 'tris' | 'quads' | 'ngons' | 'nonManifoldEdges' | 'looseVerts' | 'looseEdges' | 'doubles' | 'flippedFaces';

export type MetricName =
  | CountMetric | `base.${CountMetric}` | 'objects' | 'meshes'
  | 'materials' | 'uvLayers' | 'scaleApplied' | 'rotationApplied' | 'shading';

// One measurement to run on a learner's model after they tick their own checks.
export interface Measure {
  metric: MetricName;
  max?: number;
  min?: number;
  equals?: number | boolean | string;
  label: string;
}

export interface PracticeItem {
  id: string;
  lesson: string;
  main: boolean;
  title: string;
  kind: PracticeKind;
  minutes: number;
  text: Inline[];
  steps: string[];
  rounds: Round[];
  reference: Reference;
  // A script in blender/starters/ that builds the exercise's starting file, with its options.
  // Option values starting "reference/" are files in public/reference/.
  starter: { id: string; options: Record<string, string | number | boolean> } | null;
  measure: Measure[];
  check: Inline[];
}

export interface Resource {
  id: string;
  title: string;
  teacher: string;
  url: string;
  kind: string;
  minutes: number | null;
  youtube: string | null;
  cost: 'free' | 'paid';
  checked: string;
  // The Blender version the resource was made with, such as "4.0".
  blender: string | null;
}

export interface Diagram {
  id: string;
  svg: string;
  alt: string;
}

export interface Prompts {
  subjects: string[];
  twists: string[];
  limits: string[];
}

export interface Content {
  format: 1;
  parts: Part[];
  lessons: Record<string, Lesson>;
  practice: Record<string, PracticeItem>;
  resources: Record<string, Resource>;
  references: Record<string, ReferenceModel>;
  diagrams: Record<string, Diagram>;
  prompts: Prompts;
}

export const KIND_LABEL: Record<PracticeKind, string> = {
  drill: 'Drill',
  'warm-up': 'Warm-up',
  timed: 'Timed',
  copy: 'Copy',
  fix: 'Fix',
  project: 'Project',
  imagination: 'Imagination',
  retest: 'Retest',
};

// "Blender 4.0" on a resource line, only when the resource was made with a version older than 5.0.
export function olderBlender(resource: Pick<Resource, 'blender'>): string {
  const major = Number(resource.blender?.split('.')[0]);
  return resource.blender && Number.isFinite(major) && major < 5 ? `Blender ${resource.blender}` : '';
}

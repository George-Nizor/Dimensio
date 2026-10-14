// Everything the course app stores, in this window's IndexedDB on this computer. Nothing is sent
// anywhere. An attempt is Dimensio's version of Delineare's photographed page: the renders of the
// learner's .blend as images, the measurement report, the checks that held and the file's path.
import Dexie, { type Table } from 'dexie';
import type { View } from '../content/types';
import type { MeasureReport } from '../engine/measure';
import type { LessonRecord, LogEntry } from '../engine/review';

export interface Attempt {
  id?: number;
  createdAt: number;
  lesson: string;
  practiceId: string;
  // The .blend the learner added, as a path on this computer.
  file: string | null;
  renders: Partial<Record<View, Blob>>;
  // The example's outline over the learner's, for exercises with an example model.
  overlays: Partial<Record<View, Blob>>;
  report: MeasureReport | null;
  // Indexes of the checks that held when the attempt was saved.
  checksHeld: number[];
  checkCount: number;
}

export type Theme = 'system' | 'light' | 'dark';

export interface Settings {
  theme: Theme;
  // Whether lesson steps start folded away, for learners who only want the goal and the check.
  foldSteps: boolean;
  // Whether the course page shows "I already know this" on every lesson.
  knowsBlender: boolean;
  sound: boolean;
  // Set once the learner has picked a way in from the welcome page.
  welcomed: boolean;
  // Cuts transitions and the opening animation down to a fade, whatever the computer's setting.
  reduceMotion: boolean;
}

export const DEFAULT_SETTINGS: Settings = { theme: 'system', foldSteps: false, knowsBlender: false, sound: true, welcomed: false, reduceMotion: false };

class DimensioDB extends Dexie {
  attempts!: Table<Attempt, number>;
  log!: Table<LogEntry, number>;
  lessons!: Table<LessonRecord, string>;
  settings!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('dimensio-1');
    this.version(1).stores({
      attempts: '++id, createdAt, lesson, practiceId',
      log: '++id, practiceId, lesson, at',
      lessons: 'slug',
      settings: 'key',
    });
  }
}

export const db = new DimensioDB();

export async function readSettings(): Promise<Settings> {
  const rows = await db.settings.toArray();
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return { ...DEFAULT_SETTINGS, ...stored } as Settings;
}

export async function saveSetting<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
  await db.settings.put({ key, value });
}

// Records a finished exercise: the log entry, the attempt if there is one, and the lesson's state.
// The main exercise with every check held marks the lesson done. Measurements never decide that.
export async function recordExercise(input: {
  practiceId: string;
  lesson: string;
  main: boolean;
  attempt?: Omit<Attempt, 'id' | 'createdAt' | 'lesson' | 'practiceId'>;
  allChecksHeld: boolean;
  now?: number;
}): Promise<number | undefined> {
  const now = input.now ?? Date.now();
  return db.transaction('rw', db.attempts, db.log, db.lessons, async () => {
    const attemptId = input.attempt ? await db.attempts.add({ ...input.attempt, createdAt: now, lesson: input.lesson, practiceId: input.practiceId }) : undefined;
    await db.log.add({ practiceId: input.practiceId, lesson: input.lesson, at: now, attemptId });
    if (input.main) {
      const existing = await db.lessons.get(input.lesson);
      const record: LessonRecord = existing ?? { slug: input.lesson, state: 'tried', known: false, triedAt: now };
      if (input.allChecksHeld && record.state !== 'done') {
        record.state = 'done';
        record.doneAt = now;
      }
      await db.lessons.put(record);
    }
    return attemptId;
  });
}

export async function setKnown(slug: string, known: boolean): Promise<void> {
  const now = Date.now();
  const existing = await db.lessons.get(slug);
  // Taking "I already know this" back on a lesson that was never practised leaves no record behind.
  if (!known && existing && existing.state === 'tried' && !(await db.log.where('lesson').equals(slug).count())) {
    await db.lessons.delete(slug);
    return;
  }
  const record: LessonRecord = existing ?? { slug, state: 'tried', known: false, triedAt: now };
  record.known = known;
  record.knownAt = known ? now : undefined;
  await db.lessons.put(record);
}

export async function deleteEverything(): Promise<void> {
  await db.transaction('rw', db.attempts, db.log, db.lessons, db.settings, async () => {
    await Promise.all([db.attempts.clear(), db.log.clear(), db.lessons.clear(), db.settings.clear()]);
  });
}

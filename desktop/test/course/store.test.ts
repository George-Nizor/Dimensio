import { beforeEach, describe, expect, it } from 'vitest';
import { db, deleteEverything, readSettings, recordExercise, setKnown } from '../../src/course/store/db';

const attempt = { file: 'C:/Users/you/Documents/Dimensio/Course/stool.blend', renders: {}, overlays: {}, report: null, checksHeld: [0, 1], checkCount: 2 };

describe('the course store', () => {
  beforeEach(async () => { await deleteEverything(); });

  it('uses its own database', () => {
    expect(db.name).toBe('dimensio-1');
  });

  it('marks a lesson done when every check of its main exercise held', async () => {
    await recordExercise({ practiceId: 'cube-stool', lesson: 'move-rotate-scale', main: true, allChecksHeld: false, attempt, now: 1 });
    expect((await db.lessons.get('move-rotate-scale'))?.state).toBe('tried');
    const id = await recordExercise({ practiceId: 'cube-stool', lesson: 'move-rotate-scale', main: true, allChecksHeld: true, attempt, now: 2 });
    expect((await db.lessons.get('move-rotate-scale'))).toMatchObject({ state: 'done', doneAt: 2 });
    expect((await db.attempts.get(id!))?.file).toBe(attempt.file);
    expect(await db.log.count()).toBe(2);
  });

  it('leaves the lesson alone for practice items and saves without a model', async () => {
    const id = await recordExercise({ practiceId: 'crooked-table', lesson: 'move-rotate-scale', main: false, allChecksHeld: true });
    expect(id).toBeUndefined();
    expect(await db.lessons.count()).toBe(0);
    expect(await db.log.count()).toBe(1);
  });

  it('takes back "I already know this" without leaving a record', async () => {
    await setKnown('viewport-navigation', true);
    expect((await db.lessons.get('viewport-navigation'))?.known).toBe(true);
    await setKnown('viewport-navigation', false);
    expect(await db.lessons.get('viewport-navigation')).toBeUndefined();
  });

  it('starts with the default settings', async () => {
    expect(await readSettings()).toMatchObject({ theme: 'system', knowsBlender: false, welcomed: false });
  });
});

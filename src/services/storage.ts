import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { StudyAnswer, CategoryId } from '@/types/question';
import type { QuizSession } from '@/types/quiz';
import type { GamificationState } from '@/types/gamification';

interface KorkortDBSchema extends DBSchema {
  studyAnswers: {
    key: number;
    value: StudyAnswer;
    indexes: {
      byQuestionId: string;
      byCategory: CategoryId;
      byAnsweredAt: string;
    };
  };
  quizSessions: {
    key: string;
    value: QuizSession;
    indexes: {
      byStatus: string;
      byStartedAt: string;
    };
  };
  bookmarks: {
    key: string;
    value: { questionId: string; createdAt: string };
    indexes: {
      byCreatedAt: string;
    };
  };
  gamification: {
    key: string;
    value: GamificationState;
  };
}

const DB_NAME = 'korkort-app';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<KorkortDBSchema> | null = null;

async function getDb(): Promise<IDBPDatabase<KorkortDBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<KorkortDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const studyStore = db.createObjectStore('studyAnswers', { autoIncrement: true });
      studyStore.createIndex('byQuestionId', 'questionId');
      studyStore.createIndex('byCategory', 'category');
      studyStore.createIndex('byAnsweredAt', 'answeredAt');

      const quizStore = db.createObjectStore('quizSessions', { keyPath: 'id' });
      quizStore.createIndex('byStatus', 'status');
      quizStore.createIndex('byStartedAt', 'startedAt');

      const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'questionId' });
      bookmarkStore.createIndex('byCreatedAt', 'createdAt');

      db.createObjectStore('gamification');
    },
  });

  return dbInstance;
}

export const storage = {
  // Study Answers
  async addStudyAnswer(answer: StudyAnswer): Promise<void> {
    const db = await getDb();
    await db.add('studyAnswers', answer);
  },

  async getStudyAnswers(filter?: { category?: CategoryId; since?: string }): Promise<StudyAnswer[]> {
    const db = await getDb();
    let answers = await db.getAll('studyAnswers');
    if (filter?.category) {
      answers = answers.filter((a) => a.category === filter.category);
    }
    if (filter?.since) {
      answers = answers.filter((a) => a.answeredAt >= filter.since!);
    }
    return answers;
  },

  // Quiz Sessions
  async saveQuizSession(session: QuizSession): Promise<void> {
    const db = await getDb();
    await db.put('quizSessions', session);
  },

  async getQuizSession(id: string): Promise<QuizSession | null> {
    const db = await getDb();
    return (await db.get('quizSessions', id)) ?? null;
  },

  async getQuizSessions(filter?: { status?: QuizSession['status'] }): Promise<QuizSession[]> {
    const db = await getDb();
    if (filter?.status) {
      return db.getAllFromIndex('quizSessions', 'byStatus', filter.status);
    }
    return db.getAll('quizSessions');
  },

  // Bookmarks
  async addBookmark(questionId: string): Promise<void> {
    const db = await getDb();
    await db.put('bookmarks', { questionId, createdAt: new Date().toISOString() });
  },

  async removeBookmark(questionId: string): Promise<void> {
    const db = await getDb();
    await db.delete('bookmarks', questionId);
  },

  async getBookmarks(): Promise<{ questionId: string; createdAt: string }[]> {
    const db = await getDb();
    return db.getAll('bookmarks');
  },

  async isBookmarked(questionId: string): Promise<boolean> {
    const db = await getDb();
    const item = await db.get('bookmarks', questionId);
    return item !== undefined;
  },

  // Gamification
  async getGamificationState(): Promise<GamificationState | null> {
    const db = await getDb();
    return (await db.get('gamification', 'singleton')) ?? null;
  },

  async saveGamificationState(state: GamificationState): Promise<void> {
    const db = await getDb();
    await db.put('gamification', state, 'singleton');
  },
};

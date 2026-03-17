import type { Question, CategoryId } from '@/types/question';

const cache = new Map<CategoryId, Question[]>();

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadCategory(categoryId: CategoryId): Promise<Question[]> {
  if (cache.has(categoryId)) {
    return cache.get(categoryId)!;
  }

  const modules = {
    trafikregler: () => import('@/data/questions/trafikregler.json'),
    trafiksakerhet: () => import('@/data/questions/trafiksakerhet.json'),
    fordonskannedom: () => import('@/data/questions/fordonskannedom.json'),
    miljo: () => import('@/data/questions/miljo.json'),
    personliga: () => import('@/data/questions/personliga.json'),
  } as unknown as Record<CategoryId, () => Promise<{ default: Question[] }>>;

  const module = await modules[categoryId]();
  const questions = shuffleArray(module.default);
  cache.set(categoryId, questions);
  return questions;
}

export const questionBank = {
  async getByCategory(categoryId: CategoryId): Promise<Question[]> {
    return loadCategory(categoryId);
  },

  async getAll(): Promise<Question[]> {
    const categories: CategoryId[] = [
      'trafikregler',
      'trafiksakerhet',
      'fordonskannedom',
      'miljo',
      'personliga',
    ];
    const results = await Promise.all(categories.map(loadCategory));
    return results.flat();
  },

  async getById(questionId: string): Promise<Question | undefined> {
    const all = await questionBank.getAll();
    return all.find((q) => q.id === questionId);
  },

  async getByIds(questionIds: string[]): Promise<Question[]> {
    const all = await questionBank.getAll();
    const idSet = new Set(questionIds);
    return all.filter((q) => idSet.has(q.id));
  },

  clearCache(): void {
    cache.clear();
  },
};

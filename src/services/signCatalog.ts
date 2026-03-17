import type { RoadSign, SignCategoryId } from '@/types/sign';
import { SIGN_CATEGORY_LABELS } from '@/types/sign';

export type { RoadSign, SignCategoryId };

let signsCache: RoadSign[] | null = null;

async function loadSigns(): Promise<RoadSign[]> {
  if (signsCache) return signsCache;
  const mod = await import('@/data/signs/signs.json');
  signsCache = mod.default as RoadSign[];
  return signsCache;
}

export const signCatalog = {
  async getCategories(): Promise<{ id: SignCategoryId; label: string; count: number }[]> {
    const signs = await loadSigns();
    const countMap = new Map<string, number>();
    for (const sign of signs) {
      countMap.set(sign.signCategory, (countMap.get(sign.signCategory) ?? 0) + 1);
    }

    return (Object.keys(SIGN_CATEGORY_LABELS) as SignCategoryId[]).map((id) => ({
      id,
      label: SIGN_CATEGORY_LABELS[id],
      count: countMap.get(id) ?? 0,
    }));
  },

  async getByCategory(categoryId: SignCategoryId): Promise<RoadSign[]> {
    const signs = await loadSigns();
    return signs.filter((s) => s.signCategory === categoryId);
  },

  async getById(id: string): Promise<RoadSign | undefined> {
    const signs = await loadSigns();
    return signs.find((s) => s.id === id);
  },

  getSignImageUrl(id: string): string {
    return new URL(`../data/signs/svg/${id}.svg`, import.meta.url).href;
  },
};

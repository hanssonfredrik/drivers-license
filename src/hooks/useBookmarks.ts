import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/services/storage';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.getBookmarks().then((bms) => {
      setBookmarkedIds(new Set(bms.map((b) => b.questionId)));
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const isBookmarked = useCallback(
    (questionId: string) => bookmarkedIds.has(questionId),
    [bookmarkedIds],
  );

  const toggle = useCallback(async (questionId: string) => {
    if (bookmarkedIds.has(questionId)) {
      await storage.removeBookmark(questionId);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    } else {
      await storage.addBookmark(questionId);
      setBookmarkedIds((prev) => new Set([...prev, questionId]));
    }
  }, [bookmarkedIds]);

  return { isBookmarked, toggle, bookmarkedIds, loaded };
}

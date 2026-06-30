import db from "@/db/client";

export const recordSearch = async (term: string): Promise<void> => {
  // re-searching an existing term bumps it to the top
  await db.runAsync(
    `INSERT OR REPLACE INTO recent_searches (term, searched_at)
     VALUES (?, strftime('%s', 'now'))`,
    [term]
  );
};

export const getRecentSearches = async (limit = 8): Promise<string[]> => {
  const rows = await db.getAllAsync<{ term: string }>(
    `SELECT term FROM recent_searches ORDER BY searched_at DESC LIMIT ?`,
    [limit]
  );
  return rows.map((r) => r.term);
};

export const clearRecentSearches = async (): Promise<void> => {
  await db.runAsync(`DELETE FROM recent_searches`);
};

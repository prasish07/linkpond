import db from "@/db/client";
import { Tag } from "../types";

export const getAllTags = async (): Promise<Tag[]> => {
  return db.getAllAsync<Tag>("SELECT * FROM tags ORDER BY name ASC");
};

export const insertTag = async (tag: Tag): Promise<void> => {
  await db.runAsync(
    `INSERT INTO tags (id, name, color) VALUES (?, ?, ?)`,
    [tag.id, tag.name, tag.color]
  );
};

export const deleteTag = async (id: string): Promise<void> => {
  await db.runAsync("DELETE FROM tags WHERE id = ?", [id]);
};

export const getTagsForLink = async (linkId: string): Promise<Tag[]> => {
  return db.getAllAsync<Tag>(
    `SELECT t.* FROM tags t
     JOIN link_tags lt ON lt.tag_id = t.id
     WHERE lt.link_id = ?
     ORDER BY t.name ASC`,
    [linkId]
  );
};

export const getAllLinkTagsMap = async (): Promise<Record<string, Tag[]>> => {
  const rows = await db.getAllAsync<{ link_id: string; id: string; name: string; color: string }>(
    `SELECT lt.link_id, t.id, t.name, t.color
     FROM link_tags lt
     JOIN tags t ON t.id = lt.tag_id`
  );
  const map: Record<string, Tag[]> = {};
  for (const row of rows) {
    if (!map[row.link_id]) map[row.link_id] = [];
    map[row.link_id].push({ id: row.id, name: row.name, color: row.color });
  }
  return map;
};

export const setTagsForLink = async (
  linkId: string,
  tagIds: string[]
): Promise<void> => {
  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM link_tags WHERE link_id = ?`, [linkId]);
    for (const tagId of tagIds) {
      await db.runAsync(
        `INSERT INTO link_tags (link_id, tag_id) VALUES (?, ?)`,
        [linkId, tagId]
      );
    }
  });
};

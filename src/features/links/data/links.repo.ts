import db from "@/db/client";
import { Link } from "../types";
import { LinkPreview } from "@/lib/fetchPreview";

export const getAllLinks = async (
  groupId?: string,
  search?: string
): Promise<Link[]> => {
  const conditions: string[] = ["is_archived = 0"];
  const params: (string | number)[] = [];

  if (groupId) {
    conditions.push("group_id = ?");
    params.push(groupId);
  }

  if (search) {
    const like = `%${search}%`;
    conditions.push(`(title LIKE ? OR note LIKE ? OR url like ?)`);
    params.push(like, like, like);
  }

  const where = conditions.join(" AND ");

  return db.getAllAsync<Link>(
    `SELECT * FROM links where ${where} ORDER BY created_at DESC`,
    params
  );
};

export const getLinkByUrl = async (url: string): Promise<Link | null> => {
  const result = await db.getFirstAsync<Link>(
    `SELECT * FROM links WHERE url = ? AND is_archived = 0`,
    [url]
  );

  return result ?? null;
};

export const getLinkCountsByGroup = async (): Promise<
  { group_id: string; count: number }[]
> => {
  return db.getAllAsync<{ group_id: string; count: number }>(
    `SELECT group_id, COUNT(*) as count FROM links WHERE group_id IS NOT NULL AND is_archived = 0 GROUP BY group_id`
  );
};

export const insertLink = async (
  link: Omit<Link, "created_at" | "updated_at" | "is_archived">
): Promise<void> => {
  await db.runAsync(
    `INSERT INTO links (id, url, title, description, thumbnail_url, site_name, favicon_url, note, group_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      link.id,
      link.url,
      link.title ?? null,
      link.description ?? null,
      link.thumbnail_url ?? null,
      link.site_name ?? null,
      link.favicon_url ?? null,
      link.note ?? null,
      link.group_id ?? null,
    ]
  );
};

export const getLinkById = async (id: string): Promise<Link | null> => {
  const results = await db.getFirstAsync<Link>(
    "SELECT * FROM links WHERE id = ?",
    [id]
  );
  return results || null;
};

export const updateLinkPreview = async (
  id: string,
  preview: LinkPreview
): Promise<void> => {
  await db.runAsync(
    `UPDATE links SET title = COALESCE(?, title), description = COALESCE(?, description), thumbnail_url = COALESCE(?, thumbnail_url), site_name = COALESCE(?, site_name), favicon_url = COALESCE(?, favicon_url) WHERE id = ?`,
    [
      preview.title,
      preview.description,
      preview.thumbnail_url,
      preview.site_name,
      preview.favicon_url,
      id,
    ]
  );
};

export const updateLink = async (link: {
  id: string;
  title: string;
  note: string;
  group_id?: string;
}): Promise<void> => {
  await db.runAsync(
    `UPDATE links SET title = ?, note = ?, group_id = ? WHERE id = ?`,
    [link.title || null, link.note || null, link.group_id ?? null, link.id]
  );
};

export const setLinkArchived = async (
  id: string,
  archived: boolean
): Promise<void> => {
  await db.runAsync(`UPDATE links SET is_archived = ? WHERE id = ?`, [
    archived ? 1 : 0,
    id,
  ]);
};

export const getArchivedLinks = async (): Promise<Link[]> => {
  return db.getAllAsync<Link>(
    `SELECT * FROM links WHERE is_archived = 1 ORDER BY created_at DESC`
  );
};

export const markLinkOpened = async (id: string): Promise<void> => {
  // only stamp the first open so we keep the original "opened" moment
  await db.runAsync(
    `UPDATE links SET opened_at = strftime('%s', 'now') WHERE id = ? AND opened_at IS NULL`,
    [id]
  );
};

export const deleteLink = async (id: string): Promise<void> => {
  await db.runAsync(`DELETE FROM links WHERE id = ?`, [id]);
};

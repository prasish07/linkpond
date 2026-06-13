import db from "../../../db/client";
import { Link } from "../types";

export const getAllLinks = async (): Promise<Link[]> => {
  return db.getAllAsync<Link>(
    "SELECT * FROM links where is_archived = 0 ORDER BY created_at DESC",
  );
};

export const insertLink = async (
  link: Omit<Link, "created_at" | "updated_at" | "is_archived">,
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
    ],
  );
};

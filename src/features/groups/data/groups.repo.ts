import db from "@/db/client";
import { Group } from "../types";

export const getAllGroups = async (): Promise<Group[]> => {
  return db.getAllAsync<Group>("SELECT * FROM groups ORDER BY created_at DESC");
};

export const insertGroup = async (
  group: Omit<Group, "created_at">
): Promise<void> => {
  await db.runAsync(
    `INSERT INTO groups (id, name, color, icon) VALUES (?, ?, ?, ?)`,
    [group.id, group.name, group.color, group.icon]
  );
};

export const updateGroup = async (
  group: Pick<Group, "id" | "name" | "color" | "icon">
): Promise<void> => {
  await db.runAsync(
    `UPDATE groups SET name = ?, color = ?, icon = ? WHERE id = ?`,
    [group.name, group.color, group.icon, group.id]
  );
};

export const deleteGroup = async (id: string): Promise<void> => {
  await db.runAsync("DELETE FROM groups WHERE id = ?", [id]);
};

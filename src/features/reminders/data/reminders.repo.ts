import db from "@/db/client";
import { Reminder } from "../types";

export const insertReminder = async (
  reminder: Omit<Reminder, "created_at" | "is_done">
): Promise<void> => {
  await db.runAsync(
    `INSERT INTO reminders (id, link_id, remind_at, notification_id)
        VALUES (?, ?, ?, ?)`,
    [
      reminder.id,
      reminder.link_id,
      reminder.remind_at,
      reminder.notification_id ?? null,
    ]
  );
};

export const getReminderByLinkId = async (
  linkId: string
): Promise<Reminder | null> => {
  return await db.getFirstAsync<Reminder>(
    `SELECT * FROM reminders WHERE link_id = ? AND is_done = 0 LIMIT 1`,
    [linkId]
  );
};

export const deleteReminder = async (id: string): Promise<void> => {
  await db.runAsync(`DELETE FROM reminders WHERE id = ?`, [id]);
};

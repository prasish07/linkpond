import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteReminder,
  getActiveReminders,
  getReminderByLinkId,
  insertReminder,
} from "../data/reminders.repo";
import { cancelReminder, scheduleReminder } from "@/lib/notifications";

// generate a simple unique id - same pattern we used for links
const genId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const useReminder = (linkId: string) =>
  useQuery({
    queryKey: ["reminder", linkId],
    queryFn: () => getReminderByLinkId(linkId),
  });

/** Map of link_id -> earliest pending remind_at, for showing badges on cards. */
export const useActiveReminders = () =>
  useQuery({
    queryKey: ["activeReminders"],
    queryFn: async () => {
      const rows = await getActiveReminders();
      return Object.fromEntries(
        rows.map((r) => [r.link_id, r.remind_at])
      ) as Record<string, number>;
    },
  });

export const useSetReminder = (linkId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, date }: { title: string; date: Date }) => {
      const notificationId = await scheduleReminder(linkId, title, date);

      await insertReminder({
        id: genId(),
        link_id: linkId,
        remind_at: Math.floor(date.getTime() / 1000),
        notification_id: notificationId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminder", linkId] });
      queryClient.invalidateQueries({ queryKey: ["activeReminders"] });
    },
  });
};

export const useDeleteReminder = (linkId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminder: {
      id: string;
      notification_id: string | null;
    }) => {
      if (reminder.notification_id)
        await cancelReminder(reminder.notification_id);

      await deleteReminder(reminder.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminder", linkId] });
      queryClient.invalidateQueries({ queryKey: ["activeReminders"] });
    },
  });
};

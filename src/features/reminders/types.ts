export type Reminder = {
  id: string;
  link_id: string;
  remind_at: number;
  notification_id: string | null;
  is_done: number;
  created_at: number;
};

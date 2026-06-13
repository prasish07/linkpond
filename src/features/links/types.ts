export type Link = {
  id: string;
  url: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  site_name?: string;
  favicon_url?: string;
  note?: string;
  group_id?: string;
  is_archived: number;
  created_at: number;
  updated_at: number;
};

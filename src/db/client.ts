import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("linkpond.db");

export const initDB = async (): Promise<void> => {
  await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS groups (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            color TEXT,
            icon TEXT,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );
        
        CREATE TABLE IF NOT EXISTS links (
            id TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            title TEXT,
            description TEXT,
            thumbnail_url TEXT,
            site_name TEXT,
            favicon_url TEXT,
            note TEXT,
            group_id TEXT,
            is_archived INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            opened_at INTEGER,
            FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS link_tags (
            link_id TEXT NOT NULL,
            tag_id TEXT NOT NULL,
            PRIMARY KEY (link_id, tag_id),
            FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS reminders (
            id TEXT PRIMARY KEY,
            link_id TEXT NOT NULL,
            remind_at INTEGER NOT NULL,
            notification_id TEXT,
            is_done INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recent_searches (
            term TEXT PRIMARY KEY,
            searched_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        CREATE INDEX IF NOT EXISTS idx_links_group ON links(group_id);
        CREATE INDEX IF NOT EXISTS idx_links_created ON links(created_at);
        CREATE INDEX IF NOT EXISTS idx_reminders_at ON reminders(remind_at);
        `);

  await runMigrations();
};

/** Returns true if `table` already has a column named `column`. */
const columnExists = async (
  table: string,
  column: string
): Promise<boolean> => {
  const cols = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${table})`
  );
  return cols.some((c) => c.name === column);
};

/**
 * expo-sqlite has no automatic migrations and `CREATE TABLE IF NOT EXISTS`
 * never alters an existing table. So we add new columns here, guarded by a
 * table_info check so it's safe to run on every launch.
 */
const runMigrations = async (): Promise<void> => {
  if (!(await columnExists("links", "opened_at"))) {
    await db.execAsync(`ALTER TABLE links ADD COLUMN opened_at INTEGER`);
  }
  if (!(await columnExists("tags", "color"))) {
    await db.execAsync(`ALTER TABLE tags ADD COLUMN color TEXT NOT NULL DEFAULT '#7B9EA8'`);
  }
};

export default db;

import Database from 'better-sqlite3';
import { Event } from '@/types/event';
import path from 'path';

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'data', 'events.db');
const db = new Database(dbPath);

// Initialize database
export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      location TEXT,
      url TEXT,
      source TEXT NOT NULL,
      tags TEXT,
      price TEXT,
      organizer TEXT,
      imageUrl TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_events_startDate ON events(startDate);
    CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);
  `);
}

export function saveEvent(event: Event): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO events (
      id, title, description, startDate, endDate, location, url, source, tags,
      price, organizer, imageUrl, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    event.id,
    event.title,
    event.description,
    event.startDate.toISOString(),
    event.endDate.toISOString(),
    event.location,
    event.url,
    event.source,
    JSON.stringify(event.tags),
    event.price || null,
    event.organizer || null,
    event.imageUrl || null,
    event.createdAt.toISOString(),
    event.updatedAt.toISOString()
  );
}

export function getAllEvents(): Event[] {
  const stmt = db.prepare('SELECT * FROM events ORDER BY startDate ASC');
  const rows = stmt.all() as any[];

  return rows.map(row => ({
    ...row,
    startDate: new Date(row.startDate),
    endDate: new Date(row.endDate),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    tags: JSON.parse(row.tags || '[]')
  }));
}

export function getUpcomingEvents(days: number = 30): Event[] {
  const stmt = db.prepare(`
    SELECT * FROM events
    WHERE startDate >= datetime('now')
    AND startDate <= datetime('now', '+' || ? || ' days')
    ORDER BY startDate ASC
  `);
  const rows = stmt.all(days) as any[];

  return rows.map(row => ({
    ...row,
    startDate: new Date(row.startDate),
    endDate: new Date(row.endDate),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    tags: JSON.parse(row.tags || '[]')
  }));
}

export function deleteEvent(id: string): void {
  const stmt = db.prepare('DELETE FROM events WHERE id = ?');
  stmt.run(id);
}

export function closeDatabase(): void {
  db.close();
}
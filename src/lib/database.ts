import { Event } from '@/types/event';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const eventsFile = path.join(dataDir, 'events.json');

// Initialize data directory and file
export function initializeDatabase(): void {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  if (!existsSync(eventsFile)) {
    writeFileSync(eventsFile, JSON.stringify([], null, 2));
  }
}

export function saveEvent(event: Event): void {
  initializeDatabase();

  const events = getAllEvents();
  const existingIndex = events.findIndex(e => e.id === event.id);

  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }

  // Sort by start date
  events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  writeFileSync(eventsFile, JSON.stringify(events, null, 2));
}

export function getAllEvents(): Event[] {
  initializeDatabase();

  try {
    const data = readFileSync(eventsFile, 'utf-8');
    const events = JSON.parse(data) as any[];

    return events.map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      tags: event.tags || []
    }));
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

export function getUpcomingEvents(days: number = 30): Event[] {
  const events = getAllEvents();
  const now = new Date();
  const cutoffDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return events
    .filter(event => event.startDate >= now && event.startDate <= cutoffDate)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export function deleteEvent(id: string): void {
  initializeDatabase();

  const events = getAllEvents();
  const filteredEvents = events.filter(e => e.id !== id);

  writeFileSync(eventsFile, JSON.stringify(filteredEvents, null, 2));
}

export function closeDatabase(): void {
  // No-op for JSON file storage
}
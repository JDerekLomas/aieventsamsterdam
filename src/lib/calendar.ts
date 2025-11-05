import icalGenerator from 'ical-generator';
import { Event } from '@/types/event';
import { format, addHours } from 'date-fns';

export interface CalendarConfig {
  name: string;
  description: string;
  url?: string;
  timezone: string;
}

export class CalendarManager {
  private config: CalendarConfig;

  constructor(config?: Partial<CalendarConfig>) {
    this.config = {
      name: process.env.CALENDAR_NAME || 'AI Events Amsterdam',
      description: process.env.CALENDAR_DESCRIPTION || 'AI-related events happening in Amsterdam',
      timezone: 'Europe/Amsterdam',
      ...config
    };
  }

  generateICal(events: Event[]): string {
    const calendar = icalGenerator({
      name: this.config.name,
      description: this.config.description,
      url: this.config.url,
      timezone: this.config.timezone,
      ttl: 3600, // 1 hour
    });

    events.forEach(event => {
      calendar.createEvent({
        id: event.id,
        start: event.startDate,
        end: event.endDate,
        summary: event.title,
        description: this.formatEventDescription(event),
        location: event.location,
        url: event.url,
        categories: event.tags,
        created: event.createdAt,
        lastModified: event.updatedAt
      });
    });

    return calendar.toString();
  }

  private formatEventDescription(event: Event): string {
    let description = event.description || '';

    if (event.organizer) {
      description += `\n\nOrganizer: ${event.organizer}`;
    }

    if (event.price) {
      description += `\nPrice: ${event.price}`;
    }

    if (event.tags.length > 0) {
      description += `\n\nTags: ${event.tags.join(', ')}`;
    }

    description += `\n\nSource: ${event.source}`;
    description += `\nEvent ID: ${event.id}`;

    return description.trim();
  }

  generateJSONFeed(events: Event[]): object {
    return {
      title: this.config.name,
      description: this.config.description,
      updated: new Date().toISOString(),
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        location: event.location,
        url: event.url,
        tags: event.tags,
        price: event.price,
        organizer: event.organizer,
        source: event.source,
        imageUrl: event.imageUrl,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString()
      }))
    };
  }

  filterUpcomingEvents(events: Event[], days: number = 30): Event[] {
    const now = new Date();
    const cutoffDate = addHours(now, days * 24);

    return events.filter(event => {
      return event.startDate >= now && event.startDate <= cutoffDate;
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  filterByTags(events: Event[], tags: string[]): Event[] {
    if (tags.length === 0) return events;

    return events.filter(event => {
      return tags.some(tag =>
        event.tags.some(eventTag =>
          eventTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
    });
  }

  exportToCSV(events: Event[]): string {
    const headers = [
      'ID', 'Title', 'Description', 'Start Date', 'End Date',
      'Location', 'URL', 'Source', 'Tags', 'Price', 'Organizer'
    ];

    const rows = events.map(event => [
      event.id,
      event.title,
      `"${event.description?.replace(/"/g, '""') || ''}"`,
      format(event.startDate, 'yyyy-MM-dd HH:mm:ss'),
      format(event.endDate, 'yyyy-MM-dd HH:mm:ss'),
      `"${event.location}"`,
      event.url,
      event.source,
      `"${event.tags.join(', ')}"`,
      `"${event.price || ''}"`,
      `"${event.organizer || ''}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}
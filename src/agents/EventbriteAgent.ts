import { BaseAgent } from './BaseAgent';
import { Event, EventSource } from '@/types/event';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class EventbriteAgent extends BaseAgent {
  constructor() {
    super('EventbriteAgent');
  }

  getSources(): EventSource[] {
    return [
      {
        name: 'Eventbrite Amsterdam AI',
        baseUrl: 'https://www.eventbrite.com/d/netherlands--amsterdam/ai-events/',
        searchEvents: () => this.searchEventbriteEvents('ai')
      },
      {
        name: 'Eventbrite Amsterdam Tech',
        baseUrl: 'https://www.eventbrite.com/d/netherlands--amsterdam/tech-events/',
        searchEvents: () => this.searchEventbriteEvents('tech')
      }
    ];
  }

  private async searchEventbriteEvents(category: string): Promise<Event[]> {
    try {
      const response = await axios.get(
        `https://www.eventbrite.com/d/netherlands--amsterdam/${category}-events/`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        }
      );

      const $ = cheerio.load(response.data);
      const events: Event[] = [];

      // Eventbrite uses dynamic content, so web scraping may be limited
      // This is a basic implementation - you might need to use their API
      $('[data-testid="event-card"]').each((index, element) => {
        const $event = $(element);

        const title = $event.find('[data-testid="event-card-title"]').text().trim();
        const dateStr = $event.find('[data-testid="event-card-local-date"]').text().trim();
        const location = $event.find('[data-testid="event-card-location"]').text().trim();
        const url = $event.find('a').attr('href');

        if (title && url) {
          const startDate = this.parseDate(dateStr);
          if (startDate) {
            events.push({
              id: this.generateEventId({ title, startDate, location }),
              title,
              description: `${category.toUpperCase()} event from Eventbrite: ${title}`,
              startDate,
              endDate: new Date(startDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
              location: location || 'Amsterdam',
              url: `https://www.eventbrite.com${url}`,
              source: 'eventbrite',
              tags: [category, 'amsterdam'],
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      });

      return events;
    } catch (error) {
      console.error('Error searching Eventbrite events:', error);
      return [];
    }
  }

  private parseDate(dateStr: string): Date | null {
    try {
      // Parse various date formats from Eventbrite
      const now = new Date();

      // Handle formats like "Today", "Tomorrow", "Mon, Dec 15"
      if (dateStr.toLowerCase().includes('today')) {
        return now;
      }

      if (dateStr.toLowerCase().includes('tomorrow')) {
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      }

      // Try parsing specific dates
      const months: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };

      const match = dateStr.match(/\w{3},\s+(\w{3})\s+(\d+)/);
      if (match) {
        const [, month, day] = match;
        const year = now.getFullYear();
        return new Date(year, months[month], parseInt(day));
      }
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
    }

    return null;
  }
}
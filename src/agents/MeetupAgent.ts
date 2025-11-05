import { BaseAgent } from '@/agents/BaseAgent';
import { Event, EventSource } from '@/types/event';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class MeetupAgent extends BaseAgent {
  constructor() {
    super('MeetupAgent');
  }

  getSources(): EventSource[] {
    return [
      {
        name: 'Meetup Amsterdam AI',
        baseUrl: 'https://www.meetup.com/find/?allMeetups=true&location=nl--nl--amsterdam&keywords=artificial%20intelligence',
        searchEvents: () => this.searchMeetupEvents('artificial intelligence')
      },
      {
        name: 'Meetup Amsterdam Tech',
        baseUrl: 'https://www.meetup.com/find/?allMeetups=true&location=nl--nl--amsterdam&keywords=machine%20learning',
        searchEvents: () => this.searchMeetupEvents('machine learning')
      }
    ];
  }

  private async searchMeetupEvents(keywords: string): Promise<Event[]> {
    try {
      const response = await axios.get(
        `https://www.meetup.com/find/?allMeetups=true&location=nl--nl--amsterdam&keywords=${encodeURIComponent(keywords)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        }
      );

      const $ = cheerio.load(response.data);
      const events: Event[] = [];

      // Note: Meetup's HTML structure may change, this is a basic implementation
      $('.event-card').each((index, element) => {
        const $event = $(element);

        const title = $event.find('.event-title').text().trim();
        const dateStr = $event.find('.date').text().trim();
        const location = $event.find('.location').text().trim();
        const url = $event.find('a').attr('href');

        if (title && url) {
          const startDate = this.parseDate(dateStr);
          if (startDate) {
            events.push({
              id: this.generateEventId({ title, startDate, location }),
              title,
              description: `AI/ML event from Meetup: ${title}`,
              startDate,
              endDate: new Date(startDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
              location: location || 'Amsterdam',
              url: `https://www.meetup.com${url}`,
              source: 'meetup',
              tags: ['ai', 'machine-learning', 'meetup'],
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      });

      return events;
    } catch (error) {
      console.error('Error searching Meetup events:', error);
      return [];
    }
  }

  private parseDate(dateStr: string): Date | null {
    // Basic date parsing - you may want to enhance this
    const months: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    try {
      // Example format: "Tue, Nov 15, 2024"
      const match = dateStr.match(/\w{3},\s+(\w{3})\s+(\d+),\s+(\d+)/);
      if (match) {
        const [, month, day, year] = match;
        return new Date(parseInt(year), months[month], parseInt(day));
      }
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
    }

    return null;
  }
}
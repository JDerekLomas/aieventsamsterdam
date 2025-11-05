import { NextResponse } from 'next/server';
import { getUpcomingEvents, getAllEvents } from '@/lib/database';
import { CalendarManager } from '@/lib/calendar';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const days = parseInt(searchParams.get('days') || '30');
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  try {
    const calendarManager = new CalendarManager();

    // Get events based on parameters
    let events = days > 0 ? getUpcomingEvents(days) : getAllEvents();

    // Filter by tags if provided
    if (tags.length > 0) {
      events = calendarManager.filterByTags(events, tags);
    }

    switch (format) {
      case 'ical':
      case 'ics':
        const icalContent = calendarManager.generateICal(events);
        return new NextResponse(icalContent, {
          headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'attachment; filename="ai-events-amsterdam.ics"',
          },
        });

      case 'csv':
        const csvContent = calendarManager.exportToCSV(events);
        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="ai-events-amsterdam.csv"',
          },
        });

      case 'json':
      default:
        const jsonFeed = calendarManager.generateJSONFeed(events);
        return NextResponse.json(jsonFeed);
    }
  } catch (error) {
    console.error('Error in events API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
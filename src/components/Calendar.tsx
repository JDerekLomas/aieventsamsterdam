'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  url: string;
  tags: string[];
  price?: string;
  organizer?: string;
  source: string;
}

export function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events?days=30');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">❌ Error loading events</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchEvents}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">📅 No upcoming events found</div>
        <p className="text-gray-500 text-sm">
          Our agents are continuously searching for AI events in Amsterdam.
          Check back soon or subscribe to the calendar for automatic updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Found {events.length} upcoming events in the next 30 days
        </p>
        <button
          onClick={fetchEvents}
          className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {events.map((event) => (
        <div
          key={event.id}
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {event.title}
              </a>
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {event.source}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <span className="mr-2">⏰</span>
              {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
            </div>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              {event.location}
            </div>
            {event.organizer && (
              <div className="flex items-center">
                <span className="mr-2">👤</span>
                {event.organizer}
              </div>
            )}
            {event.price && (
              <div className="flex items-center">
                <span className="mr-2">💰</span>
                {event.price}
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
              {event.description}
            </p>
          )}

          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
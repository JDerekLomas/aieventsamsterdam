'use client';

import { useState, useEffect } from 'react';

interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  sources: string[];
}

export function EventStats() {
  const [stats, setStats] = useState<EventStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    sources: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all events and upcoming events to get stats
      const [allResponse, upcomingResponse] = await Promise.all([
        fetch('/api/events?days=365'),
        fetch('/api/events?days=30')
      ]);

      if (allResponse.ok && upcomingResponse.ok) {
        const allData = await allResponse.json();
        const upcomingData = await upcomingResponse.json();

        const sources = [...new Set(allData.events?.map((event: any) => event.source) || [])];

        setStats({
          totalEvents: allData.events?.length || 0,
          upcomingEvents: upcomingData.events?.length || 0,
          sources
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Statistics</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Events</span>
          <span className="text-2xl font-bold text-blue-600">{stats.totalEvents}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Next 30 Days</span>
          <span className="text-xl font-semibold text-green-600">{stats.upcomingEvents}</span>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="text-gray-600 mb-2">Data Sources</div>
          <div className="flex flex-wrap gap-2">
            {stats.sources.map((source, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        Updated automatically every 2 hours
      </div>
    </div>
  );
}
export function CalendarLinks() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const calendarLinks = [
    {
      name: 'iCalendar (.ics)',
      description: 'Add to Apple Calendar, Google Calendar, Outlook',
      url: '/api/events?format=ics',
      icon: '📅',
      color: 'bg-blue-500'
    },
    {
      name: 'JSON Feed',
      description: 'For developers and applications',
      url: '/api/events?format=json',
      icon: '🔗',
      color: 'bg-green-500'
    },
    {
      name: 'CSV Export',
      description: 'Download as spreadsheet',
      url: '/api/events?format=csv',
      icon: '📊',
      color: 'bg-purple-500'
    },
    {
      name: 'Google Calendar',
      description: 'Subscribe in Google Calendar',
      url: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(`${baseUrl}/api/events?format=ics`)}`,
      icon: '🇬',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Subscribe & Export</h3>

      <div className="space-y-3">
        {calendarLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target={link.name === 'Google Calendar' ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className={`${link.color} text-white rounded-lg p-2 mr-3`}>
                <span className="text-sm">{link.icon}</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{link.name}</div>
                <div className="text-sm text-gray-600">{link.description}</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="mb-2">🔄 Auto-refresh URL:</div>
        <div className="bg-gray-100 p-2 rounded font-mono text-xs break-all">
          {baseUrl}/api/refresh
        </div>
      </div>
    </div>
  );
}
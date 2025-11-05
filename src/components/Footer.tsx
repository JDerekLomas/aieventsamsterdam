import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AI Events Amsterdam</h3>
            <p className="text-gray-300 text-sm">
              Continuously updated calendar of AI-related events in Amsterdam,
              powered by intelligent agents that search multiple event sources.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/api/events?format=ics" className="text-gray-300 hover:text-white transition-colors">
                  Subscribe to Calendar
                </a>
              </li>
              <li>
                <a href="/api/events?format=json" className="text-gray-300 hover:text-white transition-colors">
                  JSON API
                </a>
              </li>
              <li>
                <a href="/api/events?format=csv" className="text-gray-300 hover:text-white transition-colors">
                  Export to CSV
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Project Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/JDerekLomas/aieventsamsterdam"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="/api/refresh"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Refresh Events
                </a>
              </li>
              <li className="text-gray-300">
                Last updated: Automatically every 2 hours
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            Built with Next.js, TypeScript, and intelligent agents.{' '}
            Data automatically sourced from Meetup, Eventbrite, and conference sites.
          </p>
        </div>
      </div>
    </footer>
  );
}
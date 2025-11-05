import './globals.css';
import { Calendar } from '@/components/Calendar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EventStats } from '@/components/EventStats';
import { CalendarLinks } from '@/components/CalendarLinks';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Events Amsterdam
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Continuously updated calendar of AI-related events in Amsterdam, powered by intelligent agents
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <EventStats />
          <CalendarLinks />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Upcoming Events
          </h2>
          <Calendar />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🤖 How it works
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Intelligent agents continuously search for AI events</li>
              <li>• Multiple sources: Meetup, Eventbrite, conferences, venues</li>
              <li>• Automated deduplication and data cleaning</li>
              <li>• Calendar updates every 2 hours</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              📅 Subscribe
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Add to Google Calendar, Outlook, or Apple Calendar</li>
              <li>• Download .ics file for calendar applications</li>
              <li>• Subscribe to JSON feed for developers</li>
              <li>• Export events as CSV spreadsheet</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
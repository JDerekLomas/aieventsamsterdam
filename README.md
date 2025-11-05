# AI Events Amsterdam

An intelligent agent-based system for continuously updating a calendar of AI-related events in Amsterdam.

## 🤖 Features

- **Multi-Source Event Discovery**: Intelligent agents search multiple platforms for AI events:
  - Meetup groups and events
  - Eventbrite listings
  - Conferences and tech summits
  - Venue-specific events

- **Automated Updates**: Cron jobs run every 2 hours to discover new events and update the calendar

- **Multiple Export Formats**:
  - iCalendar (.ics) for Apple Calendar, Google Calendar, Outlook
  - JSON feed for developers
  - CSV spreadsheet export

- **Smart Deduplication**: Removes duplicate events across different sources

- **Web Interface**: Clean, responsive UI to browse upcoming events

## 🚀 Quick Start

1. **Clone and Install**:
   ```bash
   git clone https://github.com/JDerekLomas/aieventsamsterdam.git
   cd aieventsamsterdam
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Test the Agents**:
   ```bash
   npm run test-agents
   ```

5. **Run Event Discovery**:
   ```bash
   npm run run-agents
   ```

## 📁 Project Structure

```
src/
├── agents/           # Event discovery agents
│   ├── BaseAgent.ts  # Base agent class
│   ├── MeetupAgent.ts
│   ├── EventbriteAgent.ts
│   └── ConferenceAgent.ts
├── lib/              # Core utilities
│   ├── database.ts   # SQLite database management
│   ├── calendar.ts   # Calendar generation (iCal, JSON, CSV)
│   └── scheduler.ts  # Cron job management
├── app/              # Next.js app router
│   ├── api/          # API routes
│   └── components/   # React components
└── scripts/          # CLI scripts
    ├── run-agents.ts
    └── test-agents.ts
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=./data/events.db

# API Keys (optional)
MEETUP_API_KEY=your_meetup_api_key
EVENTBRITE_API_KEY=your_eventbrite_api_key

# Cron Schedule (default: every 2 hours)
CRON_SCHEDULE=0 */2 * * *

# Calendar Settings
CALENDAR_NAME=AI Events Amsterdam
CALENDAR_DESCRIPTION=AI-related events happening in Amsterdam
```

## 📡 API Endpoints

### Get Events
```
GET /api/events?format=json&days=30&tags=ai,machine-learning
```

Parameters:
- `format`: `json` (default), `ics`, `csv`
- `days`: Number of days ahead to include (default: 30)
- `tags`: Comma-separated list of tags to filter by

### Manual Refresh
```
POST /api/refresh
```
Triggers immediate event discovery by all agents.

### Get System Status
```
GET /api/refresh
```
Returns the current status of the scheduler and agents.

## 🚀 Deployment on Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Import your GitHub repository in Vercel
   - Configure environment variables in Vercel dashboard
   - Deploy

3. **Configure Environment Variables in Vercel**:
   - `DATABASE_URL`: Use Vercel's file system or external database
   - `MEETUP_API_KEY`: (optional) Your Meetup API key
   - `EVENTBRITE_API_KEY`: (optional) Your Eventbrite API key
   - `CRON_SCHEDULE`: `0 */2 * * *` (every 2 hours)

4. **Setup Cron Jobs**:
   The cron jobs will automatically run on Vercel's serverless infrastructure.

## 🤖 Agent Architecture

### BaseAgent
All agents extend the `BaseAgent` class which provides:
- Event discovery orchestration
- Duplicate detection
- Error handling
- Logging

### Event Sources
Each agent defines multiple event sources:
- **MeetupAgent**: Searches Meetup groups for AI/ML events
- **EventbriteAgent**: Scrapes Eventbrite for tech events
- **ConferenceAgent**: Searches for major conferences and venue events

### Adding New Agents

1. Create a new agent extending `BaseAgent`:

```typescript
import { BaseAgent } from './BaseAgent';

export class CustomAgent extends BaseAgent {
  constructor() {
    super('CustomAgent');
  }

  getSources(): EventSource[] {
    return [
      {
        name: 'Custom Source',
        baseUrl: 'https://example.com',
        searchEvents: () => this.searchCustomEvents()
      }
    ];
  }

  private async searchCustomEvents(): Promise<Event[]> {
    // Implementation here
  }
}
```

2. Add the agent to `AgentManager` in `src/agents/index.ts`

## 📊 Calendar Integration

### Subscribe in Google Calendar
1. Go to Google Calendar
2. Add calendar by URL
3. Use: `https://your-domain.vercel.app/api/events?format=ics`

### Subscribe in Apple Calendar
1. Open Calendar app
2. File → New Calendar Subscription
3. Use: `https://your-domain.vercel.app/api/events?format=ics`

### Use in Applications
Access the JSON feed:
```
GET /api/events?format=json
```

## 🛠 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test-agents` - Test all agents
- `npm run run-agents` - Run agents once

### Database
The system uses SQLite for simplicity. In production, consider using:
- Vercel's file system (current setup)
- External database like PostgreSQL or MongoDB

### Web Scraping
The agents use web scraping to discover events. For production use:
- Respect robots.txt
- Implement rate limiting
- Consider official APIs when available

## 📝 License

MIT License - feel free to use this for your own city or event type!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🔍 Future Enhancements

- [ ] Add more event sources (LinkedIn Events, Facebook Events)
- [ ] Machine learning for event relevance scoring
- [ ] Email notifications for new events
- [ ] Event filtering by category and price
- [ ] User accounts and personalization
- [ ] Mobile app
- [ ] Social sharing features
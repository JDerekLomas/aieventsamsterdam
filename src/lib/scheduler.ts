import * as cron from 'node-cron';
import { AgentManager } from '@/agents';
import { saveEvent, initializeDatabase, getAllEvents } from '@/lib/database';
import { CalendarManager } from '@/lib/calendar';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export class EventScheduler {
  private agentManager: AgentManager;
  private calendarManager: CalendarManager;
  private cronJob: cron.ScheduledTask | null = null;
  private isRunning: boolean = false;

  constructor() {
    this.agentManager = new AgentManager();
    this.calendarManager = new CalendarManager();
  }

  async initialize(): Promise<void> {
    console.log('Initializing event scheduler...');
    initializeDatabase();
    console.log('Database initialized');
  }

  async runEventDiscovery(): Promise<void> {
    if (this.isRunning) {
      console.log('Event discovery already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting event discovery...');

    try {
      // Run all agents to discover events
      const newEvents = await this.agentManager.runAllAgents();

      // Save events to database
      let savedCount = 0;
      for (const event of newEvents) {
        try {
          saveEvent(event);
          savedCount++;
        } catch (error) {
          console.error(`Error saving event ${event.id}:`, error);
        }
      }

      console.log(`Saved ${savedCount} new events to database`);

      // Update calendar files
      await this.updateCalendarFiles();

      console.log('Event discovery completed successfully');
    } catch (error) {
      console.error('Error during event discovery:', error);
    } finally {
      this.isRunning = false;
    }
  }

  private async updateCalendarFiles(): Promise<void> {
    console.log('Updating calendar files...');

    try {
      // Ensure output directory exists
      const outputDir = path.join(process.cwd(), 'public', 'calendars');
      mkdirSync(outputDir, { recursive: true });

      // Get all events from database
      const allEvents = getAllEvents();

      // Generate iCal file
      const icalContent = this.calendarManager.generateICal(allEvents);
      writeFileSync(path.join(outputDir, 'events.ics'), icalContent);

      // Generate upcoming events calendar (next 30 days)
      const upcomingEvents = this.calendarManager.filterUpcomingEvents(allEvents, 30);
      const upcomingICalContent = this.calendarManager.generateICal(upcomingEvents);
      writeFileSync(path.join(outputDir, 'upcoming.ics'), upcomingICalContent);

      // Generate JSON feed
      const jsonFeed = this.calendarManager.generateJSONFeed(allEvents);
      writeFileSync(path.join(outputDir, 'events.json'), JSON.stringify(jsonFeed, null, 2));

      // Generate CSV export
      const csvContent = this.calendarManager.exportToCSV(allEvents);
      writeFileSync(path.join(outputDir, 'events.csv'), csvContent);

      console.log(`Updated calendar files with ${allEvents.length} total events (${upcomingEvents.length} upcoming)`);
    } catch (error) {
      console.error('Error updating calendar files:', error);
    }
  }

  startCronJob(schedule?: string): void {
    if (this.cronJob) {
      console.log('Cron job already running, stopping it first...');
      this.stopCronJob();
    }

    const cronSchedule = schedule || process.env.CRON_SCHEDULE || '0 */2 * * *'; // Every 2 hours

    console.log(`Starting cron job with schedule: ${cronSchedule}`);

    this.cronJob = cron.schedule(cronSchedule, async () => {
      console.log('Running scheduled event discovery...');
      await this.runEventDiscovery();
    }, {
      scheduled: false
    });

    this.cronJob.start();
    console.log('Cron job started successfully');
  }

  stopCronJob(): void {
    if (this.cronJob) {
      console.log('Stopping cron job...');
      this.cronJob.stop();
      this.cronJob = null;
      console.log('Cron job stopped');
    }
  }

  getStatus(): {
    isRunning: boolean;
    cronJobActive: boolean;
    lastRun?: Date;
  } {
    return {
      isRunning: this.isRunning,
      cronJobActive: this.cronJob !== null,
      lastRun: this.lastRun
    };
  }

  private lastRun: Date | undefined;

  setLastRun(date: Date): void {
    this.lastRun = date;
  }
}
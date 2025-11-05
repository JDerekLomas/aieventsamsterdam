import { MeetupAgent } from './MeetupAgent';
import { EventbriteAgent } from './EventbriteAgent';
import { ConferenceAgent } from './ConferenceAgent';
import { BaseAgent } from './BaseAgent';
import { Event } from '@/types/event';

export { BaseAgent } from './BaseAgent';
export { MeetupAgent } from './MeetupAgent';
export { EventbriteAgent } from './EventbriteAgent';
export { ConferenceAgent } from './ConferenceAgent';

export class AgentManager {
  private agents: BaseAgent[];

  constructor() {
    this.agents = [
      new MeetupAgent(),
      new EventbriteAgent(),
      new ConferenceAgent()
    ];
  }

  async runAllAgents(): Promise<Event[]> {
    console.log('Starting agent execution...');

    // Run all agents in parallel
    const agentPromises = this.agents.map(agent => agent.discoverEvents());
    const results = await Promise.allSettled(agentPromises);

    const allEvents: Event[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allEvents.push(...result.value);
        console.log(`Agent ${index} found ${result.value.length} events`);
      } else {
        console.error(`Agent ${index} failed:`, result.reason);
      }
    });

    // Remove duplicates based on title, date, and location
    const uniqueEvents = this.deduplicateEvents(allEvents);

    console.log(`Total unique events found: ${uniqueEvents.length}`);
    return uniqueEvents;
  }

  private deduplicateEvents(events: Event[]): Event[] {
    const seen = new Set<string>();
    const uniqueEvents: Event[] = [];

    for (const event of events) {
      const key = `${event.title.toLowerCase()}-${event.startDate.toISOString()}-${event.location.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueEvents.push(event);
      }
    }

    return uniqueEvents;
  }

  getAgents(): BaseAgent[] {
    return this.agents;
  }

  enableAgent(agentName: string): void {
    const agent = this.agents.find(a => a.constructor.name === agentName);
    if (agent) {
      agent.setEnabled(true);
      console.log(`Enabled agent: ${agentName}`);
    }
  }

  disableAgent(agentName: string): void {
    const agent = this.agents.find(a => a.constructor.name === agentName);
    if (agent) {
      agent.setEnabled(false);
      console.log(`Disabled agent: ${agentName}`);
    }
  }
}
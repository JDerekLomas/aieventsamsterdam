export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  url: string;
  source: string;
  tags: string[];
  price?: string;
  organizer?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventSource {
  name: string;
  baseUrl: string;
  searchEvents: () => Promise<Event[]>;
}

export interface AgentConfig {
  name: string;
  enabled: boolean;
  schedule?: string;
  sources: EventSource[];
}
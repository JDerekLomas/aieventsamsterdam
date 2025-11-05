import { NextResponse } from 'next/server';
import { EventScheduler } from '@/lib/scheduler';

let scheduler: EventScheduler | null = null;

async function getScheduler(): Promise<EventScheduler> {
  if (!scheduler) {
    scheduler = new EventScheduler();
    await scheduler.initialize();
  }
  return scheduler;
}

export async function POST() {
  try {
    console.log('Manual refresh triggered via API');
    const schedulerInstance = await getScheduler();

    // Run event discovery
    await schedulerInstance.runEventDiscovery();

    return NextResponse.json({
      success: true,
      message: 'Event discovery completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in refresh API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh events',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const schedulerInstance = await getScheduler();
    const status = schedulerInstance.getStatus();

    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
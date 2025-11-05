#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { EventScheduler } from '@/lib/scheduler';

// Load environment variables
dotenv.config();

async function main(): Promise<void> {
  console.log('🤖 AI Events Amsterdam - Agent Runner');
  console.log('=====================================');

  try {
    const scheduler = new EventScheduler();

    // Initialize the scheduler
    await scheduler.initialize();

    // Run event discovery once
    await scheduler.runEventDiscovery();

    console.log('✅ Agent execution completed successfully');
  } catch (error) {
    console.error('❌ Error running agents:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);
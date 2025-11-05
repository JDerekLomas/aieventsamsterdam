#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { AgentManager } from '@/agents';

// Load environment variables
dotenv.config();

async function main(): Promise<void> {
  console.log('🧪 AI Events Amsterdam - Agent Testing');
  console.log('=====================================');

  try {
    const agentManager = new AgentManager();

    console.log('Testing all agents...');
    const events = await agentManager.runAllAgents();

    console.log(`\n📊 Results:`);
    console.log(`Total events found: ${events.length}`);

    // Group events by source
    const eventsBySource = events.reduce((acc, event) => {
      if (!acc[event.source]) {
        acc[event.source] = 0;
      }
      acc[event.source]++;
      return acc;
    }, {} as Record<string, number>);

    console.log('\nEvents by source:');
    Object.entries(eventsBySource).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} events`);
    });

    // Show first few events as examples
    console.log('\n📅 Sample events:');
    events.slice(0, 5).forEach((event, index) => {
      console.log(`\n${index + 1}. ${event.title}`);
      console.log(`   Date: ${event.startDate.toDateString()}`);
      console.log(`   Location: ${event.location}`);
      console.log(`   URL: ${event.url}`);
      console.log(`   Tags: ${event.tags.join(', ')}`);
    });

    console.log('\n✅ Agent testing completed successfully');
  } catch (error) {
    console.error('❌ Error testing agents:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);
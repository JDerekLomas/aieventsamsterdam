'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock skill tree data for 3rd Grade Math
const mockSkillTree = {
  id: '1',
  name: '3rd Grade Math',
  description: 'Master all 3rd grade math standards',
  skills: [
    { id: '1', name: 'Counting', level: 5, maxLevel: 5, status: 'mastered', x: 50, y: 10, icon: '🔢' },
    { id: '2', name: 'Addition', level: 5, maxLevel: 5, status: 'mastered', x: 30, y: 25, icon: '➕', prereqs: ['1'] },
    { id: '3', name: 'Subtraction', level: 5, maxLevel: 5, status: 'mastered', x: 70, y: 25, icon: '➖', prereqs: ['1'] },
    { id: '4', name: 'Multiplication', level: 3, maxLevel: 5, status: 'in_progress', x: 30, y: 45, icon: '✖️', prereqs: ['2'] },
    { id: '5', name: 'Division', level: 2, maxLevel: 5, status: 'in_progress', x: 70, y: 45, icon: '➗', prereqs: ['3'] },
    { id: '6', name: 'Fractions', level: 1, maxLevel: 5, status: 'available', x: 50, y: 65, icon: '🥧', prereqs: ['4', '5'] },
    { id: '7', name: 'Measurement', level: 0, maxLevel: 5, status: 'locked', x: 20, y: 75, icon: '📏', prereqs: ['4'] },
    { id: '8', name: 'Geometry', level: 0, maxLevel: 5, status: 'locked', x: 80, y: 75, icon: '📐', prereqs: ['5'] },
    { id: '9', name: 'Word Problems', level: 0, maxLevel: 5, status: 'locked', x: 50, y: 90, icon: '📝', prereqs: ['6', '7', '8'] },
  ],
};

const getSkillNodeClass = (status: string) => {
  switch (status) {
    case 'mastered':
      return 'skill-node-mastered';
    case 'in_progress':
      return 'skill-node-in-progress';
    case 'available':
      return 'skill-node-available';
    default:
      return 'skill-node-locked';
  }
};

export default function SkillTreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-peacock-900 to-peacock-950">
      {/* Header */}
      <header className="bg-peacock-800/50 backdrop-blur-sm border-b border-peacock-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/student/dashboard" className="flex items-center space-x-2 text-peacock-200 hover:text-white">
              <span>←</span>
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold text-white">{mockSkillTree.name} Skill Tree</h1>
            <div className="flex items-center space-x-4 text-peacock-200">
              <span>🎯 8/9 Skills Unlocked</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-peacock-800/50 backdrop-blur-sm rounded-xl p-4 mb-8 flex justify-center space-x-8"
        >
          {[
            { status: 'Mastered', color: 'bg-gradient-to-br from-gold-400 to-saffron-500', icon: '⭐' },
            { status: 'In Progress', color: 'bg-peacock-500', icon: '📚' },
            { status: 'Available', color: 'bg-white border-2 border-peacock-400', icon: '✨' },
            { status: 'Locked', color: 'bg-gray-600', icon: '🔒' },
          ].map((item) => (
            <div key={item.status} className="flex items-center space-x-2 text-white">
              <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-sm`}>
                {item.icon}
              </div>
              <span className="text-sm">{item.status}</span>
            </div>
          ))}
        </motion.div>

        {/* Skill Tree Visualization */}
        <div className="relative" style={{ height: '600px' }}>
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            {mockSkillTree.skills.map((skill) =>
              skill.prereqs?.map((prereqId) => {
                const prereq = mockSkillTree.skills.find(s => s.id === prereqId);
                if (!prereq) return null;
                return (
                  <line
                    key={`${prereqId}-${skill.id}`}
                    x1={`${prereq.x}%`}
                    y1={`${prereq.y}%`}
                    x2={`${skill.x}%`}
                    y2={`${skill.y}%`}
                    stroke={skill.status === 'locked' ? '#4b5563' : '#06b6d4'}
                    strokeWidth="3"
                    strokeDasharray={skill.status === 'locked' ? '5,5' : '0'}
                    opacity={skill.status === 'locked' ? 0.3 : 0.6}
                  />
                );
              })
            )}
          </svg>

          {/* Skill Nodes */}
          {mockSkillTree.skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${skill.x}%`, top: `${skill.y}%`, zIndex: 10 }}
            >
              <Link
                href={skill.status !== 'locked' ? `/student/skills/${skill.id}` : '#'}
                className={`block ${skill.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex flex-col items-center">
                  <div className={`skill-node ${getSkillNodeClass(skill.status)}`}>
                    <span className="text-2xl">{skill.icon}</span>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-white font-semibold text-sm">{skill.name}</div>
                    {skill.status !== 'locked' && (
                      <div className="flex items-center space-x-1 mt-1">
                        {Array.from({ length: skill.maxLevel }).map((_, j) => (
                          <div
                            key={j}
                            className={`w-2 h-2 rounded-full ${
                              j < skill.level
                                ? 'bg-gold-400'
                                : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Selected Skill Detail (placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-peacock-800/50 backdrop-blur-sm rounded-xl p-6 mt-8"
        >
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-peacock-400 to-peacock-600 flex items-center justify-center text-4xl">
              ✖️
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Multiplication</h2>
              <p className="text-peacock-200 mb-4">
                Master multiplication facts and solve multiplication word problems.
              </p>
              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-peacock-300 text-sm">Level Progress</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-32 h-3 bg-peacock-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-gold-400 to-saffron-500 rounded-full" />
                    </div>
                    <span className="text-white font-bold">3/5</span>
                  </div>
                </div>
                <div>
                  <div className="text-peacock-300 text-sm">XP to Next Level</div>
                  <div className="text-gold-400 font-bold mt-1">45 XP</div>
                </div>
              </div>
            </div>
            <Link
              href="/student/skills/4/practice"
              className="px-6 py-3 bg-gradient-to-r from-saffron-500 to-gold-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Practice Now →
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

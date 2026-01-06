'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BADGES, BADGE_CATEGORIES, LEVELS, getLevelForXP, getXPToNextLevel } from '@/data/badges';

// Mock student data
const mockStudent = {
  totalXP: 2450,
  earnedBadges: ['first-steps', 'rising-star', 'consistent-learner', 'week-warrior', 'math-explorer', 'xp-gatherer'],
};

const earnedBadgeIds = new Set(mockStudent.earnedBadges);

export default function AchievementsPage() {
  const currentLevel = getLevelForXP(mockStudent.totalXP);
  const xpProgress = getXPToNextLevel(mockStudent.totalXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);

  const groupedBadges = BADGES.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, typeof BADGES>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/student/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <span>←</span>
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Achievements</h1>
            <div className="flex items-center space-x-2">
              <span className="text-gold-600 font-bold">{mockStudent.earnedBadges.length}</span>
              <span className="text-gray-500">badges earned</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Level Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gold-500 via-saffron-500 to-gold-500 rounded-2xl p-8 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute right-4 top-4 text-8xl opacity-20">{currentLevel.icon}</div>
          <div className="relative z-10">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl">
                {currentLevel.icon}
              </div>
              <div>
                <div className="text-gold-200 text-sm mb-1">Current Level</div>
                <h2 className="text-3xl font-bold">{currentLevel.name}</h2>
                <div className="text-gold-100">Level {currentLevel.level}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{mockStudent.totalXP.toLocaleString()} XP</span>
                {nextLevel && (
                  <span>{nextLevel.xpRequired.toLocaleString()} XP for {nextLevel.name}</span>
                )}
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {LEVELS.map((level) => (
                <div
                  key={level.level}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    level.level <= currentLevel.level
                      ? 'bg-white/20'
                      : 'bg-white/5'
                  }`}
                >
                  <span>{level.icon}</span>
                  <span className="text-sm">{level.level}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Badge Categories */}
        {Object.entries(BADGE_CATEGORIES).map(([category, meta], catIndex) => {
          const badges = groupedBadges[category] || [];
          const earnedInCategory = badges.filter(b => earnedBadgeIds.has(b.id)).length;

          return (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * catIndex }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{meta.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{meta.name} Badges</h2>
                    <p className="text-sm text-gray-500">{meta.description}</p>
                  </div>
                </div>
                <div className="text-gray-500">
                  <span className="font-bold text-gold-600">{earnedInCategory}</span> / {badges.length}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.map((badge, i) => {
                  const isEarned = earnedBadgeIds.has(badge.id);
                  const isSecret = badge.isSecret && !isEarned;

                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * i }}
                      className={`relative p-4 rounded-xl text-center transition-all ${
                        isEarned
                          ? 'bg-gradient-to-b from-gold-50 to-white border-2 border-gold-200 shadow-lg'
                          : isSecret
                          ? 'bg-gray-100 border-2 border-dashed border-gray-300'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-3 ${
                          isEarned
                            ? 'bg-gradient-to-br from-gold-400 to-saffron-500 shadow-lg badge-earned'
                            : isSecret
                            ? 'bg-gray-300'
                            : 'bg-gray-200'
                        }`}
                      >
                        {isSecret ? '?' : isEarned ? '🏆' : '🔒'}
                      </div>
                      <h3 className={`font-semibold text-sm mb-1 ${
                        isEarned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {isSecret ? '???' : badge.name}
                      </h3>
                      <p className={`text-xs ${
                        isEarned ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {isSecret ? 'Secret badge' : badge.description}
                      </p>
                      {isEarned && (
                        <div className="mt-2 text-xs text-gold-600 font-medium">
                          +{badge.xpBonus} XP
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mt-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Achievement Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gold-600">{mockStudent.earnedBadges.length}</div>
              <div className="text-gray-500">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-peacock-600">{mockStudent.totalXP.toLocaleString()}</div>
              <div className="text-gray-500">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-saffron-600">{currentLevel.level}</div>
              <div className="text-gray-500">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-lotus-600">
                {Math.round((mockStudent.earnedBadges.length / BADGES.filter(b => !b.isSecret).length) * 100)}%
              </div>
              <div className="text-gray-500">Completion</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

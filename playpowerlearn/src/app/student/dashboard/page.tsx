'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock student data
const mockStudent = {
  name: 'Aarav',
  grade: '3',
  avatarId: 'peacock',
  totalXP: 2450,
  currentLevel: 3,
  streakDays: 7,
  badges: 12,
  skillsUnlocked: 8,
};

const mockAssignments = [
  { id: '1', title: 'Multiplication Facts', subject: 'Math', dueDate: 'Today', progress: 0, xpReward: 20 },
  { id: '2', title: 'Reading Comprehension', subject: 'Literacy', dueDate: 'Tomorrow', progress: 50, xpReward: 25 },
  { id: '3', title: 'Fractions Practice', subject: 'Math', dueDate: 'Friday', progress: 100, xpReward: 30 },
];

const mockRecentBadges = [
  { id: '1', name: 'First Steps', icon: '🌟', earnedAt: '2 days ago' },
  { id: '2', name: 'Math Whiz', icon: '🧮', earnedAt: '5 days ago' },
  { id: '3', name: 'Week Warrior', icon: '🔥', earnedAt: 'Today' },
];

export default function StudentDashboard() {
  const xpProgress = (mockStudent.totalXP % 1000) / 1000 * 100;
  const xpToNextLevel = 1000 - (mockStudent.totalXP % 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-peacock-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center">
                  <span className="text-lg">🎮</span>
                </div>
                <span className="text-xl font-bold gradient-indian bg-clip-text text-transparent">
                  PlayPowerLearn
                </span>
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/student/practice" className="text-gray-600 hover:text-peacock-600">
                Practice
              </Link>
              <Link href="/student/achievements" className="text-gray-600 hover:text-peacock-600">
                Achievements
              </Link>
              <Link href="/student/skill-tree" className="text-gray-600 hover:text-peacock-600">
                Skill Tree
              </Link>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{mockStudent.name}</div>
                  <div className="text-xs text-gray-500">Level {mockStudent.currentLevel}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-peacock-400 to-peacock-600 flex items-center justify-center text-2xl">
                  🦚
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-peacock-500 via-peacock-600 to-saffron-500 rounded-2xl p-8 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 opacity-10 text-[200px]">🦚</div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🙏</span>
              <h1 className="text-3xl font-bold">Namaste, {mockStudent.name}!</h1>
            </div>
            <p className="text-peacock-100 mb-6">Ready to learn something amazing today?</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{mockStudent.totalXP.toLocaleString()}</div>
                <div className="text-sm text-peacock-100">Total XP</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold">{mockStudent.streakDays}</span>
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="text-sm text-peacock-100">Day Streak</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{mockStudent.badges}</div>
                <div className="text-sm text-peacock-100">Badges</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{mockStudent.skillsUnlocked}</div>
                <div className="text-sm text-peacock-100">Skills</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-saffron-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {mockStudent.currentLevel}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Level {mockStudent.currentLevel}</h2>
                <p className="text-gray-500">{xpToNextLevel} XP to Level {mockStudent.currentLevel + 1}</p>
              </div>
            </div>
            <Link href="/student/achievements" className="text-peacock-600 hover:text-peacock-700 font-medium">
              View Achievements →
            </Link>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-saffron-400 via-gold-500 to-saffron-500 rounded-full"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Activities</h2>
              <div className="space-y-4">
                {mockAssignments.map((assignment) => (
                  <Link key={assignment.id} href={`/student/activities/${assignment.id}`}>
                    <div className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      assignment.progress === 100
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-gray-100 hover:border-peacock-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                            assignment.subject === 'Math'
                              ? 'bg-saffron-100'
                              : 'bg-peacock-100'
                          }`}>
                            {assignment.subject === 'Math' ? '🧮' : '📚'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                            <p className="text-sm text-gray-500">
                              Due: {assignment.dueDate} • +{assignment.xpReward} XP
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {assignment.progress === 100 ? (
                            <span className="flex items-center text-emerald-600 font-medium">
                              <span className="mr-2">✓</span> Complete
                            </span>
                          ) : (
                            <>
                              <div className="w-24">
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-peacock-500 rounded-full"
                                    style={{ width: `${assignment.progress}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-peacock-600 font-medium">
                                {assignment.progress > 0 ? 'Continue' : 'Start'} →
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  href="/student/practice"
                  className="block w-full py-4 text-center bg-gradient-to-r from-peacock-500 to-saffron-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  🎮 Free Practice
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Recent Badges */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Badges</h2>
                <Link href="/student/achievements" className="text-sm text-peacock-600 hover:text-peacock-700">
                  See all
                </Link>
              </div>
              <div className="space-y-3">
                {mockRecentBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-saffron-500 flex items-center justify-center text-2xl shadow-md">
                      {badge.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{badge.name}</div>
                      <div className="text-sm text-gray-500">{badge.earnedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Tree Preview */}
            <div className="bg-gradient-to-br from-peacock-500 to-peacock-700 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-lg font-bold mb-4">Skill Tree</h2>
              <div className="flex justify-around mb-4">
                {['🔵', '🟢', '🟡', '⚪'].map((node, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      i < 2 ? 'bg-white/20' : 'bg-white/5'
                    }`}
                  >
                    {node}
                  </div>
                ))}
              </div>
              <p className="text-peacock-100 text-sm mb-4">
                Unlock new skills by completing activities!
              </p>
              <Link
                href="/student/skill-tree"
                className="block w-full py-2 text-center bg-white text-peacock-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Skill Tree
              </Link>
            </div>

            {/* Daily Challenge */}
            <div className="bg-gradient-to-br from-lotus-400 to-lotus-600 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">⚡</span>
                <h2 className="text-lg font-bold">Daily Challenge</h2>
              </div>
              <p className="text-lotus-100 text-sm mb-4">
                Complete 5 activities today for bonus XP!
              </p>
              <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i <= 2 ? 'bg-white text-lotus-600' : 'bg-white/20 text-white'
                    }`}
                  >
                    {i <= 2 ? '✓' : i}
                  </div>
                ))}
              </div>
              <div className="text-center font-bold text-lg">+100 Bonus XP</div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

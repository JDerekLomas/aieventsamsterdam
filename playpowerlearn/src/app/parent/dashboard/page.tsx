'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock data
const mockChildren = [
  {
    id: '1',
    name: 'Aarav',
    grade: '3',
    avatar: '🦚',
    totalXP: 2450,
    level: 3,
    streakDays: 7,
    recentActivity: 'Completed Multiplication Facts',
    lastActive: '2 hours ago',
    weeklyProgress: 85,
  },
  {
    id: '2',
    name: 'Priya',
    grade: '1',
    avatar: '🦋',
    totalXP: 890,
    level: 1,
    streakDays: 3,
    recentActivity: 'Practiced Addition',
    lastActive: '1 day ago',
    weeklyProgress: 60,
  },
];

const gradeTopics = {
  '3': [
    { name: 'Multiplication & Division', progress: 75, activities: 12 },
    { name: 'Fractions', progress: 40, activities: 8 },
    { name: 'Place Value', progress: 90, activities: 6 },
    { name: 'Measurement', progress: 20, activities: 10 },
  ],
  '1': [
    { name: 'Counting to 100', progress: 95, activities: 8 },
    { name: 'Addition within 20', progress: 70, activities: 10 },
    { name: 'Subtraction within 20', progress: 45, activities: 10 },
    { name: 'Shapes', progress: 30, activities: 6 },
  ],
};

const homeActivities = [
  {
    id: '1',
    title: 'Kitchen Math',
    description: 'Practice fractions while cooking together!',
    duration: '20 min',
    materials: 'Measuring cups, recipe',
    icon: '🍳',
  },
  {
    id: '2',
    title: 'Math Walk',
    description: 'Find shapes and count objects on a neighborhood walk',
    duration: '30 min',
    materials: 'Notebook, pencil',
    icon: '🚶',
  },
  {
    id: '3',
    title: 'Story Problems',
    description: 'Create word problems from everyday situations',
    duration: '15 min',
    materials: 'Paper, crayons',
    icon: '📖',
  },
];

export default function ParentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lotus-50 to-white">
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
              <span className="text-gray-300">|</span>
              <span className="text-gray-600 font-medium">Family Portal</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/parent/resources" className="text-gray-600 hover:text-lotus-600">
                Resources
              </Link>
              <Link href="/parent/activities" className="text-gray-600 hover:text-lotus-600">
                Home Activities
              </Link>
              <Link href="/parent/topics" className="text-gray-600 hover:text-lotus-600">
                Grade Topics
              </Link>
              <div className="w-10 h-10 rounded-full bg-lotus-100 flex items-center justify-center">
                <span>👨‍👩‍👧</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, Parent! 🙏
          </h1>
          <p className="text-gray-600 mt-2">
            Track your children&apos;s progress and discover ways to support their learning at home.
          </p>
        </motion.div>

        {/* Children Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {mockChildren.map((child) => (
            <div key={child.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lotus-400 to-peacock-500 flex items-center justify-center text-3xl">
                    {child.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{child.name}</h2>
                    <p className="text-gray-500">Grade {child.grade} • Level {child.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-saffron-600">
                    <span className="text-lg">🔥</span>
                    <span className="font-bold">{child.streakDays} day streak</span>
                  </div>
                  <p className="text-sm text-gray-500">{child.lastActive}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-peacock-600">{child.totalXP.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total XP</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{child.weeklyProgress}%</div>
                  <div className="text-sm text-gray-500">Weekly Goal</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-lotus-600">{child.level}</div>
                  <div className="text-sm text-gray-500">Level</div>
                </div>
              </div>

              <div className="bg-peacock-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-peacock-600 font-medium mb-1">Recent Activity</div>
                <div className="text-gray-900">{child.recentActivity}</div>
              </div>

              <Link
                href={`/parent/children/${child.id}`}
                className="block w-full py-3 text-center border-2 border-lotus-200 text-lotus-600 font-semibold rounded-lg hover:bg-lotus-50 transition-colors"
              >
                View Full Progress →
              </Link>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Grade Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">What They&apos;re Learning</h2>
                <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>Grade 3 - Aarav</option>
                  <option>Grade 1 - Priya</option>
                </select>
              </div>

              <div className="space-y-4">
                {gradeTopics['3'].map((topic) => (
                  <div key={topic.name} className="p-4 rounded-xl border border-gray-100 hover:border-lotus-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                      <span className="text-sm text-gray-500">{topic.activities} activities</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-lotus-400 to-lotus-600 rounded-full transition-all duration-500"
                          style={{ width: `${topic.progress}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900 w-12">{topic.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/parent/topics"
                className="block mt-6 text-center text-lotus-600 hover:text-lotus-700 font-medium"
              >
                View All Topics & Standards →
              </Link>
            </div>
          </motion.div>

          {/* Home Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                🏠 Home Activities
              </h2>
              <div className="space-y-4">
                {homeActivities.map((activity) => (
                  <Link key={activity.id} href={`/parent/activities/${activity.id}`}>
                    <div className="p-4 rounded-xl border border-gray-100 hover:border-lotus-200 hover:bg-lotus-50/50 transition-all">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-400 to-lotus-500 flex items-center justify-center text-2xl">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>⏱ {activity.duration}</span>
                            <span>📦 {activity.materials}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/parent/activities"
                className="block mt-6 text-center text-lotus-600 hover:text-lotus-700 font-medium"
              >
                View All Activities →
              </Link>
            </div>

            {/* Weekly Report Card */}
            <div className="bg-gradient-to-br from-lotus-500 to-lotus-700 rounded-xl shadow-md p-6 mt-6 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">📊</span>
                <h3 className="text-lg font-bold">Weekly Report</h3>
              </div>
              <p className="text-lotus-100 text-sm mb-4">
                Get a summary of your children&apos;s progress every week.
              </p>
              <button className="w-full py-2 bg-white text-lotus-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                View This Week&apos;s Report
              </button>
            </div>
          </motion.div>
        </div>

        {/* Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-saffron-50 to-lotus-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Parent Resources
              </h2>
              <p className="text-gray-600">
                Tools and guides to help you support your child&apos;s learning journey
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: '📚', title: 'Learning Guides', desc: 'Grade-level overviews' },
                { icon: '🎯', title: 'Standards Explained', desc: 'What to expect' },
                { icon: '💡', title: 'Tips & Tricks', desc: 'Support learning at home' },
                { icon: '📧', title: 'Teacher Connect', desc: 'Communication tools' },
              ].map((resource) => (
                <Link key={resource.title} href="/parent/resources">
                  <div className="bg-white p-6 rounded-xl text-center hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-3">{resource.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

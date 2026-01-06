'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock data for prototype
const mockClassrooms = [
  { id: '1', name: '3rd Grade Math', grade: '3', subject: 'Math', studentCount: 24, activeAssignments: 3 },
  { id: '2', name: '3rd Grade Reading', grade: '3', subject: 'Literacy', studentCount: 24, activeAssignments: 2 },
];

const mockRecentActivity = [
  { id: '1', type: 'submission', student: 'Aarav S.', activity: 'Multiplication Basics', score: 95, time: '10 min ago' },
  { id: '2', type: 'badge', student: 'Priya K.', badge: 'Math Master', time: '25 min ago' },
  { id: '3', type: 'submission', student: 'Rohan P.', activity: 'Fractions Practice', score: 80, time: '1 hour ago' },
  { id: '4', type: 'streak', student: 'Ananya M.', streakDays: 7, time: '2 hours ago' },
];

const quickActions = [
  { title: 'Create Activity', icon: '➕', href: '/teacher/activities/create', color: 'bg-saffron-500' },
  { title: 'Browse Library', icon: '📚', href: '/teacher/activities', color: 'bg-peacock-500' },
  { title: 'New Assignment', icon: '📝', href: '/teacher/assignments/new', color: 'bg-lotus-500' },
  { title: 'View Reports', icon: '📊', href: '/teacher/reports', color: 'bg-emerald-500' },
];

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              <span className="text-gray-600 font-medium">Teacher Portal</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/teacher/activities" className="text-gray-600 hover:text-saffron-600">
                Activities
              </Link>
              <Link href="/teacher/progressions" className="text-gray-600 hover:text-saffron-600">
                Progressions
              </Link>
              <Link href="/teacher/students" className="text-gray-600 hover:text-saffron-600">
                Students
              </Link>
              <Link href="/teacher/reports" className="text-gray-600 hover:text-saffron-600">
                Reports
              </Link>
              <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center">
                <span>👩‍🏫</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Good morning, Teacher! 🙏
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening in your classrooms today.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, i) => (
            <Link key={action.title} href={action.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="card-interactive p-6 text-center"
              >
                <div className={`w-14 h-14 mx-auto rounded-xl ${action.color} flex items-center justify-center text-2xl mb-3`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Classrooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Classrooms</h2>
                <Link href="/teacher/classrooms/new" className="text-saffron-600 hover:text-saffron-700 font-medium text-sm">
                  + Add Classroom
                </Link>
              </div>
              <div className="space-y-4">
                {mockClassrooms.map((classroom) => (
                  <Link key={classroom.id} href={`/teacher/classrooms/${classroom.id}`}>
                    <div className="p-4 rounded-xl border border-gray-100 hover:border-saffron-200 hover:bg-saffron-50/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center text-white font-bold">
                            {classroom.grade}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{classroom.name}</h3>
                            <p className="text-sm text-gray-500">
                              {classroom.studentCount} students • {classroom.activeAssignments} active assignments
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">87%</div>
                            <div className="text-xs text-gray-500">Avg. Score</div>
                          </div>
                          <span className="text-gray-400">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Standards Coverage */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Standards Coverage</h2>
              <div className="space-y-4">
                {[
                  { domain: 'Operations & Algebraic Thinking', progress: 75, color: 'bg-saffron-500' },
                  { domain: 'Number & Operations in Base Ten', progress: 60, color: 'bg-peacock-500' },
                  { domain: 'Fractions', progress: 40, color: 'bg-lotus-500' },
                  { domain: 'Measurement & Data', progress: 30, color: 'bg-gold-500' },
                ].map((standard) => (
                  <div key={standard.domain}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{standard.domain}</span>
                      <span className="font-medium text-gray-900">{standard.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${standard.color} rounded-full transition-all duration-500`}
                        style={{ width: `${standard.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'submission' ? 'bg-emerald-100' :
                      activity.type === 'badge' ? 'bg-gold-100' :
                      'bg-saffron-100'
                    }`}>
                      {activity.type === 'submission' ? '✅' :
                       activity.type === 'badge' ? '🏆' : '🔥'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900">{activity.student}</span>
                        {activity.type === 'submission' && (
                          <> completed <span className="text-peacock-600">{activity.activity}</span> with <span className="text-emerald-600 font-bold">{activity.score}%</span></>
                        )}
                        {activity.type === 'badge' && (
                          <> earned the <span className="text-gold-600 font-bold">{activity.badge}</span> badge!</>
                        )}
                        {activity.type === 'streak' && (
                          <> reached a <span className="text-saffron-600 font-bold">{activity.streakDays}-day</span> streak! 🔥</>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/teacher/activity-feed"
                className="block text-center text-saffron-600 hover:text-saffron-700 font-medium text-sm mt-4"
              >
                View All Activity →
              </Link>
            </div>

            {/* AI Generation Card */}
            <div className="bg-gradient-to-br from-saffron-500 to-peacock-600 rounded-xl shadow-md p-6 mt-6 text-white">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="text-xl font-bold mb-2">Generate with AI</h3>
              <p className="text-white/80 text-sm mb-4">
                Create new practice activities aligned to any Common Core standard in seconds.
              </p>
              <Link
                href="/teacher/activities/generate"
                className="inline-block px-4 py-2 bg-white text-saffron-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Create Activity
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

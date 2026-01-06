'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface StudentProgress {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  activitiesCompleted: number;
  averageScore: number;
  streakDays: number;
  standardsMastered: number;
  lastActive: string;
}

const mockStudents: StudentProgress[] = [
  { id: '1', name: 'Aarav Sharma', avatar: 'A', xp: 2450, level: 5, activitiesCompleted: 45, averageScore: 92, streakDays: 12, standardsMastered: 8, lastActive: '2 hours ago' },
  { id: '2', name: 'Priya Kapoor', avatar: 'P', xp: 2100, level: 4, activitiesCompleted: 38, averageScore: 88, streakDays: 7, standardsMastered: 6, lastActive: '1 hour ago' },
  { id: '3', name: 'Rohan Patel', avatar: 'R', xp: 1850, level: 4, activitiesCompleted: 32, averageScore: 85, streakDays: 5, standardsMastered: 5, lastActive: '3 hours ago' },
  { id: '4', name: 'Ananya Menon', avatar: 'A', xp: 1600, level: 3, activitiesCompleted: 28, averageScore: 82, streakDays: 3, standardsMastered: 4, lastActive: 'Yesterday' },
  { id: '5', name: 'Vikram Thakur', avatar: 'V', xp: 1200, level: 3, activitiesCompleted: 22, averageScore: 78, streakDays: 0, standardsMastered: 3, lastActive: '2 days ago' },
];

interface StandardProgress {
  code: string;
  name: string;
  studentsAttempted: number;
  studentsTotal: number;
  averageScore: number;
  masteredCount: number;
}

const mockStandards: StandardProgress[] = [
  { code: '3.OA.A.1', name: 'Interpret products of whole numbers', studentsAttempted: 24, studentsTotal: 24, averageScore: 87, masteredCount: 18 },
  { code: '3.OA.C.7', name: 'Fluently multiply and divide within 100', studentsAttempted: 22, studentsTotal: 24, averageScore: 82, masteredCount: 14 },
  { code: '3.NF.A.1', name: 'Understand fractions as numbers', studentsAttempted: 20, studentsTotal: 24, averageScore: 75, masteredCount: 10 },
  { code: '3.NBT.A.2', name: 'Fluently add and subtract within 1000', studentsAttempted: 24, studentsTotal: 24, averageScore: 91, masteredCount: 20 },
  { code: '3.MD.C.7', name: 'Relate area to multiplication', studentsAttempted: 16, studentsTotal: 24, averageScore: 68, masteredCount: 6 },
];

type ReportView = 'overview' | 'students' | 'standards';

export default function ReportsPage() {
  const [view, setView] = useState<ReportView>('overview');
  const [selectedClassroom, setSelectedClassroom] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/teacher/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Back to Dashboard
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <span>📊</span>
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Track progress and identify learning gaps</p>
          </div>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500"
          >
            <option value="all">All Classrooms</option>
            <option value="1">3rd Grade Math</option>
            <option value="2">3rd Grade Reading</option>
          </select>
        </motion.div>

        {/* View Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-2 mb-6"
        >
          {(['overview', 'students', 'standards'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === v
                  ? 'bg-saffron-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Overview View */}
        {view === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-4xl font-bold text-saffron-600">24</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-4xl font-bold text-emerald-600">85%</div>
                <div className="text-gray-600">Avg. Score</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-4xl font-bold text-peacock-600">156</div>
                <div className="text-gray-600">Activities Completed</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-4xl font-bold text-lotus-600">12</div>
                <div className="text-gray-600">Standards Covered</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Activity Completion Over Time */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                <div className="h-48 flex items-end justify-around gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const heights = [60, 75, 85, 70, 90, 45, 30];
                    return (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <div
                          className="w-8 bg-gradient-to-t from-saffron-500 to-peacock-500 rounded-t-lg transition-all"
                          style={{ height: `${heights[i]}%` }}
                        />
                        <span className="text-xs text-gray-500">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Score Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
                <div className="space-y-3">
                  {[
                    { range: '90-100%', count: 8, color: 'bg-emerald-500' },
                    { range: '80-89%', count: 10, color: 'bg-peacock-500' },
                    { range: '70-79%', count: 4, color: 'bg-saffron-500' },
                    { range: '60-69%', count: 2, color: 'bg-gold-500' },
                    { range: 'Below 60%', count: 0, color: 'bg-lotus-500' },
                  ].map((item) => (
                    <div key={item.range} className="flex items-center gap-3">
                      <span className="w-24 text-sm text-gray-600">{item.range}</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${(item.count / 24) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-sm font-medium text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="mr-2">⚠️</span>
                Needs Attention
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <h4 className="font-medium text-red-800 mb-2">Struggling Students</h4>
                  <p className="text-sm text-red-600 mb-3">2 students scoring below 70%</p>
                  <div className="flex gap-2">
                    {['Vikram T.', 'Ravi S.'].map((name) => (
                      <span key={name} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <h4 className="font-medium text-yellow-800 mb-2">Struggling Standards</h4>
                  <p className="text-sm text-yellow-600 mb-3">1 standard below 70% class average</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      3.MD.C.7 (68%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Students View */}
        {view === 'students' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Level</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">XP</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Activities</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Avg Score</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Streak</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Mastered</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockStudents.map((student, i) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center text-white font-bold">
                            {student.avatar}
                          </div>
                          <span className="font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-saffron-100 text-saffron-700 font-medium rounded-full text-sm">
                          Lvl {student.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gold-600">
                        {student.xp.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {student.activitiesCompleted}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`font-bold ${
                            student.averageScore >= 90
                              ? 'text-emerald-600'
                              : student.averageScore >= 80
                              ? 'text-peacock-600'
                              : student.averageScore >= 70
                              ? 'text-saffron-600'
                              : 'text-lotus-600'
                          }`}
                        >
                          {student.averageScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {student.streakDays > 0 ? (
                          <span className="text-saffron-600 font-medium">
                            🔥 {student.streakDays}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-emerald-600 font-medium">
                        {student.standardsMastered}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">
                        {student.lastActive}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Standards View */}
        {view === 'standards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="space-y-4">
              {mockStandards.map((standard, i) => (
                <motion.div
                  key={standard.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="px-2 py-1 bg-peacock-100 text-peacock-700 text-sm font-medium rounded-full">
                        {standard.code}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-2">{standard.name}</h3>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-3xl font-bold ${
                          standard.averageScore >= 80
                            ? 'text-emerald-600'
                            : standard.averageScore >= 70
                            ? 'text-saffron-600'
                            : 'text-lotus-600'
                        }`}
                      >
                        {standard.averageScore}%
                      </div>
                      <div className="text-sm text-gray-500">Class Average</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {standard.studentsAttempted}/{standard.studentsTotal}
                      </div>
                      <div className="text-xs text-gray-500">Attempted</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">
                        {standard.masteredCount}
                      </div>
                      <div className="text-xs text-gray-500">Mastered</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-saffron-600">
                        {standard.studentsTotal - standard.masteredCount}
                      </div>
                      <div className="text-xs text-gray-500">In Progress</div>
                    </div>
                  </div>

                  {/* Mastery Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Class Mastery</span>
                      <span className="font-medium">
                        {Math.round((standard.masteredCount / standard.studentsTotal) * 100)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-full"
                        style={{ width: `${(standard.masteredCount / standard.studentsTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

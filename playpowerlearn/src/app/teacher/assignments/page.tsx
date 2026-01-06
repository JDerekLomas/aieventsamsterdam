'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Assignment {
  id: string;
  title: string;
  activityTitle: string;
  classroom: string;
  dueDate: string;
  status: 'active' | 'upcoming' | 'completed';
  studentsCompleted: number;
  totalStudents: number;
  averageScore: number | null;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Multiplication Practice Week 3',
    activityTitle: 'Multiplication Facts: 0-5',
    classroom: '3rd Grade Math',
    dueDate: '2025-01-10',
    status: 'active',
    studentsCompleted: 18,
    totalStudents: 24,
    averageScore: 87,
  },
  {
    id: '2',
    title: 'Fraction Introduction',
    activityTitle: 'Fraction Frenzy',
    classroom: '3rd Grade Math',
    dueDate: '2025-01-12',
    status: 'active',
    studentsCompleted: 12,
    totalStudents: 24,
    averageScore: 72,
  },
  {
    id: '3',
    title: 'Division Word Problems',
    activityTitle: 'Division Word Problems',
    classroom: '3rd Grade Math',
    dueDate: '2025-01-15',
    status: 'upcoming',
    studentsCompleted: 0,
    totalStudents: 24,
    averageScore: null,
  },
  {
    id: '4',
    title: 'Folktales Reading',
    activityTitle: 'Reading Comprehension: Folktales',
    classroom: '3rd Grade Reading',
    dueDate: '2025-01-05',
    status: 'completed',
    studentsCompleted: 24,
    totalStudents: 24,
    averageScore: 91,
  },
];

const statusStyles = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
  upcoming: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Upcoming' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completed' },
};

export default function AssignmentsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const filteredAssignments = mockAssignments.filter(
    (a) => filterStatus === 'all' || a.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/teacher/dashboard" className="text-gray-500 hover:text-gray-700">
                ← Back to Dashboard
              </Link>
            </div>
            <Link
              href="/teacher/assignments/new"
              className="btn-primary flex items-center space-x-2"
            >
              <span>📝</span>
              <span>New Assignment</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
          <p className="text-gray-600 mb-8">
            Manage and track assignments for your classrooms
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-3xl font-bold text-emerald-600">
              {mockAssignments.filter((a) => a.status === 'active').length}
            </div>
            <div className="text-gray-600 text-sm">Active</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-3xl font-bold text-blue-600">
              {mockAssignments.filter((a) => a.status === 'upcoming').length}
            </div>
            <div className="text-gray-600 text-sm">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-3xl font-bold text-gray-600">
              {mockAssignments.filter((a) => a.status === 'completed').length}
            </div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-3xl font-bold text-saffron-600">
              {Math.round(
                mockAssignments
                  .filter((a) => a.averageScore !== null)
                  .reduce((sum, a) => sum + (a.averageScore || 0), 0) /
                  mockAssignments.filter((a) => a.averageScore !== null).length
              )}%
            </div>
            <div className="text-gray-600 text-sm">Avg. Score</div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-2 mb-6"
        >
          {(['all', 'active', 'upcoming', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-saffron-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment, i) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAssignment(assignment)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusStyles[assignment.status].bg
                      } ${statusStyles[assignment.status].text}`}
                    >
                      {statusStyles[assignment.status].label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{assignment.activityTitle}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📚 {assignment.classroom}</span>
                    <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Completion Progress */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {assignment.studentsCompleted}/{assignment.totalStudents}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                    <div className="w-24 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${(assignment.studentsCompleted / assignment.totalStudents) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Average Score */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-saffron-600">
                      {assignment.averageScore !== null ? `${assignment.averageScore}%` : '-'}
                    </div>
                    <div className="text-xs text-gray-500">Avg. Score</div>
                  </div>

                  <span className="text-gray-400">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-6">Create your first assignment to get started</p>
            <Link href="/teacher/assignments/new" className="btn-primary">
              Create Assignment
            </Link>
          </div>
        )}
      </main>

      {/* Assignment Detail Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAssignment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h2>
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-emerald-600">
                      {Math.round((selectedAssignment.studentsCompleted / selectedAssignment.totalStudents) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-saffron-600">
                      {selectedAssignment.averageScore ?? '-'}%
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-peacock-600">
                      {selectedAssignment.totalStudents - selectedAssignment.studentsCompleted}
                    </div>
                    <div className="text-sm text-gray-600">Not Started</div>
                  </div>
                </div>

                {/* Student Progress List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress</h3>
                  <div className="space-y-2 max-h-60 overflow-auto">
                    {['Aarav S.', 'Priya K.', 'Rohan P.', 'Ananya M.', 'Vikram T.'].map((student, i) => (
                      <div
                        key={student}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center text-white text-sm font-bold">
                            {student[0]}
                          </div>
                          <span className="font-medium text-gray-900">{student}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {i < 3 ? (
                            <>
                              <span className="text-emerald-600 font-bold">{85 + i * 5}%</span>
                              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                Completed
                              </span>
                            </>
                          ) : i === 3 ? (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                              In Progress
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              Not Started
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/teacher/reports/assignment/${selectedAssignment.id}`}
                    className="flex-1 text-center px-4 py-3 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors"
                  >
                    View Full Report
                  </Link>
                  <button className="px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                    Send Reminder
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

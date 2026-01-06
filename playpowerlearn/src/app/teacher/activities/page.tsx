'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Subject = 'all' | 'MATH' | 'LITERACY';
type Grade = 'all' | 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
type ActivityType = 'all' | 'MCQ_PRACTICE' | 'GAME' | 'VIDEO' | 'INTERACTIVE';

const mockActivities = [
  {
    id: '1',
    title: 'Multiplication Facts: 0-5',
    description: 'Practice multiplication facts with numbers 0 through 5',
    type: 'MCQ_PRACTICE',
    subject: 'MATH',
    grade: '3',
    difficulty: 'EASY',
    estimatedTime: 15,
    xpReward: 20,
    standards: ['3.OA.A.1', '3.OA.C.7'],
    thumbnail: null,
    isAIGenerated: true,
  },
  {
    id: '2',
    title: 'Fraction Frenzy',
    description: 'Interactive game to understand fractions visually',
    type: 'GAME',
    subject: 'MATH',
    grade: '3',
    difficulty: 'MEDIUM',
    estimatedTime: 20,
    xpReward: 30,
    standards: ['3.NF.A.1', '3.NF.A.2'],
    thumbnail: null,
    isAIGenerated: false,
  },
  {
    id: '3',
    title: 'Reading Comprehension: Folktales',
    description: 'Read and answer questions about traditional Indian folktales',
    type: 'MCQ_PRACTICE',
    subject: 'LITERACY',
    grade: '3',
    difficulty: 'MEDIUM',
    estimatedTime: 25,
    xpReward: 25,
    standards: ['RL.3.2', 'RL.3.3'],
    thumbnail: null,
    isAIGenerated: true,
  },
  {
    id: '4',
    title: 'Place Value Explorer',
    description: 'Understand place value up to thousands',
    type: 'INTERACTIVE',
    subject: 'MATH',
    grade: '2',
    difficulty: 'EASY',
    estimatedTime: 15,
    xpReward: 15,
    standards: ['2.NBT.A.1'],
    thumbnail: null,
    isAIGenerated: false,
  },
  {
    id: '5',
    title: 'Division Word Problems',
    description: 'Solve real-world division problems step by step',
    type: 'MCQ_PRACTICE',
    subject: 'MATH',
    grade: '3',
    difficulty: 'HARD',
    estimatedTime: 20,
    xpReward: 35,
    standards: ['3.OA.A.3', '3.OA.D.8'],
    thumbnail: null,
    isAIGenerated: true,
  },
];

const typeIcons: Record<string, string> = {
  MCQ_PRACTICE: '❓',
  GAME: '🎮',
  VIDEO: '🎬',
  INTERACTIVE: '🔬',
  READING: '📖',
  WORKSHEET: '📄',
  ASSESSMENT: '📋',
};

const difficultyColors: Record<string, string> = {
  EASY: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-gold-100 text-gold-700',
  HARD: 'bg-lotus-100 text-lotus-700',
  ADAPTIVE: 'bg-peacock-100 text-peacock-700',
};

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('all');
  const [selectedGrade, setSelectedGrade] = useState<Grade>('all');
  const [selectedType, setSelectedType] = useState<ActivityType>('all');

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || activity.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || activity.grade === selectedGrade;
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    return matchesSearch && matchesSubject && matchesGrade && matchesType;
  });

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
              href="/teacher/activities/generate"
              className="btn-primary flex items-center space-x-2"
            >
              <span>✨</span>
              <span>Generate with AI</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Library</h1>
          <p className="text-gray-600 mb-8">
            Browse, filter, and assign activities to your classrooms
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
              >
                <option value="all">All Subjects</option>
                <option value="MATH">Math</option>
                <option value="LITERACY">Literacy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as Grade)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
              >
                <option value="all">All Grades</option>
                {['K', '1', '2', '3', '4', '5', '6', '7', '8'].map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ActivityType)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
              >
                <option value="all">All Types</option>
                <option value="MCQ_PRACTICE">MCQ Practice</option>
                <option value="GAME">Game</option>
                <option value="VIDEO">Video</option>
                <option value="INTERACTIVE">Interactive</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Activity Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div className="card-interactive h-full p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center text-2xl">
                    {typeIcons[activity.type]}
                  </div>
                  <div className="flex items-center space-x-2">
                    {activity.isAIGenerated && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        ✨ AI
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[activity.difficulty]}`}>
                      {activity.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{activity.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.standards.map((standard) => (
                    <span key={standard} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {standard}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱ {activity.estimatedTime} min</span>
                  <span className="text-gold-600 font-medium">+{activity.xpReward} XP</span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/teacher/activities/${activity.id}`}
                    className="flex-1 px-4 py-2 text-center border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/teacher/activities/${activity.id}/assign`}
                    className="flex-1 px-4 py-2 text-center bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-medium"
                  >
                    Assign
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or generate new activities with AI</p>
            <Link href="/teacher/activities/generate" className="btn-primary">
              ✨ Generate Activity
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const gradeResources = [
  {
    grade: 'K',
    name: 'Kindergarten',
    mathTopics: ['Counting to 100', 'Shapes & Patterns', 'Comparing Numbers'],
    literacyTopics: ['Letter Recognition', 'Phonics Basics', 'Sight Words'],
    icon: '🌱',
  },
  {
    grade: '1',
    name: '1st Grade',
    mathTopics: ['Addition & Subtraction within 20', 'Place Value', 'Measurement'],
    literacyTopics: ['Reading Fluency', 'Comprehension', 'Writing Sentences'],
    icon: '🌿',
  },
  {
    grade: '2',
    name: '2nd Grade',
    mathTopics: ['Addition within 100', 'Skip Counting', 'Money & Time'],
    literacyTopics: ['Reading Paragraphs', 'Story Elements', 'Spelling Patterns'],
    icon: '🌳',
  },
  {
    grade: '3',
    name: '3rd Grade',
    mathTopics: ['Multiplication & Division', 'Fractions', 'Area & Perimeter'],
    literacyTopics: ['Chapter Books', 'Research Skills', 'Opinion Writing'],
    icon: '🌲',
  },
  {
    grade: '4',
    name: '4th Grade',
    mathTopics: ['Multi-digit Multiplication', 'Decimals', 'Geometry'],
    literacyTopics: ['Inference', 'Summarizing', 'Informative Writing'],
    icon: '🏔️',
  },
  {
    grade: '5',
    name: '5th Grade',
    mathTopics: ['Fraction Operations', 'Volume', 'Coordinate Plane'],
    literacyTopics: ['Literary Analysis', 'Research Papers', 'Argument Writing'],
    icon: '⛰️',
  },
];

const parentGuides = [
  {
    id: '1',
    title: 'Understanding Common Core Math',
    description: 'Learn why math is taught differently and how to help',
    readTime: '10 min read',
    category: 'Math',
    icon: '🧮',
  },
  {
    id: '2',
    title: 'Building Reading Habits at Home',
    description: 'Tips for encouraging daily reading',
    readTime: '8 min read',
    category: 'Literacy',
    icon: '📖',
  },
  {
    id: '3',
    title: 'Managing Screen Time for Learning',
    description: 'Balancing digital and hands-on activities',
    readTime: '6 min read',
    category: 'General',
    icon: '📱',
  },
  {
    id: '4',
    title: 'Homework Help Without Doing It For Them',
    description: 'Strategies for productive homework support',
    readTime: '7 min read',
    category: 'General',
    icon: '✏️',
  },
];

export default function ParentResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lotus-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/parent/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Parent Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to understand what your child is learning and how to support them at home.
          </p>
        </motion.div>

        {/* Grade Level Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📚 What They Learn Each Year
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gradeResources.map((grade, i) => (
              <motion.div
                key={grade.grade}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="bg-white rounded-xl shadow-md p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lotus-400 to-saffron-500 flex items-center justify-center text-2xl">
                      {grade.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{grade.name}</h3>
                      <p className="text-sm text-gray-500">Grade {grade.grade}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-saffron-600 mb-2">Math Topics</h4>
                      <ul className="space-y-1">
                        {grade.mathTopics.map((topic) => (
                          <li key={topic} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-saffron-400 rounded-full mr-2" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-peacock-600 mb-2">Literacy Topics</h4>
                      <ul className="space-y-1">
                        {grade.literacyTopics.map((topic) => (
                          <li key={topic} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-peacock-400 rounded-full mr-2" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={`/parent/resources/grade/${grade.grade}`}
                    className="block mt-4 text-center py-2 border border-lotus-200 text-lotus-600 rounded-lg hover:bg-lotus-50 transition-colors text-sm font-medium"
                  >
                    View Full Curriculum →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Parent Guides */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            💡 Parent Guides
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {parentGuides.map((guide, i) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Link href={`/parent/resources/guides/${guide.id}`}>
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-lotus-100 to-saffron-100 flex items-center justify-center text-3xl">
                        {guide.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {guide.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {guide.readTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{guide.title}</h3>
                        <p className="text-sm text-gray-600">{guide.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-saffron-500 via-lotus-500 to-peacock-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">
              🌟 Quick Tips for Learning at Home
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  tip: 'Make it Daily',
                  desc: 'Even 15 minutes of practice each day builds strong habits',
                  icon: '📅',
                },
                {
                  tip: 'Celebrate Progress',
                  desc: 'Focus on effort and improvement, not just correct answers',
                  icon: '🎉',
                },
                {
                  tip: 'Connect to Life',
                  desc: 'Find math and reading in everyday activities',
                  icon: '🌍',
                },
              ].map((item) => (
                <div key={item.tip} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{item.tip}</h3>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

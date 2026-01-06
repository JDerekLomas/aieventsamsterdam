'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const roles = [
  {
    title: 'Teachers',
    description: 'Discover and assign AI-generated activities, track student progress, and build learning progressions.',
    href: '/teacher/dashboard',
    icon: '👩‍🏫',
    color: 'from-saffron-400 to-saffron-600',
    features: ['Assign Activities', 'Track Progress', 'Build Progressions', 'View Reports'],
  },
  {
    title: 'Students',
    description: 'Learn through gamified practice, earn badges, and build your skill tree while mastering standards.',
    href: '/student/dashboard',
    icon: '🎓',
    color: 'from-peacock-400 to-peacock-600',
    features: ['Practice MCQs', 'Earn Badges', 'Build Skills', 'Track Streaks'],
  },
  {
    title: 'Parents',
    description: 'Explore topics your child is learning, access home activities, and support their educational journey.',
    href: '/parent/dashboard',
    icon: '👨‍👩‍👧',
    color: 'from-lotus-400 to-lotus-600',
    features: ['View Topics', 'Home Activities', 'Track Progress', 'Resources'],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-indian bg-clip-text text-transparent">
                  PlayPowerLearn
                </h1>
                <p className="text-xs text-gray-500">by Play Power Labs</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-saffron-600 font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-saffron-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-peacock-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-lotus-400 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-saffron-100 text-saffron-700 rounded-full text-sm font-medium mb-6">
              ✨ AI-Powered Educational Games
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn Through{' '}
              <span className="gradient-indian bg-clip-text text-transparent">Play</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Gamified learning experiences aligned to Common Core standards.
              AI-generated activities for every grade and subject, featuring
              badges, skill trees, and an Indian-inspired design.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/student/dashboard" className="btn-primary text-lg px-8 py-4">
              Start Learning 🚀
            </Link>
            <Link
              href="#roles"
              className="px-8 py-4 rounded-lg font-semibold text-gray-700 bg-white shadow-md hover:shadow-lg transition-all"
            >
              Explore Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 'K-8', label: 'Grade Levels' },
              { value: '1000+', label: 'Standards Covered' },
              { value: '50+', label: 'Badges to Earn' },
              { value: '∞', label: 'AI Activities' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <div className="text-4xl font-bold gradient-indian bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section id="roles" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Journey
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you&apos;re a teacher looking for engaging content, a student ready to learn,
              or a parent supporting education at home — we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <Link href={role.href}>
                  <div className="card-interactive p-8 h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                      {role.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">
                      {role.title}
                    </h4>
                    <p className="text-gray-600 mb-6">
                      {role.description}
                    </p>
                    <ul className="space-y-2">
                      {role.features.map((feature) => (
                        <li key={feature} className="flex items-center text-gray-700">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <span className="text-saffron-600 font-semibold group-hover:text-saffron-700">
                        Get Started →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-saffron-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Powered by Innovation
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combining the best of AI technology with proven educational practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🤖',
                title: 'AI-Generated Content',
                description: 'Endless variety of practice activities generated by advanced AI',
              },
              {
                icon: '🎯',
                title: 'Common Core Aligned',
                description: 'Every activity mapped to specific learning standards',
              },
              {
                icon: '🏆',
                title: 'Gamified Learning',
                description: 'Badges, XP, streaks, and skill trees keep learners engaged',
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                description: 'Detailed analytics for teachers, students, and parents',
              },
              {
                icon: '🎨',
                title: 'Indian-Inspired Design',
                description: 'Beautiful, culturally-rich visual experience',
              },
              {
                icon: '📱',
                title: 'Works Everywhere',
                description: 'Access on any device — classroom, home, or on the go',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-saffron-500 via-gold-500 to-peacock-500 p-12 rounded-3xl text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Learning?
            </h3>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Join thousands of teachers, students, and parents who are already using
              PlayPowerLearn to make education engaging and effective.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-white text-saffron-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center">
                  <span className="text-xl">🎮</span>
                </div>
                <span className="text-xl font-bold">PlayPowerLearn</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered educational games for K-8 learners, aligned to Common Core standards.
              </p>
              <p className="text-gray-500 text-sm mt-4">
                © 2024 Play Power Labs. All rights reserved.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Teachers</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/teacher/activities" className="hover:text-white">Browse Activities</Link></li>
                <li><Link href="/teacher/progressions" className="hover:text-white">Learning Paths</Link></li>
                <li><Link href="/teacher/reports" className="hover:text-white">Class Reports</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Students</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/student/practice" className="hover:text-white">Practice</Link></li>
                <li><Link href="/student/achievements" className="hover:text-white">Achievements</Link></li>
                <li><Link href="/student/skill-tree" className="hover:text-white">Skill Tree</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Parents</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/parent/resources" className="hover:text-white">Home Resources</Link></li>
                <li><Link href="/parent/topics" className="hover:text-white">Grade Topics</Link></li>
                <li><Link href="/parent/activities" className="hover:text-white">Family Activities</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

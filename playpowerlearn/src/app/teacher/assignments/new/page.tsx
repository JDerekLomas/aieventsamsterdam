'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  title: string;
  subject: string;
  standards: string[];
  estimatedTime: number;
}

interface Classroom {
  id: string;
  name: string;
  studentCount: number;
}

const mockActivities: Activity[] = [
  { id: '1', title: 'Multiplication Facts: 0-5', subject: 'MATH', standards: ['3.OA.A.1', '3.OA.C.7'], estimatedTime: 15 },
  { id: '2', title: 'Fraction Frenzy', subject: 'MATH', standards: ['3.NF.A.1', '3.NF.A.2'], estimatedTime: 20 },
  { id: '3', title: 'Reading Comprehension: Folktales', subject: 'LITERACY', standards: ['RL.3.2', 'RL.3.3'], estimatedTime: 25 },
  { id: '4', title: 'Place Value Explorer', subject: 'MATH', standards: ['2.NBT.A.1'], estimatedTime: 15 },
  { id: '5', title: 'Division Word Problems', subject: 'MATH', standards: ['3.OA.A.3', '3.OA.D.8'], estimatedTime: 20 },
];

const mockClassrooms: Classroom[] = [
  { id: '1', name: '3rd Grade Math', studentCount: 24 },
  { id: '2', name: '3rd Grade Reading', studentCount: 24 },
  { id: '3', name: '2nd Grade Math', studentCount: 22 },
];

export default function NewAssignmentPage() {
  const [step, setStep] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState(3);

  const toggleClassroom = (id: string) => {
    setSelectedClassrooms((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    // TODO: API call to create assignment
    alert('Assignment created! (This would save to the database)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/teacher/assignments" className="text-gray-500 hover:text-gray-700">
              ← Back to Assignments
            </Link>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full ${
                    s === step
                      ? 'bg-saffron-500'
                      : s < step
                      ? 'bg-emerald-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Assignment</h1>
          <p className="text-gray-600 mb-8">
            {step === 1 && 'Select an activity to assign'}
            {step === 2 && 'Choose classrooms and set due date'}
            {step === 3 && 'Review and customize your assignment'}
          </p>
        </motion.div>

        {/* Step 1: Select Activity */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search activities..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                />
              </div>

              <div className="space-y-3">
                {mockActivities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedActivity?.id === activity.id
                        ? 'border-saffron-500 bg-saffron-50'
                        : 'border-gray-100 hover:border-saffron-200 hover:bg-saffron-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span>{activity.subject}</span>
                          <span>•</span>
                          <span>{activity.estimatedTime} min</span>
                          <span>•</span>
                          <span>{activity.standards.join(', ')}</span>
                        </div>
                      </div>
                      {selectedActivity?.id === activity.id && (
                        <span className="text-saffron-500 text-xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => selectedActivity && setStep(2)}
                disabled={!selectedActivity}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedActivity
                    ? 'bg-saffron-500 text-white hover:bg-saffron-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Classrooms */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Classrooms</h2>
              <div className="space-y-3 mb-6">
                {mockClassrooms.map((classroom) => (
                  <button
                    key={classroom.id}
                    onClick={() => toggleClassroom(classroom.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedClassrooms.includes(classroom.id)
                        ? 'border-saffron-500 bg-saffron-50'
                        : 'border-gray-100 hover:border-saffron-200 hover:bg-saffron-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{classroom.name}</h3>
                        <p className="text-sm text-gray-500">{classroom.studentCount} students</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selectedClassrooms.includes(classroom.id)
                            ? 'bg-saffron-500 border-saffron-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedClassrooms.includes(classroom.id) && '✓'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-4">Due Date</h2>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100"
              >
                ← Back
              </button>
              <button
                onClick={() => selectedClassrooms.length > 0 && dueDate && setStep(3)}
                disabled={selectedClassrooms.length === 0 || !dueDate}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedClassrooms.length > 0 && dueDate
                    ? 'bg-saffron-500 text-white hover:bg-saffron-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Customize */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    placeholder={selectedActivity?.title}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions for Students (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Add any special instructions..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Allow Late Submissions</h3>
                    <p className="text-sm text-gray-500">Students can submit after the due date</p>
                  </div>
                  <button
                    onClick={() => setAllowLateSubmission(!allowLateSubmission)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      allowLateSubmission ? 'bg-saffron-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        allowLateSubmission ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Attempts
                  </label>
                  <select
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                  >
                    <option value={1}>1 attempt</option>
                    <option value={2}>2 attempts</option>
                    <option value={3}>3 attempts</option>
                    <option value={5}>5 attempts</option>
                    <option value={-1}>Unlimited</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-saffron-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Activity:</strong> {selectedActivity?.title}</p>
                  <p><strong>Classrooms:</strong> {selectedClassrooms.length} selected</p>
                  <p>
                    <strong>Total Students:</strong>{' '}
                    {mockClassrooms
                      .filter((c) => selectedClassrooms.includes(c.id))
                      .reduce((sum, c) => sum + c.studentCount, 0)}
                  </p>
                  <p><strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100"
              >
                ← Back
              </button>
              <button
                onClick={handleCreate}
                className="px-8 py-3 rounded-lg font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                Create Assignment ✓
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

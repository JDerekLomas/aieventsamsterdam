'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Mock MCQ data
const mockQuestion = {
  id: '1',
  questionText: 'What is 7 × 8?',
  options: [
    { id: 'a', text: '48', isCorrect: false },
    { id: 'b', text: '54', isCorrect: false },
    { id: 'c', text: '56', isCorrect: true },
    { id: 'd', text: '64', isCorrect: false },
  ],
  hint: 'Try breaking it down: 7 × 8 = (7 × 4) × 2',
  explanation: '7 × 8 = 56. You can remember this as 5, 6, 7, 8 → 56 = 7 × 8!',
  standard: '3.OA.C.7',
};

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function PracticePage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [xpEarned, setXpEarned] = useState(0);

  const handleOptionClick = (optionId: string) => {
    if (answerState !== 'unanswered') return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    const selectedOptionData = mockQuestion.options.find(o => o.id === selectedOption);
    if (selectedOptionData?.isCorrect) {
      setAnswerState('correct');
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      setXpEarned(prev => prev + 10);
    } else {
      setAnswerState('incorrect');
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setAnswerState('unanswered');
    setShowHint(false);
    setShowExplanation(false);
  };

  const getOptionClass = (optionId: string) => {
    const baseClass = 'mcq-option flex items-center space-x-4';

    if (answerState === 'unanswered') {
      return `${baseClass} ${selectedOption === optionId ? 'mcq-option-selected' : ''}`;
    }

    const option = mockQuestion.options.find(o => o.id === optionId);
    if (option?.isCorrect) {
      return `${baseClass} mcq-option-correct`;
    }
    if (selectedOption === optionId && !option?.isCorrect) {
      return `${baseClass} mcq-option-incorrect`;
    }
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-peacock-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/student/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <span>←</span>
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⭐</span>
                <span className="font-bold text-gray-900">{score.correct}/{score.total}</span>
              </div>
              <div className="flex items-center space-x-2 text-gold-600">
                <span className="text-2xl">✨</span>
                <span className="font-bold">+{xpEarned} XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {score.total + 1} of 10</span>
            <span>{mockQuestion.standard}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-peacock-400 to-peacock-600 rounded-full transition-all duration-500"
              style={{ width: `${((score.total + 1) / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <div className="text-center mb-8">
            <motion.h2
              key={mockQuestion.id}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-gray-900"
            >
              {mockQuestion.questionText}
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {mockQuestion.options.map((option, i) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleOptionClick(option.id)}
                className={getOptionClass(option.id)}
                disabled={answerState !== 'unanswered'}
              >
                <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                  {option.id.toUpperCase()}
                </span>
                <span className="text-lg font-medium">{option.text}</span>
                {answerState !== 'unanswered' && option.isCorrect && (
                  <span className="ml-auto text-2xl">✓</span>
                )}
                {answerState === 'incorrect' && selectedOption === option.id && !option.isCorrect && (
                  <span className="ml-auto text-2xl">✗</span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Hint Button */}
          {answerState === 'unanswered' && !showHint && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowHint(true)}
              className="mt-6 text-peacock-600 hover:text-peacock-700 font-medium flex items-center space-x-2 mx-auto"
            >
              <span>💡</span>
              <span>Need a hint?</span>
            </motion.button>
          )}

          <AnimatePresence>
            {showHint && answerState === 'unanswered' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-peacock-50 rounded-xl border border-peacock-200"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <div className="font-semibold text-peacock-800 mb-1">Hint</div>
                    <div className="text-peacock-700">{mockQuestion.hint}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Message */}
          <AnimatePresence>
            {answerState !== 'unanswered' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-6 p-6 rounded-xl ${
                  answerState === 'correct'
                    ? 'bg-emerald-50 border-2 border-emerald-200'
                    : 'bg-red-50 border-2 border-red-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">
                    {answerState === 'correct' ? '🎉' : '😊'}
                  </div>
                  <div className="flex-1">
                    <div className={`text-xl font-bold mb-2 ${
                      answerState === 'correct' ? 'text-emerald-800' : 'text-red-800'
                    }`}>
                      {answerState === 'correct' ? 'Excellent!' : 'Keep trying!'}
                    </div>
                    <div className={answerState === 'correct' ? 'text-emerald-700' : 'text-red-700'}>
                      {mockQuestion.explanation}
                    </div>
                    {answerState === 'correct' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-gold-100 rounded-full"
                      >
                        <span className="text-gold-600">+10 XP earned!</span>
                        <span>✨</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {answerState === 'unanswered' ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                selectedOption
                  ? 'bg-peacock-500 text-white hover:bg-peacock-600 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-peacock-500 to-saffron-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              Next Question →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

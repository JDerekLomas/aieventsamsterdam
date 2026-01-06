'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { SteppedProblemItem, WorkedStep } from '@/types/items';

interface SteppedProblemPlayerProps {
  item: SteppedProblemItem;
}

interface StepState {
  response: string;
  isCorrect: boolean | null;
  showHint: boolean;
  attempts: number;
}

export function SteppedProblemPlayer({ item }: SteppedProblemPlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();

  // Track current step and step states
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStates, setStepStates] = useState<StepState[]>(() =>
    item.steps.map(() => ({
      response: '',
      isCorrect: null,
      showHint: false,
      attempts: 0,
    }))
  );

  const currentStep = item.steps[currentStepIndex];
  const currentState = stepStates[currentStepIndex];
  const isLastStep = currentStepIndex === item.steps.length - 1;

  // Update response when step states change
  useEffect(() => {
    setResponse(stepStates.map(s => ({ response: s.response, isCorrect: s.isCorrect })));
  }, [stepStates, setResponse]);

  // Handle input change for current step
  const handleInputChange = (value: string) => {
    if (currentState.isCorrect !== null && !item.allowSkip) {
      return;
    }

    setStepStates(prev => {
      const newStates = [...prev];
      newStates[currentStepIndex] = {
        ...newStates[currentStepIndex],
        response: value,
      };
      return newStates;
    });
  };

  // Check current step answer
  const checkStepAnswer = () => {
    const response = currentState.response.trim().toLowerCase();
    const correctAnswer = currentStep.correctAnswer.toLowerCase();
    const alternates = currentStep.alternateAnswers?.map(a => a.toLowerCase()) || [];

    const isCorrect = response === correctAnswer || alternates.includes(response);

    setStepStates(prev => {
      const newStates = [...prev];
      newStates[currentStepIndex] = {
        ...newStates[currentStepIndex],
        isCorrect,
        attempts: newStates[currentStepIndex].attempts + 1,
      };
      return newStates;
    });

    // If correct and not last step, auto-advance after delay
    if (isCorrect && !isLastStep) {
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1500);
    }

    // If last step, trigger final feedback
    if (isLastStep) {
      const totalCorrect = stepStates.filter((s, i) => i < currentStepIndex ? s.isCorrect : isCorrect).length + (isCorrect ? 1 : 0);
      const totalSteps = item.steps.length;
      const score = Math.round((totalCorrect / totalSteps) * item.maxScore);

      setFeedback(
        totalCorrect === totalSteps ? 'correct' : totalCorrect > 0 ? 'partial' : 'incorrect',
        score,
        totalCorrect === totalSteps
          ? item.correctFeedback || 'Excellent work on all steps!'
          : `Completed ${totalCorrect} of ${totalSteps} steps correctly.`
      );
    }
  };

  // Show hint for current step
  const showHint = () => {
    setStepStates(prev => {
      const newStates = [...prev];
      newStates[currentStepIndex] = {
        ...newStates[currentStepIndex],
        showHint: true,
      };
      return newStates;
    });
  };

  // Skip current step
  const skipStep = () => {
    if (!item.allowSkip) return;

    setStepStates(prev => {
      const newStates = [...prev];
      newStates[currentStepIndex] = {
        ...newStates[currentStepIndex],
        response: currentStep.correctAnswer,
        isCorrect: false, // Mark as incorrect since skipped
      };
      return newStates;
    });

    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';

  return (
    <div className="stepped-problem-player">
      {/* Problem statement */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="problem-statement p-6 rounded-xl mb-6"
        style={{
          backgroundColor: theme.colors.primary[50],
          borderLeft: `4px solid ${theme.colors.primary[500]}`,
        }}
      >
        {item.problem.imageUrl && (
          <img
            src={item.problem.imageUrl}
            alt="Problem diagram"
            className="mb-4 max-w-full rounded-lg"
          />
        )}
        <div
          className="text-lg"
          style={{
            color: theme.colors.text.primary,
            fontFamily: item.problem.latex ? 'KaTeX_Main, serif' : undefined,
          }}
        >
          {item.problem.latex ? (
            <span dangerouslySetInnerHTML={{ __html: item.problem.latex }} />
          ) : (
            item.problem.statement
          )}
        </div>
      </motion.div>

      {/* Step progress */}
      {item.showStepCount && (
        <div className="flex items-center gap-2 mb-6">
          {item.steps.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: stepStates[idx].isCorrect === true
                    ? theme.colors.success[500]
                    : stepStates[idx].isCorrect === false
                    ? theme.colors.error[500]
                    : idx === currentStepIndex
                    ? theme.colors.primary[500]
                    : theme.colors.neutral[200],
                  color: stepStates[idx].isCorrect !== null || idx === currentStepIndex
                    ? '#fff'
                    : theme.colors.text.secondary,
                }}
              >
                {stepStates[idx].isCorrect === true ? '✓' : idx + 1}
              </div>
              {idx < item.steps.length - 1 && (
                <div
                  className="w-8 h-1"
                  style={{
                    backgroundColor: stepStates[idx].isCorrect
                      ? theme.colors.success[300]
                      : theme.colors.neutral[200],
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Previous steps (collapsed) */}
      <AnimatePresence>
        {stepStates.slice(0, currentStepIndex).map((stepState, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="previous-step mb-3 p-4 rounded-lg"
            style={{
              backgroundColor: stepState.isCorrect
                ? theme.colors.success[50]
                : theme.colors.error[50],
              borderLeft: `3px solid ${stepState.isCorrect ? theme.colors.success[500] : theme.colors.error[500]}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Step {idx + 1}:
                </span>
                <span
                  className="ml-2"
                  style={{ color: theme.colors.text.primary }}
                >
                  {item.steps[idx].instruction}
                </span>
              </div>
              <span
                className="font-bold"
                style={{
                  color: stepState.isCorrect
                    ? theme.colors.success[700]
                    : theme.colors.error[700],
                }}
              >
                {stepState.response}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Current step */}
      {isInteractive && currentStepIndex < item.steps.length && (
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="current-step p-6 rounded-xl"
          style={{
            backgroundColor: theme.colors.background.secondary,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: currentState.isCorrect === true
              ? theme.colors.success[500]
              : currentState.isCorrect === false
              ? theme.colors.error[500]
              : theme.colors.primary[300],
          }}
        >
          {/* Step instruction */}
          <div className="mb-4">
            <span
              className="text-sm font-medium"
              style={{ color: theme.colors.primary[600] }}
            >
              Step {currentStepIndex + 1} of {item.steps.length}
            </span>
            <p
              className="text-lg mt-1"
              style={{ color: theme.colors.text.primary }}
            >
              {currentStep.instruction}
            </p>
          </div>

          {/* Show previous answer if configured */}
          {currentStep.showPrevious && currentStepIndex > 0 && (
            <div
              className="mb-4 p-3 rounded-lg"
              style={{
                backgroundColor: theme.colors.neutral[100],
              }}
            >
              <span className="text-sm" style={{ color: theme.colors.text.muted }}>
                Previous result:{' '}
              </span>
              <span className="font-bold" style={{ color: theme.colors.text.primary }}>
                {stepStates[currentStepIndex - 1].response || item.steps[currentStepIndex - 1].correctAnswer}
              </span>
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-4">
            <input
              type={currentStep.inputType === 'numeric' ? 'text' : 'text'}
              inputMode={currentStep.inputType === 'numeric' ? 'decimal' : 'text'}
              value={currentState.response}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentStep.inputPlaceholder || 'Enter your answer...'}
              disabled={currentState.isCorrect !== null}
              className="flex-1 outline-none transition-all"
              style={{
                padding: '12px 16px',
                fontSize: theme.typography.fontSize.lg,
                backgroundColor: theme.colors.background.primary,
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: currentState.isCorrect === true
                  ? theme.colors.success[500]
                  : currentState.isCorrect === false
                  ? theme.colors.error[500]
                  : theme.colors.neutral[300],
                borderRadius: theme.borderRadius.md,
              }}
            />

            {currentState.isCorrect === null && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={checkStepAnswer}
                disabled={!currentState.response.trim()}
                className="px-6 py-3 font-bold transition-all"
                style={{
                  backgroundColor: currentState.response.trim()
                    ? theme.colors.primary[500]
                    : theme.colors.neutral[200],
                  color: currentState.response.trim() ? '#fff' : theme.colors.neutral[400],
                  borderRadius: theme.borderRadius.md,
                  cursor: currentState.response.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Check
              </motion.button>
            )}
          </div>

          {/* Feedback for this step */}
          {currentState.isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: currentState.isCorrect
                  ? theme.colors.success[50]
                  : theme.colors.error[50],
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {currentState.isCorrect ? '✓' : '✗'}
                </span>
                <div>
                  <div
                    className="font-bold"
                    style={{
                      color: currentState.isCorrect
                        ? theme.colors.success[700]
                        : theme.colors.error[700],
                    }}
                  >
                    {currentState.isCorrect ? 'Correct!' : 'Not quite right'}
                  </div>
                  <div
                    className="mt-1"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    {currentStep.explanation}
                  </div>
                  {!currentState.isCorrect && (
                    <div className="mt-2">
                      <span className="text-sm" style={{ color: theme.colors.text.muted }}>
                        The answer is:{' '}
                      </span>
                      <span className="font-bold" style={{ color: theme.colors.text.primary }}>
                        {currentStep.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Hint section */}
          {currentState.showHint && currentStep.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: theme.colors.secondary[50],
                borderLeft: `3px solid ${theme.colors.secondary[500]}`,
              }}
            >
              <div className="flex items-start gap-2">
                <span>💡</span>
                <span style={{ color: theme.colors.secondary[800] }}>
                  {currentStep.hint}
                </span>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          {currentState.isCorrect === null && (
            <div className="flex items-center gap-3 mt-4">
              {currentStep.hint && !currentState.showHint && (
                <button
                  onClick={showHint}
                  className="text-sm px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: theme.colors.secondary[100],
                    color: theme.colors.secondary[700],
                  }}
                >
                  💡 Show hint
                </button>
              )}
              {item.allowSkip && (
                <button
                  onClick={skipStep}
                  className="text-sm px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: theme.colors.neutral[100],
                    color: theme.colors.text.secondary,
                  }}
                >
                  Skip this step
                </button>
              )}
            </div>
          )}

          {/* Continue button (after correct answer, not last step) */}
          {currentState.isCorrect === true && !isLastStep && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setCurrentStepIndex(prev => prev + 1)}
              className="mt-4 px-6 py-3 font-bold transition-all w-full"
              style={{
                backgroundColor: theme.colors.primary[500],
                color: '#fff',
                borderRadius: theme.borderRadius.md,
              }}
            >
              Continue to Step {currentStepIndex + 2} →
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Completion message */}
      {(state.itemState === 'submitted' || state.itemState === 'revealed') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="completion-message p-6 rounded-xl text-center mt-6"
          style={{
            backgroundColor: theme.colors.success[50],
          }}
        >
          <span className="text-4xl">🎉</span>
          <h3
            className="text-xl font-bold mt-2"
            style={{ color: theme.colors.success[700] }}
          >
            Problem Complete!
          </h3>
          <p
            className="mt-1"
            style={{ color: theme.colors.success[600] }}
          >
            You solved {stepStates.filter(s => s.isCorrect).length} of {item.steps.length} steps correctly.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default SteppedProblemPlayer;

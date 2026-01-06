'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { TextEntryItem } from '@/types/items';

interface TextEntryPlayerProps {
  item: TextEntryItem;
}

export function TextEntryPlayer({ item }: TextEntryPlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    let value = e.target.value;

    // Enforce max length
    if (item.maxLength && value.length > item.maxLength) {
      value = value.slice(0, item.maxLength);
    }

    setInputValue(value);
    setResponse(value);
  };

  // Normalize answer for comparison
  const normalizeAnswer = (answer: string): string => {
    let normalized = answer;

    if (item.trimWhitespace) {
      normalized = normalized.trim();
    }

    if (!item.caseSensitive) {
      normalized = normalized.toLowerCase();
    }

    return normalized;
  };

  // Check if answer matches any correct answer
  const checkAnswer = (input: string): boolean => {
    const normalizedInput = normalizeAnswer(input);
    return item.correctAnswers.some(correct =>
      normalizeAnswer(correct) === normalizedInput
    );
  };

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted') {
      if (!inputValue.trim()) {
        setFeedback('incorrect', 0, 'Please enter an answer.');
        return;
      }

      const isCorrect = checkAnswer(inputValue);

      setFeedback(
        isCorrect ? 'correct' : 'incorrect',
        isCorrect ? item.maxScore : 0,
        isCorrect
          ? item.correctFeedback || 'Correct!'
          : item.incorrectFeedback || `The correct answer is: ${item.correctAnswers[0]}`
      );
    }
  }, [state.itemState, inputValue, item, setFeedback]);

  const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';

  // Get border color based on state
  const getBorderColor = () => {
    if (state.feedbackState === 'correct') return theme.colors.success[500];
    if (state.feedbackState === 'incorrect') return theme.colors.error[500];
    if (isFocused) return theme.colors.primary[500];
    return theme.colors.neutral[300];
  };

  const isSentenceInput = item.inputType === 'sentence';

  return (
    <div className="text-entry-player">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {isSentenceInput ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={!isInteractive}
            placeholder={item.placeholder || 'Type your answer here...'}
            rows={3}
            className="w-full transition-all outline-none resize-none"
            style={{
              padding: '16px 20px',
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.normal,
              color: theme.colors.text.primary,
              backgroundColor: isInteractive ? theme.colors.background.primary : theme.colors.neutral[50],
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: getBorderColor(),
              borderRadius: theme.borderRadius.lg,
              lineHeight: theme.typography.lineHeight.relaxed,
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={!isInteractive}
            placeholder={item.placeholder || 'Type your answer...'}
            className="w-full transition-all outline-none"
            style={{
              padding: '16px 20px',
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              backgroundColor: isInteractive ? theme.colors.background.primary : theme.colors.neutral[50],
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: getBorderColor(),
              borderRadius: theme.borderRadius.lg,
            }}
          />
        )}

        {/* Result indicator */}
        {state.feedbackState !== 'none' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-4"
          >
            <span className="text-2xl">
              {state.feedbackState === 'correct' ? '✓' : '✗'}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Character count */}
      {item.maxLength && (
        <div
          className="mt-2 text-right text-sm"
          style={{
            color: inputValue.length > item.maxLength * 0.9
              ? theme.colors.warning[600]
              : theme.colors.text.muted,
          }}
        >
          {inputValue.length} / {item.maxLength}
        </div>
      )}

      {/* Input hints */}
      <div
        className="mt-3 text-sm flex flex-wrap gap-3"
        style={{ color: theme.colors.text.muted }}
      >
        {!item.caseSensitive && (
          <span className="flex items-center gap-1">
            <span>ℹ️</span> Not case-sensitive
          </span>
        )}
        {item.inputType === 'word' && (
          <span className="flex items-center gap-1">
            <span>💡</span> Enter a single word
          </span>
        )}
      </div>

      {/* Revealed answer display */}
      {state.itemState === 'revealed' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.success[50],
            borderLeft: `4px solid ${theme.colors.success[500]}`,
          }}
        >
          <div
            className="text-sm font-medium mb-1"
            style={{ color: theme.colors.success[700] }}
          >
            Accepted answers:
          </div>
          <div style={{ color: theme.colors.success[800] }}>
            {item.correctAnswers.join(', ')}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default TextEntryPlayer;

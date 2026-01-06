'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { NumericEntryItem } from '@/types/items';

interface NumericEntryPlayerProps {
  item: NumericEntryItem;
}

export function NumericEntryPlayer({ item }: NumericEntryPlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    const value = e.target.value;

    // Allow numbers, decimals, negative, and fraction slash
    if (/^-?[\d./]*$/.test(value) || value === '') {
      setInputValue(value);
      setResponse(value);
    }
  };

  // Parse the input value to a number
  const parseInput = (input: string): number | null => {
    if (!input || input.trim() === '') return null;

    // Handle fraction format (e.g., "1/2")
    if (input.includes('/')) {
      const parts = input.split('/');
      if (parts.length === 2) {
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          return numerator / denominator;
        }
      }
      return null;
    }

    const parsed = parseFloat(input);
    return isNaN(parsed) ? null : parsed;
  };

  // Check if answer is within tolerance
  const isWithinTolerance = (value: number): boolean => {
    if (item.toleranceType === 'percentage') {
      const tolerance = item.correctValue * (item.tolerance / 100);
      return Math.abs(value - item.correctValue) <= tolerance;
    }
    return Math.abs(value - item.correctValue) <= item.tolerance;
  };

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted') {
      const parsedValue = parseInput(inputValue);

      if (parsedValue === null) {
        setFeedback('incorrect', 0, 'Please enter a valid number.');
        return;
      }

      const isCorrect = isWithinTolerance(parsedValue);

      setFeedback(
        isCorrect ? 'correct' : 'incorrect',
        isCorrect ? item.maxScore : 0,
        isCorrect
          ? item.correctFeedback || 'Correct!'
          : item.incorrectFeedback || `The correct answer is ${item.correctValue}${item.unit ? ` ${item.unit}` : ''}.`
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

  return (
    <div className="numeric-entry-player">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-xs">
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={!isInteractive}
            placeholder="Enter your answer"
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

          {/* Result indicator */}
          {state.feedbackState !== 'none' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <span className="text-2xl">
                {state.feedbackState === 'correct' ? '✓' : '✗'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Unit display */}
        {item.unit && (
          <span
            className="font-medium"
            style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
            }}
          >
            {item.unit}
          </span>
        )}
      </motion.div>

      {/* Accepted formats hint */}
      <div
        className="mt-3 text-sm"
        style={{ color: theme.colors.text.muted }}
      >
        {item.acceptedFormats.length > 1 && (
          <span>
            Accepted formats: {item.acceptedFormats.map(f => {
              switch (f) {
                case 'decimal': return 'decimal (e.g., 0.5)';
                case 'fraction': return 'fraction (e.g., 1/2)';
                case 'scientific': return 'scientific (e.g., 5e-1)';
                default: return f;
              }
            }).join(', ')}
          </span>
        )}
      </div>

      {/* Number pad for younger ages */}
      {(theme.ageBand === 'k-2' || theme.ageBand === '3-5') && isInteractive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-4 gap-2 max-w-xs"
        >
          {['7', '8', '9', '/', '4', '5', '6', '-', '1', '2', '3', '.', 'C', '0', '⌫'].map((key) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (key === 'C') {
                  setInputValue('');
                  setResponse('');
                } else if (key === '⌫') {
                  const newValue = inputValue.slice(0, -1);
                  setInputValue(newValue);
                  setResponse(newValue);
                } else {
                  const newValue = inputValue + key;
                  setInputValue(newValue);
                  setResponse(newValue);
                }
              }}
              className="p-4 font-bold text-xl transition-colors"
              style={{
                backgroundColor: key === 'C' ? theme.colors.error[100] : theme.colors.neutral[100],
                color: key === 'C' ? theme.colors.error[700] : theme.colors.text.primary,
                borderRadius: theme.borderRadius.md,
              }}
            >
              {key}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default NumericEntryPlayer;

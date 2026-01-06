'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { SingleChoiceItem } from '@/types/items';

interface SingleChoicePlayerProps {
  item: SingleChoiceItem;
}

export function SingleChoicePlayer({ item }: SingleChoicePlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Shuffle options if needed (only on mount)
  const [options] = useState(() => {
    if (item.shuffle) {
      return [...item.options].sort(() => Math.random() - 0.5);
    }
    return item.options;
  });

  // Handle selection
  const handleSelect = (optionId: string) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }
    setSelectedId(optionId);
    setResponse(optionId);
  };

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted' && selectedId) {
      const isCorrect = selectedId === item.correctOptionId;
      const selectedOption = item.options.find(o => o.id === selectedId);
      const correctOption = item.options.find(o => o.id === item.correctOptionId);

      setFeedback(
        isCorrect ? 'correct' : 'incorrect',
        isCorrect ? item.maxScore : 0,
        isCorrect
          ? item.correctFeedback || 'Great job!'
          : selectedOption?.feedback || item.incorrectFeedback || `The correct answer is: ${correctOption?.text}`
      );
    }
  }, [state.itemState, selectedId, item, setFeedback]);

  // Get option state for styling
  const getOptionState = (optionId: string) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      if (optionId === item.correctOptionId) {
        return 'correct';
      }
      if (optionId === selectedId && optionId !== item.correctOptionId) {
        return 'incorrect';
      }
      return 'neutral';
    }
    if (optionId === selectedId) {
      return 'selected';
    }
    return 'default';
  };

  // Layout class based on item configuration
  const layoutClass = item.layout === 'horizontal'
    ? 'flex flex-row flex-wrap gap-4'
    : item.layout === 'grid'
    ? 'grid grid-cols-2 gap-4'
    : 'flex flex-col gap-3';

  return (
    <div className={`single-choice-player ${layoutClass}`}>
      {options.map((option, index) => {
        const optionState = getOptionState(option.id);
        const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';

        return (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(option.id)}
            disabled={!isInteractive}
            className="option-button relative flex items-center gap-4 text-left w-full transition-all"
            style={{
              minHeight: theme.components.option.minHeight,
              padding: theme.components.option.padding,
              borderRadius: theme.components.option.borderRadius,
              borderWidth: theme.components.option.borderWidth,
              borderStyle: 'solid',
              borderColor: getOptionBorderColor(optionState, theme),
              backgroundColor: getOptionBgColor(optionState, theme),
              cursor: isInteractive ? 'pointer' : 'default',
              transform: optionState === 'selected' ? `scale(${theme.components.option.selectedScale})` : 'scale(1)',
            }}
            whileHover={isInteractive ? { scale: 1.01 } : {}}
            whileTap={isInteractive ? { scale: 0.99 } : {}}
          >
            {/* Option indicator (A, B, C, D) */}
            <div
              className="option-indicator flex-shrink-0 flex items-center justify-center font-bold"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: theme.borderRadius.full,
                backgroundColor: getIndicatorBgColor(optionState, theme),
                color: getIndicatorTextColor(optionState, theme),
                fontSize: theme.typography.fontSize.base,
              }}
            >
              {optionState === 'correct' ? '✓' :
               optionState === 'incorrect' ? '✗' :
               String.fromCharCode(65 + index)}
            </div>

            {/* Option content */}
            <div className="option-content flex-1">
              {option.imageUrl ? (
                <div className="flex items-center gap-3">
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span style={{ color: theme.colors.text.primary }}>
                    {option.text}
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.fontSize.lg,
                  }}
                >
                  {option.richText ? (
                    <span dangerouslySetInnerHTML={{ __html: option.richText }} />
                  ) : (
                    option.text
                  )}
                </span>
              )}
            </div>

            {/* Correct/Incorrect indicator */}
            {(optionState === 'correct' || optionState === 'incorrect') && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="flex-shrink-0"
              >
                <span className="text-2xl">
                  {optionState === 'correct' ? '✓' : '✗'}
                </span>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Helper functions for styling
function getOptionBorderColor(state: string, theme: any): string {
  switch (state) {
    case 'selected':
      return theme.colors.primary[500];
    case 'correct':
      return theme.colors.success[500];
    case 'incorrect':
      return theme.colors.error[500];
    default:
      return theme.colors.neutral[200];
  }
}

function getOptionBgColor(state: string, theme: any): string {
  switch (state) {
    case 'selected':
      return theme.colors.primary[50];
    case 'correct':
      return theme.colors.success[50];
    case 'incorrect':
      return theme.colors.error[50];
    default:
      return theme.colors.background.primary;
  }
}

function getIndicatorBgColor(state: string, theme: any): string {
  switch (state) {
    case 'selected':
      return theme.colors.primary[500];
    case 'correct':
      return theme.colors.success[500];
    case 'incorrect':
      return theme.colors.error[500];
    default:
      return theme.colors.neutral[100];
  }
}

function getIndicatorTextColor(state: string, theme: any): string {
  switch (state) {
    case 'selected':
    case 'correct':
    case 'incorrect':
      return '#ffffff';
    default:
      return theme.colors.text.secondary;
  }
}

export default SingleChoicePlayer;

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { MultipleChoiceItem } from '@/types/items';

interface MultipleChoicePlayerProps {
  item: MultipleChoiceItem;
}

export function MultipleChoicePlayer({ item }: MultipleChoicePlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Shuffle options if needed (only on mount)
  const [options] = useState(() => {
    if (item.shuffle) {
      return [...item.options].sort(() => Math.random() - 0.5);
    }
    return item.options;
  });

  // Handle selection toggle
  const handleToggle = (optionId: string) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    let newSelected: string[];
    if (selectedIds.includes(optionId)) {
      newSelected = selectedIds.filter(id => id !== optionId);
    } else {
      // Check max selections
      if (selectedIds.length >= item.maxSelections) {
        // Replace the oldest selection
        newSelected = [...selectedIds.slice(1), optionId];
      } else {
        newSelected = [...selectedIds, optionId];
      }
    }

    setSelectedIds(newSelected);
    setResponse(newSelected);
  };

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted' && selectedIds.length > 0) {
      const correctSet = new Set(item.correctOptionIds);
      const selectedSet = new Set(selectedIds);

      // Calculate score based on partial credit
      let correctCount = 0;
      let incorrectCount = 0;

      selectedIds.forEach(id => {
        if (correctSet.has(id)) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      });

      const missedCount = item.correctOptionIds.length - correctCount;
      const isAllCorrect = correctCount === item.correctOptionIds.length && incorrectCount === 0;
      const isPartiallyCorrect = correctCount > 0 && !isAllCorrect;

      let score = 0;
      if (item.partialCredit) {
        // Partial credit: each correct answer worth equal portion, minus incorrect
        const pointsPerCorrect = item.maxScore / item.correctOptionIds.length;
        score = Math.max(0, (correctCount * pointsPerCorrect) - (incorrectCount * pointsPerCorrect * 0.5));
      } else {
        score = isAllCorrect ? item.maxScore : 0;
      }

      const feedbackState = isAllCorrect ? 'correct' : isPartiallyCorrect ? 'partial' : 'incorrect';
      const message = isAllCorrect
        ? item.correctFeedback || 'All correct!'
        : isPartiallyCorrect
        ? `You got ${correctCount} out of ${item.correctOptionIds.length} correct.`
        : item.incorrectFeedback || `The correct answers were: ${item.correctOptionIds.map(id => item.options.find(o => o.id === id)?.text).join(', ')}`;

      setFeedback(feedbackState, Math.round(score), message);
    }
  }, [state.itemState, selectedIds, item, setFeedback]);

  // Get option state for styling
  const getOptionState = (optionId: string) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      if (item.correctOptionIds.includes(optionId)) {
        return 'correct';
      }
      if (selectedIds.includes(optionId) && !item.correctOptionIds.includes(optionId)) {
        return 'incorrect';
      }
      return 'neutral';
    }
    if (selectedIds.includes(optionId)) {
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
    <div className={`multiple-choice-player ${layoutClass}`}>
      <div className="mb-4 text-sm" style={{ color: theme.colors.text.secondary }}>
        Select {item.minSelections === item.maxSelections
          ? `exactly ${item.minSelections}`
          : `${item.minSelections} to ${item.maxSelections}`} answers
        {selectedIds.length > 0 && ` (${selectedIds.length} selected)`}
      </div>

      {options.map((option, index) => {
        const optionState = getOptionState(option.id);
        const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';
        const isSelected = selectedIds.includes(option.id);

        return (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleToggle(option.id)}
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
              transform: isSelected ? `scale(${theme.components.option.selectedScale})` : 'scale(1)',
            }}
            whileHover={isInteractive ? { scale: 1.01 } : {}}
            whileTap={isInteractive ? { scale: 0.99 } : {}}
          >
            {/* Checkbox indicator */}
            <div
              className="option-indicator flex-shrink-0 flex items-center justify-center"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: theme.borderRadius.sm,
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: getIndicatorBorderColor(optionState, theme),
                backgroundColor: isSelected ? getIndicatorBgColor(optionState, theme) : 'transparent',
              }}
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-white text-sm font-bold"
                >
                  {optionState === 'correct' ? '✓' :
                   optionState === 'incorrect' ? '✗' : '✓'}
                </motion.span>
              )}
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

            {/* Result indicator */}
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

function getIndicatorBorderColor(state: string, theme: any): string {
  switch (state) {
    case 'selected':
      return theme.colors.primary[500];
    case 'correct':
      return theme.colors.success[500];
    case 'incorrect':
      return theme.colors.error[500];
    default:
      return theme.colors.neutral[300];
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

export default MultipleChoicePlayer;

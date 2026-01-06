'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { GapMatchItem } from '@/types/items';

interface GapMatchPlayerProps {
  item: GapMatchItem;
}

interface GapState {
  [gapId: string]: string | null; // draggableId or null
}

export function GapMatchPlayer({ item }: GapMatchPlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();

  // Track which draggable is in which gap
  const [gapState, setGapState] = useState<GapState>(() => {
    const initial: GapState = {};
    item.gaps.forEach(gap => {
      initial[gap.id] = null;
    });
    return initial;
  });

  // Track available draggables (not yet placed)
  const [selectedDraggable, setSelectedDraggable] = useState<string | null>(null);

  // Get available draggables
  const getAvailableDraggables = () => {
    const usedDraggables = Object.values(gapState).filter(Boolean) as string[];
    if (item.reuseDraggables) {
      return item.draggables;
    }
    return item.draggables.filter(d => !usedDraggables.includes(d.id));
  };

  // Update response when gap state changes
  useEffect(() => {
    setResponse(gapState);
  }, [gapState, setResponse]);

  // Handle clicking on a gap
  const handleGapClick = (gapId: string) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    if (selectedDraggable) {
      // Place the selected draggable in this gap
      setGapState(prev => ({
        ...prev,
        [gapId]: selectedDraggable,
      }));
      setSelectedDraggable(null);
    } else if (gapState[gapId]) {
      // Remove the draggable from this gap
      setGapState(prev => ({
        ...prev,
        [gapId]: null,
      }));
    }
  };

  // Handle clicking on a draggable
  const handleDraggableClick = (draggableId: string) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    if (selectedDraggable === draggableId) {
      setSelectedDraggable(null);
    } else {
      setSelectedDraggable(draggableId);
    }
  };

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted') {
      let correctCount = 0;
      item.gaps.forEach(gap => {
        if (gapState[gap.id] === gap.correctDraggableId) {
          correctCount++;
        }
      });

      const totalGaps = item.gaps.length;
      const isAllCorrect = correctCount === totalGaps;
      const score = item.partialCredit
        ? Math.round((correctCount / totalGaps) * item.maxScore)
        : isAllCorrect ? item.maxScore : 0;

      const feedbackState = isAllCorrect ? 'correct' : correctCount > 0 ? 'partial' : 'incorrect';

      setFeedback(
        feedbackState,
        score,
        isAllCorrect
          ? item.correctFeedback || 'All gaps filled correctly!'
          : item.incorrectFeedback || `${correctCount} of ${totalGaps} gaps correct.`
      );
    }
  }, [state.itemState, gapState, item, setFeedback]);

  const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';
  const availableDraggables = getAvailableDraggables();

  // Parse text with gaps
  const renderTextWithGaps = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /\{\{gap:(\w+)\}\}/g;
    let match;

    while ((match = regex.exec(item.textWithGaps)) !== null) {
      // Add text before the gap
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {item.textWithGaps.slice(lastIndex, match.index)}
          </span>
        );
      }

      const gapId = match[1];
      const gap = item.gaps.find(g => g.id === gapId);
      const filledDraggableId = gapState[gapId];
      const filledDraggable = filledDraggableId
        ? item.draggables.find(d => d.id === filledDraggableId)
        : null;

      // Get gap state for styling
      let gapResultState = 'default';
      if (state.itemState === 'submitted' || state.itemState === 'revealed') {
        if (filledDraggableId === gap?.correctDraggableId) {
          gapResultState = 'correct';
        } else if (filledDraggableId) {
          gapResultState = 'incorrect';
        }
      }

      // Add the gap
      parts.push(
        <motion.button
          key={`gap-${gapId}`}
          onClick={() => handleGapClick(gapId)}
          disabled={!isInteractive}
          className="inline-flex items-center justify-center mx-1 transition-all"
          style={{
            minWidth: '100px',
            padding: '4px 12px',
            backgroundColor: filledDraggable
              ? getGapBgColor(gapResultState, theme)
              : theme.colors.neutral[100],
            borderWidth: '2px',
            borderStyle: selectedDraggable ? 'dashed' : 'solid',
            borderColor: selectedDraggable
              ? theme.colors.primary[500]
              : getGapBorderColor(gapResultState, theme),
            borderRadius: theme.borderRadius.md,
            cursor: isInteractive ? 'pointer' : 'default',
          }}
          whileHover={isInteractive ? { scale: 1.05 } : {}}
          whileTap={isInteractive ? { scale: 0.95 } : {}}
        >
          <AnimatePresence mode="wait">
            {filledDraggable ? (
              <motion.span
                key={filledDraggable.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="font-medium"
                style={{
                  color: getGapTextColor(gapResultState, theme),
                }}
              >
                {filledDraggable.text}
                {filledDraggable.imageUrl && (
                  <img
                    src={filledDraggable.imageUrl}
                    alt=""
                    className="inline-block w-6 h-6 ml-1"
                  />
                )}
              </motion.span>
            ) : (
              <motion.span
                key="empty"
                style={{ color: theme.colors.neutral[400] }}
              >
                _______
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < item.textWithGaps.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {item.textWithGaps.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className="gap-match-player">
      {/* Text with gaps */}
      <div
        className="gap-match-text p-6 rounded-lg mb-6"
        style={{
          backgroundColor: theme.colors.background.secondary,
          fontSize: theme.typography.fontSize.lg,
          lineHeight: '2.5',
          color: theme.colors.text.primary,
        }}
      >
        {renderTextWithGaps()}
      </div>

      {/* Draggable bank */}
      <div
        className="draggable-bank p-4 rounded-lg"
        style={{
          backgroundColor: theme.colors.neutral[50],
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme.colors.neutral[200],
        }}
      >
        <div
          className="text-sm font-medium mb-3"
          style={{ color: theme.colors.text.secondary }}
        >
          {selectedDraggable ? 'Click on a gap to place, or click again to deselect' : 'Click an item, then click a gap to fill it'}
        </div>

        <div className="flex flex-wrap gap-3">
          {availableDraggables.map((draggable) => {
            const isSelected = selectedDraggable === draggable.id;

            return (
              <motion.button
                key={draggable.id}
                onClick={() => handleDraggableClick(draggable.id)}
                disabled={!isInteractive}
                className="flex items-center gap-2 transition-all"
                style={{
                  padding: '8px 16px',
                  backgroundColor: isSelected
                    ? theme.colors.primary[100]
                    : theme.colors.background.primary,
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: isSelected
                    ? theme.colors.primary[500]
                    : theme.colors.neutral[200],
                  borderRadius: theme.borderRadius.md,
                  cursor: isInteractive ? 'pointer' : 'default',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isSelected ? `0 0 0 3px ${theme.colors.primary[200]}` : 'none',
                }}
                whileHover={isInteractive ? { scale: isSelected ? 1.05 : 1.02 } : {}}
                whileTap={isInteractive ? { scale: 0.98 } : {}}
              >
                {draggable.imageUrl && (
                  <img
                    src={draggable.imageUrl}
                    alt=""
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span
                  style={{
                    color: theme.colors.text.primary,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {draggable.text}
                </span>
              </motion.button>
            );
          })}

          {availableDraggables.length === 0 && !item.reuseDraggables && (
            <span style={{ color: theme.colors.text.muted }}>
              All items placed. Click a gap to remove an item.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getGapBorderColor(state: string, theme: any): string {
  switch (state) {
    case 'correct':
      return theme.colors.success[500];
    case 'incorrect':
      return theme.colors.error[500];
    default:
      return theme.colors.neutral[300];
  }
}

function getGapBgColor(state: string, theme: any): string {
  switch (state) {
    case 'correct':
      return theme.colors.success[100];
    case 'incorrect':
      return theme.colors.error[100];
    default:
      return theme.colors.primary[50];
  }
}

function getGapTextColor(state: string, theme: any): string {
  switch (state) {
    case 'correct':
      return theme.colors.success[800];
    case 'incorrect':
      return theme.colors.error[800];
    default:
      return theme.colors.primary[800];
  }
}

export default GapMatchPlayer;

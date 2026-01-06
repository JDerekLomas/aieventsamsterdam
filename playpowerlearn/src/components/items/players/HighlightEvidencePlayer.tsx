'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { HighlightEvidenceItem, TextRange } from '@/types/items';

interface HighlightEvidencePlayerProps {
  item: HighlightEvidenceItem;
}

interface Selection {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
}

export function HighlightEvidencePlayer({ item }: HighlightEvidencePlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();

  // Track user selections
  const [selections, setSelections] = useState<Selection[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setIsSelecting(false);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setIsSelecting(false);
      return;
    }

    // Find the start index in the passage
    const passageElement = document.getElementById('passage-text');
    if (!passageElement) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(passageElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const startIndex = preSelectionRange.toString().length;
    const endIndex = startIndex + text.length;

    // Check if selection overlaps with existing
    const hasOverlap = selections.some(
      sel =>
        (startIndex >= sel.startIndex && startIndex < sel.endIndex) ||
        (endIndex > sel.startIndex && endIndex <= sel.endIndex) ||
        (startIndex <= sel.startIndex && endIndex >= sel.endIndex)
    );

    if (!hasOverlap && selections.length < item.requiredEvidence) {
      const newSelection: Selection = {
        id: `sel-${Date.now()}`,
        startIndex,
        endIndex,
        text,
      };

      setSelections(prev => [...prev, newSelection]);
    }

    // Clear browser selection
    selection.removeAllRanges();
    setIsSelecting(false);
  }, [state.itemState, selections, item.requiredEvidence]);

  // Remove a selection
  const removeSelection = (id: string) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }
    setSelections(prev => prev.filter(s => s.id !== id));
  };

  // Update response when selections change
  useEffect(() => {
    setResponse(selections);
  }, [selections, setResponse]);

  // Check if a selection matches any correct range
  const checkSelectionCorrect = (selection: Selection): boolean => {
    return item.correctRanges.some(range => {
      // Allow some tolerance for selection boundaries
      const tolerance = 5;
      return (
        Math.abs(selection.startIndex - range.startIndex) <= tolerance &&
        Math.abs(selection.endIndex - range.endIndex) <= tolerance
      );
    });
  };

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted') {
      let correctCount = 0;
      const matchedRanges = new Set<string>();

      selections.forEach(selection => {
        item.correctRanges.forEach(range => {
          if (!matchedRanges.has(range.id)) {
            const tolerance = 10;
            const startMatch = Math.abs(selection.startIndex - range.startIndex) <= tolerance;
            const endMatch = Math.abs(selection.endIndex - range.endIndex) <= tolerance;

            if (startMatch && endMatch) {
              correctCount++;
              matchedRanges.add(range.id);
            }
          }
        });
      });

      const totalRequired = item.correctRanges.length;
      const isAllCorrect = correctCount === totalRequired;
      const score = item.partialCredit
        ? correctCount * item.partialCreditPerRange
        : isAllCorrect ? item.maxScore : 0;

      setFeedback(
        isAllCorrect ? 'correct' : correctCount > 0 ? 'partial' : 'incorrect',
        Math.min(score, item.maxScore),
        isAllCorrect
          ? item.correctFeedback || 'You found all the evidence!'
          : `You identified ${correctCount} of ${totalRequired} pieces of evidence.`
      );
    }
  }, [state.itemState, selections, item, setFeedback]);

  const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';

  // Render passage with highlights
  const renderPassageWithHighlights = () => {
    const text = item.passage.text;
    let result: React.ReactNode[] = [];
    let lastIndex = 0;

    // Merge all ranges (selections and correct ranges for reveal)
    type RangeWithMeta = TextRange & { type: 'selection' | 'correct'; selectionId?: string };
    let ranges: RangeWithMeta[] = [];

    // Add user selections
    selections.forEach(sel => {
      ranges.push({
        id: sel.id,
        startIndex: sel.startIndex,
        endIndex: sel.endIndex,
        text: sel.text,
        type: 'selection',
        selectionId: sel.id,
      });
    });

    // Add correct ranges if revealed
    if (state.itemState === 'revealed') {
      item.correctRanges.forEach(range => {
        ranges.push({
          ...range,
          type: 'correct',
        });
      });
    }

    // Sort by start index
    ranges.sort((a, b) => a.startIndex - b.startIndex);

    // Remove overlaps (keep first)
    const nonOverlapping: RangeWithMeta[] = [];
    ranges.forEach(range => {
      const hasOverlap = nonOverlapping.some(
        r => range.startIndex < r.endIndex && range.endIndex > r.startIndex
      );
      if (!hasOverlap) {
        nonOverlapping.push(range);
      }
    });

    // Render
    nonOverlapping.forEach((range, idx) => {
      // Add text before this range
      if (range.startIndex > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {text.slice(lastIndex, range.startIndex)}
          </span>
        );
      }

      // Add highlighted range
      const isCorrect = range.type === 'correct' || (
        state.itemState !== 'pristine' && state.itemState !== 'interacting' &&
        checkSelectionCorrect({ id: range.id, startIndex: range.startIndex, endIndex: range.endIndex, text: range.text })
      );

      const isUserSelection = range.type === 'selection';

      result.push(
        <motion.mark
          key={range.id}
          initial={{ backgroundColor: 'transparent' }}
          animate={{
            backgroundColor: range.type === 'correct'
              ? theme.colors.success[200]
              : isCorrect
              ? theme.colors.success[200]
              : state.feedbackState !== 'none'
              ? theme.colors.error[200]
              : theme.colors.primary[200],
          }}
          className="relative rounded px-0.5 cursor-pointer"
          style={{
            borderBottom: `2px solid ${
              range.type === 'correct'
                ? theme.colors.success[500]
                : isCorrect
                ? theme.colors.success[500]
                : state.feedbackState !== 'none'
                ? theme.colors.error[500]
                : theme.colors.primary[500]
            }`,
          }}
          onClick={() => isUserSelection && isInteractive && removeSelection(range.id)}
        >
          {text.slice(range.startIndex, range.endIndex)}
          {isUserSelection && isInteractive && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removeSelection(range.id);
              }}
            >
              ×
            </span>
          )}
        </motion.mark>
      );

      lastIndex = range.endIndex;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(
        <span key="text-end">{text.slice(lastIndex)}</span>
      );
    }

    return result;
  };

  return (
    <div className="highlight-evidence-player">
      {/* Claim/Question */}
      <div
        className="claim-box p-4 rounded-lg mb-6"
        style={{
          backgroundColor: theme.colors.secondary[50],
          borderLeft: `4px solid ${theme.colors.secondary[500]}`,
        }}
      >
        <div
          className="text-sm font-medium mb-1"
          style={{ color: theme.colors.secondary[700] }}
        >
          Find evidence to support this claim:
        </div>
        <div
          className="text-lg font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          {item.claim}
        </div>
      </div>

      {/* Selection indicator */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="text-sm"
          style={{ color: theme.colors.text.secondary }}
        >
          {isInteractive ? (
            <>
              Highlight {item.requiredEvidence} piece{item.requiredEvidence !== 1 ? 's' : ''} of evidence
              {selections.length > 0 && ` (${selections.length} selected)`}
            </>
          ) : (
            `${selections.length} piece${selections.length !== 1 ? 's' : ''} of evidence selected`
          )}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: item.requiredEvidence }).map((_, idx) => (
            <div
              key={idx}
              className="w-3 h-3 rounded-full transition-colors"
              style={{
                backgroundColor: idx < selections.length
                  ? theme.colors.primary[500]
                  : theme.colors.neutral[200],
              }}
            />
          ))}
        </div>
      </div>

      {/* Passage */}
      <div
        id="passage-text"
        className="passage p-6 rounded-xl"
        style={{
          backgroundColor: theme.colors.background.secondary,
          fontSize: theme.typography.fontSize.lg,
          lineHeight: theme.typography.lineHeight.relaxed,
          color: theme.colors.text.primary,
          cursor: isInteractive ? 'text' : 'default',
          userSelect: isInteractive ? 'text' : 'none',
        }}
        onMouseUp={handleMouseUp}
        onMouseDown={() => isInteractive && setIsSelecting(true)}
      >
        {/* Passage title */}
        {item.passage.title && (
          <h3
            className="text-xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            {item.passage.title}
          </h3>
        )}

        {/* Passage content with highlights */}
        <div className="passage-content">
          {renderPassageWithHighlights()}
        </div>

        {/* Source */}
        {item.passage.source && (
          <div
            className="mt-4 text-sm italic"
            style={{ color: theme.colors.text.muted }}
          >
            — {item.passage.source}
          </div>
        )}
      </div>

      {/* Selected evidence summary */}
      {selections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6"
        >
          <div
            className="text-sm font-medium mb-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Your selected evidence:
          </div>
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {selections.map((selection, idx) => {
                const isCorrect = state.feedbackState !== 'none' && checkSelectionCorrect(selection);

                return (
                  <motion.div
                    key={selection.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: isCorrect
                        ? theme.colors.success[50]
                        : state.feedbackState !== 'none'
                        ? theme.colors.error[50]
                        : theme.colors.neutral[50],
                      borderLeft: `3px solid ${
                        isCorrect
                          ? theme.colors.success[500]
                          : state.feedbackState !== 'none'
                          ? theme.colors.error[500]
                          : theme.colors.primary[500]
                      }`,
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{ color: theme.colors.primary[600] }}
                    >
                      {idx + 1}.
                    </span>
                    <span
                      className="flex-1 text-sm"
                      style={{ color: theme.colors.text.primary }}
                    >
                      &quot;{selection.text}&quot;
                    </span>
                    {isInteractive && (
                      <button
                        onClick={() => removeSelection(selection.id)}
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors"
                        style={{
                          backgroundColor: theme.colors.error[100],
                          color: theme.colors.error[600],
                        }}
                      >
                        ×
                      </button>
                    )}
                    {state.feedbackState !== 'none' && (
                      <span className="text-lg">
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Tip */}
      {isInteractive && selections.length === 0 && (
        <div
          className="mt-4 text-sm flex items-center gap-2"
          style={{ color: theme.colors.text.muted }}
        >
          <span>💡</span>
          <span>Click and drag to highlight text in the passage</span>
        </div>
      )}
    </div>
  );
}

export default HighlightEvidencePlayer;

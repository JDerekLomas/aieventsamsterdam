'use client';

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemPlayerProvider, useItemPlayer, useItemTheme } from './ItemPlayerContext';
import type { BaseItem, AgeBand, ItemResponse } from '@/types/items';
import { generateCSSVariables } from '@/lib/themes';

// Item type components (we'll create these)
import { SingleChoicePlayer } from './players/SingleChoicePlayer';
import { MultipleChoicePlayer } from './players/MultipleChoicePlayer';
import { NumericEntryPlayer } from './players/NumericEntryPlayer';
import { TextEntryPlayer } from './players/TextEntryPlayer';
import { OrderPlayer } from './players/OrderPlayer';
import { GapMatchPlayer } from './players/GapMatchPlayer';
import { NumberLinePlayer } from './players/NumberLinePlayer';
import { BaseTenBlocksPlayer } from './players/BaseTenBlocksPlayer';
import { FractionBarsPlayer } from './players/FractionBarsPlayer';
import { SteppedProblemPlayer } from './players/SteppedProblemPlayer';
import { HighlightEvidencePlayer } from './players/HighlightEvidencePlayer';

// ============================================
// ITEM PLAYER WRAPPER (with provider)
// ============================================

interface ItemPlayerProps {
  item: BaseItem;
  ageBand?: AgeBand;
  onComplete?: (response: ItemResponse) => void;
  onNext?: () => void;
  showProgress?: boolean;
  currentIndex?: number;
  totalItems?: number;
  className?: string;
}

export function ItemPlayer({
  item,
  ageBand,
  onComplete,
  onNext,
  showProgress = true,
  currentIndex = 0,
  totalItems = 1,
  className = '',
}: ItemPlayerProps) {
  const effectiveAgeBand = ageBand || item.ageBand;

  return (
    <ItemPlayerProvider initialAgeBand={effectiveAgeBand} onComplete={onComplete}>
      <ItemPlayerInner
        item={item}
        onNext={onNext}
        showProgress={showProgress}
        currentIndex={currentIndex}
        totalItems={totalItems}
        className={className}
      />
    </ItemPlayerProvider>
  );
}

// ============================================
// ITEM PLAYER INNER
// ============================================

interface ItemPlayerInnerProps {
  item: BaseItem;
  onNext?: () => void;
  showProgress: boolean;
  currentIndex: number;
  totalItems: number;
  className: string;
}

function ItemPlayerInner({
  item,
  onNext,
  showProgress,
  currentIndex,
  totalItems,
  className,
}: ItemPlayerInnerProps) {
  const { state, setItem, canRetry, retry, isComplete } = useItemPlayer();
  const theme = useItemTheme();

  // Set item on mount/change
  useEffect(() => {
    setItem(item);
  }, [item, setItem]);

  // Generate CSS variables
  const cssVars = useMemo(() => generateCSSVariables(theme), [theme]);

  // Apply theme CSS variables
  const style = useMemo(() => {
    const vars: Record<string, string> = {};
    Object.entries(cssVars).forEach(([key, value]) => {
      vars[key] = value;
    });
    return vars;
  }, [cssVars]);

  return (
    <div
      className={`item-player ${className}`}
      style={style as React.CSSProperties}
    >
      {/* Progress Bar */}
      {showProgress && totalItems > 1 && (
        <ItemProgressBar current={currentIndex + 1} total={totalItems} />
      )}

      {/* Main Content */}
      <div className="item-player-content">
        {/* Stem */}
        <ItemStemDisplay />

        {/* Hints */}
        <ItemHintsDisplay />

        {/* Item Type Renderer */}
        <ItemTypeRenderer />

        {/* Feedback */}
        <ItemFeedbackDisplay />
      </div>

      {/* Actions */}
      <ItemActionsBar onNext={onNext} canRetry={canRetry} retry={retry} isComplete={isComplete} />
    </div>
  );
}

// ============================================
// PROGRESS BAR
// ============================================

function ItemProgressBar({ current, total }: { current: number; total: number }) {
  const theme = useItemTheme();
  const percentage = (current / total) * 100;

  return (
    <div className="item-progress-container mb-6">
      <div className="flex justify-between text-sm mb-2" style={{ color: theme.colors.text.secondary }}>
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div
        className="w-full overflow-hidden"
        style={{
          height: theme.components.progress.height,
          backgroundColor: theme.colors.neutral[200],
          borderRadius: theme.components.progress.borderRadius,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            backgroundColor: theme.colors.primary[500],
            borderRadius: theme.components.progress.borderRadius,
          }}
        />
      </div>
    </div>
  );
}

// ============================================
// STEM DISPLAY
// ============================================

function ItemStemDisplay() {
  const { state } = useItemPlayer();
  const theme = useItemTheme();

  if (!state.item) return null;

  const { stem } = state.item;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="item-stem mb-8"
    >
      {stem.imageUrl && (
        <div className="mb-4">
          <img
            src={stem.imageUrl}
            alt={state.item.altText || 'Question image'}
            className="max-w-full rounded-lg"
            style={{ borderRadius: theme.borderRadius.lg }}
          />
        </div>
      )}

      <div
        className="item-stem-text"
        style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          lineHeight: theme.typography.lineHeight.relaxed,
        }}
      >
        {stem.richText ? (
          <div dangerouslySetInnerHTML={{ __html: stem.richText }} />
        ) : (
          <p>{stem.text}</p>
        )}
      </div>

      {stem.audioUrl && theme.gamification.celebrationLevel !== 'none' && (
        <button
          className="mt-2 flex items-center gap-2 text-sm"
          style={{ color: theme.colors.primary[600] }}
        >
          🔊 Listen
        </button>
      )}
    </motion.div>
  );
}

// ============================================
// HINTS DISPLAY
// ============================================

function ItemHintsDisplay() {
  const { state, useHint, canUseHint, nextHintLevel } = useItemPlayer();
  const theme = useItemTheme();

  if (!state.item || !state.showHints || state.item.hints.length === 0) {
    return null;
  }

  const displayedHints = state.item.hints.filter((_, i) => state.hintsUsed.includes(i + 1));

  return (
    <div className="item-hints mb-6">
      <AnimatePresence>
        {displayedHints.map((hint, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-4 rounded-lg"
            style={{
              backgroundColor: theme.colors.secondary[50],
              borderLeft: `4px solid ${theme.colors.secondary[500]}`,
              borderRadius: theme.borderRadius.md,
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: theme.colors.secondary[700] }}
                >
                  Hint {hint.level}
                </div>
                <div style={{ color: theme.colors.secondary[800] }}>
                  {hint.text}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {canUseHint && nextHintLevel && state.itemState !== 'submitted' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => useHint(nextHintLevel)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: theme.colors.secondary[100],
            color: theme.colors.secondary[700],
          }}
        >
          💡 {state.hintsUsed.length === 0 ? 'Need a hint?' : 'Get another hint'}
          {state.item.hints[nextHintLevel - 1]?.xpPenalty > 0 && (
            <span className="text-xs opacity-70">
              (-{state.item.hints[nextHintLevel - 1].xpPenalty} XP)
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
}

// ============================================
// ITEM TYPE RENDERER
// ============================================

function ItemTypeRenderer() {
  const { state } = useItemPlayer();

  if (!state.item) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Render appropriate player based on item type
  switch (state.item.type) {
    case 'single-choice':
      return <SingleChoicePlayer item={state.item as any} />;
    case 'multiple-choice':
      return <MultipleChoicePlayer item={state.item as any} />;
    case 'numeric-entry':
      return <NumericEntryPlayer item={state.item as any} />;
    case 'text-entry':
      return <TextEntryPlayer item={state.item as any} />;
    case 'order':
      return <OrderPlayer item={state.item as any} />;
    case 'gap-match':
      return <GapMatchPlayer item={state.item as any} />;
    case 'number-line':
      return <NumberLinePlayer item={state.item as any} />;
    case 'base-ten-blocks':
      return <BaseTenBlocksPlayer item={state.item as any} />;
    case 'fraction-bars':
      return <FractionBarsPlayer item={state.item as any} />;
    case 'stepped-problem':
      return <SteppedProblemPlayer item={state.item as any} />;
    case 'highlight-evidence':
      return <HighlightEvidencePlayer item={state.item as any} />;
    default:
      return (
        <div className="text-center py-8 text-gray-500">
          Item type &quot;{state.item.type}&quot; is not yet implemented.
        </div>
      );
  }
}

// ============================================
// FEEDBACK DISPLAY
// ============================================

function ItemFeedbackDisplay() {
  const { state } = useItemPlayer();
  const theme = useItemTheme();

  if (state.feedbackState === 'none') {
    return null;
  }

  const isCorrect = state.feedbackState === 'correct';
  const isPartial = state.feedbackState === 'partial';

  const bgColor = isCorrect
    ? theme.colors.success[50]
    : isPartial
    ? theme.colors.warning[50]
    : theme.colors.error[50];

  const borderColor = isCorrect
    ? theme.colors.success[500]
    : isPartial
    ? theme.colors.warning[500]
    : theme.colors.error[500];

  const textColor = isCorrect
    ? theme.colors.success[800]
    : isPartial
    ? theme.colors.warning[800]
    : theme.colors.error[800];

  const icon = isCorrect
    ? theme.components.feedback.correctIcon
    : theme.components.feedback.incorrectIcon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: parseFloat(theme.components.feedback.animationDuration) / 1000 }}
      className="item-feedback mt-6 p-6 rounded-xl"
      style={{
        backgroundColor: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: theme.borderRadius.lg,
      }}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <div
            className="text-lg font-bold mb-1"
            style={{ color: textColor }}
          >
            {isCorrect ? 'Excellent!' : isPartial ? 'Partially correct' : 'Not quite right'}
          </div>
          {state.feedbackMessage && (
            <div style={{ color: textColor }}>
              {state.feedbackMessage}
            </div>
          )}
          {isCorrect && theme.gamification.showXP && state.item && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
              style={{
                backgroundColor: theme.colors.primary[100],
                color: theme.colors.primary[700],
              }}
            >
              ✨ +{state.item.xpReward - (state.hintsUsed.length * 5)} XP earned!
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ACTIONS BAR
// ============================================

interface ItemActionsBarProps {
  onNext?: () => void;
  canRetry: boolean;
  retry: () => void;
  isComplete: boolean;
}

function ItemActionsBar({ onNext, canRetry, retry, isComplete }: ItemActionsBarProps) {
  const { state, submit, canSubmit, reveal } = useItemPlayer();
  const theme = useItemTheme();

  return (
    <div className="item-actions flex justify-center gap-4 mt-8">
      {state.itemState === 'pristine' || state.itemState === 'interacting' ? (
        <>
          <motion.button
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            onClick={submit}
            disabled={!canSubmit}
            className="px-8 py-3 rounded-xl font-bold transition-all"
            style={{
              backgroundColor: canSubmit ? theme.colors.primary[500] : theme.colors.neutral[200],
              color: canSubmit ? '#fff' : theme.colors.neutral[400],
              fontSize: theme.components.button.fontSize,
              borderRadius: theme.components.button.borderRadius,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            Check Answer
          </motion.button>
        </>
      ) : (
        <>
          {canRetry && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={retry}
              className="px-6 py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: theme.colors.neutral[100],
                color: theme.colors.text.primary,
                borderRadius: theme.components.button.borderRadius,
              }}
            >
              Try Again ({state.maxAttempts - state.attemptCount} left)
            </motion.button>
          )}

          {isComplete && onNext && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="px-8 py-3 rounded-xl font-bold transition-all"
              style={{
                backgroundColor: theme.colors.primary[500],
                color: '#fff',
                borderRadius: theme.components.button.borderRadius,
              }}
            >
              Next Question →
            </motion.button>
          )}

          {!isComplete && !canRetry && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reveal}
              className="px-6 py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: theme.colors.neutral[100],
                color: theme.colors.text.primary,
                borderRadius: theme.components.button.borderRadius,
              }}
            >
              Show Answer
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}

export default ItemPlayer;

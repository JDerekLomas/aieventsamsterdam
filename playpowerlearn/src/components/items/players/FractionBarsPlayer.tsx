'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { FractionBarsItem } from '@/types/items';

interface FractionBarsPlayerProps {
  item: FractionBarsItem;
}

interface FractionPart {
  denominator: number;
  selectedParts: number;
}

export function FractionBarsPlayer({ item }: FractionBarsPlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();

  // Track selected fraction parts
  const [fraction, setFraction] = useState<FractionPart>({
    denominator: item.availableDenominators[0] || item.targetFraction.denominator,
    selectedParts: 0,
  });

  // Denominator colors
  const denominatorColors: Record<number, string> = {
    2: theme.colors.primary[400],
    3: theme.colors.secondary[400],
    4: theme.colors.success[400],
    5: theme.colors.warning[400],
    6: theme.colors.error[400],
    8: theme.colors.primary[500],
    10: theme.colors.secondary[500],
    12: theme.colors.success[500],
  };

  // Calculate current fraction value
  const currentValue = fraction.selectedParts / fraction.denominator;
  const targetValue = item.targetFraction.numerator / item.targetFraction.denominator;

  // Update response when fraction changes
  useEffect(() => {
    setResponse({
      numerator: fraction.selectedParts,
      denominator: fraction.denominator,
      value: currentValue,
    });
  }, [fraction, currentValue, setResponse]);

  // Change denominator
  const changeDenominator = (newDenominator: number) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    setFraction({
      denominator: newDenominator,
      selectedParts: 0,
    });
  };

  // Toggle a part
  const togglePart = (index: number) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    // If clicking a part equal to or before the selected count, deselect from there
    if (index < fraction.selectedParts) {
      setFraction(prev => ({
        ...prev,
        selectedParts: index,
      }));
    } else {
      // Select up to and including this part
      setFraction(prev => ({
        ...prev,
        selectedParts: index + 1,
      }));
    }
  };

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted') {
      const tolerance = 0.001;
      const isCorrect = Math.abs(currentValue - targetValue) < tolerance;

      // Check for equivalent fractions
      const isEquivalent = fraction.selectedParts * item.targetFraction.denominator ===
        item.targetFraction.numerator * fraction.denominator;

      setFeedback(
        isCorrect || isEquivalent ? 'correct' : 'incorrect',
        isCorrect || isEquivalent ? item.maxScore : 0,
        isCorrect || isEquivalent
          ? item.correctFeedback || `Correct! ${fraction.selectedParts}/${fraction.denominator} equals ${item.targetFraction.numerator}/${item.targetFraction.denominator}`
          : item.incorrectFeedback || `You showed ${fraction.selectedParts}/${fraction.denominator}. The target is ${item.targetFraction.numerator}/${item.targetFraction.denominator}.`
      );
    }
  }, [state.itemState, fraction, currentValue, targetValue, item, setFeedback]);

  const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';

  // Simplify a fraction for display
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const simplify = (num: number, den: number) => {
    const g = gcd(num, den);
    return { numerator: num / g, denominator: den / g };
  };

  return (
    <div className="fraction-bars-player">
      {/* Target fraction display */}
      <div
        className="target-display p-4 rounded-lg mb-6 text-center"
        style={{
          backgroundColor: theme.colors.secondary[50],
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: theme.colors.secondary[300],
        }}
      >
        <div
          className="text-sm font-medium mb-2"
          style={{ color: theme.colors.secondary[700] }}
        >
          {item.interactionMode === 'build'
            ? 'Build this fraction:'
            : item.interactionMode === 'compare'
            ? 'Create a fraction equal to:'
            : 'Show:'}
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div
              className="text-4xl font-bold border-b-4"
              style={{
                color: theme.colors.text.primary,
                borderColor: theme.colors.text.primary,
                paddingBottom: '4px',
              }}
            >
              {item.targetFraction.numerator}
            </div>
            <div
              className="text-4xl font-bold mt-1"
              style={{ color: theme.colors.text.primary }}
            >
              {item.targetFraction.denominator}
            </div>
          </div>
        </div>
      </div>

      {/* Denominator selector */}
      <div className="denominator-selector mb-6">
        <div
          className="text-sm font-medium mb-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Choose how many parts to divide the whole into:
        </div>
        <div className="flex flex-wrap gap-2">
          {item.availableDenominators.map((denom) => (
            <motion.button
              key={denom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changeDenominator(denom)}
              disabled={!isInteractive}
              className="px-4 py-2 rounded-lg font-bold transition-all"
              style={{
                backgroundColor: fraction.denominator === denom
                  ? denominatorColors[denom] || theme.colors.primary[500]
                  : theme.colors.neutral[100],
                color: fraction.denominator === denom
                  ? '#fff'
                  : theme.colors.text.primary,
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: fraction.denominator === denom
                  ? denominatorColors[denom] || theme.colors.primary[500]
                  : theme.colors.neutral[200],
                cursor: isInteractive ? 'pointer' : 'default',
              }}
            >
              {denom} parts
            </motion.button>
          ))}
        </div>
      </div>

      {/* Fraction bar visualization */}
      <div
        className="fraction-bar-container p-6 rounded-xl mb-6"
        style={{
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        {/* The whole (reference) */}
        <div className="mb-4">
          <div
            className="text-xs font-medium mb-1"
            style={{ color: theme.colors.text.muted }}
          >
            1 whole
          </div>
          <div
            className="h-12 rounded-lg"
            style={{
              backgroundColor: theme.colors.neutral[300],
            }}
          />
        </div>

        {/* Interactive fraction bar */}
        <div className="mb-4">
          <div
            className="text-xs font-medium mb-1"
            style={{ color: theme.colors.text.muted }}
          >
            Your fraction: {fraction.selectedParts}/{fraction.denominator}
            {fraction.selectedParts > 0 && fraction.denominator !== simplify(fraction.selectedParts, fraction.denominator).denominator && (
              <span className="ml-2">
                = {simplify(fraction.selectedParts, fraction.denominator).numerator}/{simplify(fraction.selectedParts, fraction.denominator).denominator}
              </span>
            )}
          </div>
          <div
            className="h-12 rounded-lg flex overflow-hidden"
            style={{
              backgroundColor: theme.colors.neutral[200],
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: Math.abs(currentValue - targetValue) < 0.001
                ? theme.colors.success[500]
                : theme.colors.neutral[300],
            }}
          >
            {Array.from({ length: fraction.denominator }).map((_, index) => {
              const isSelected = index < fraction.selectedParts;
              const color = denominatorColors[fraction.denominator] || theme.colors.primary[500];

              return (
                <motion.button
                  key={index}
                  onClick={() => togglePart(index)}
                  disabled={!isInteractive}
                  className="flex-1 h-full transition-colors relative"
                  style={{
                    backgroundColor: isSelected ? color : 'transparent',
                    borderRight: index < fraction.denominator - 1
                      ? `1px solid ${theme.colors.neutral[400]}`
                      : 'none',
                    cursor: isInteractive ? 'pointer' : 'default',
                  }}
                  whileHover={isInteractive ? { opacity: 0.8 } : {}}
                  whileTap={isInteractive ? { scale: 0.95 } : {}}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Show labels */}
        {item.showLabels && (
          <div className="flex justify-between text-xs" style={{ color: theme.colors.text.muted }}>
            <span>0</span>
            {Array.from({ length: fraction.denominator - 1 }).map((_, i) => (
              <span key={i}>{i + 1}/{fraction.denominator}</span>
            ))}
            <span>1</span>
          </div>
        )}
      </div>

      {/* Visual comparison when equivalent */}
      {item.showEquivalent && fraction.selectedParts > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="equivalent-display p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.primary[50],
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.primary[200],
          }}
        >
          <div
            className="text-sm font-medium mb-2"
            style={{ color: theme.colors.primary[700] }}
          >
            Equivalent fractions:
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Show equivalent fractions */}
            {item.availableDenominators
              .filter(d => d !== fraction.denominator)
              .map(denom => {
                const equivNumerator = (fraction.selectedParts * denom) / fraction.denominator;
                if (Number.isInteger(equivNumerator) && equivNumerator <= denom) {
                  return (
                    <div
                      key={denom}
                      className="text-center p-2 rounded-lg"
                      style={{ backgroundColor: theme.colors.background.primary }}
                    >
                      <div
                        className="text-lg font-bold border-b-2"
                        style={{
                          color: theme.colors.text.primary,
                          borderColor: theme.colors.text.secondary,
                        }}
                      >
                        {equivNumerator}
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {denom}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {isInteractive && (
        <div
          className="mt-4 text-sm flex items-center gap-2"
          style={{ color: theme.colors.text.muted }}
        >
          <span>💡</span>
          <span>Click on parts of the bar to select or deselect them</span>
        </div>
      )}

      {/* Match indicator */}
      {Math.abs(currentValue - targetValue) < 0.001 && fraction.selectedParts > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 p-3 rounded-lg text-center"
          style={{
            backgroundColor: theme.colors.success[100],
          }}
        >
          <span className="text-lg">✨</span>
          <span
            className="ml-2 font-medium"
            style={{ color: theme.colors.success[700] }}
          >
            That&apos;s equivalent to the target fraction!
          </span>
        </motion.div>
      )}
    </div>
  );
}

export default FractionBarsPlayer;

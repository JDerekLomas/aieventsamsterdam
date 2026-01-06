'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { BaseTenBlocksItem } from '@/types/items';

interface BaseTenBlocksPlayerProps {
  item: BaseTenBlocksItem;
}

interface BlockCount {
  ones: number;
  tens: number;
  hundreds: number;
  thousands: number;
}

export function BaseTenBlocksPlayer({ item }: BaseTenBlocksPlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();

  // Track placed blocks
  const [placedBlocks, setPlacedBlocks] = useState<BlockCount>({
    ones: 0,
    tens: 0,
    hundreds: 0,
    thousands: 0,
  });

  // Calculate current value
  const currentValue =
    placedBlocks.ones +
    placedBlocks.tens * 10 +
    placedBlocks.hundreds * 100 +
    placedBlocks.thousands * 1000;

  // Update response when blocks change
  useEffect(() => {
    setResponse({ blocks: placedBlocks, value: currentValue });
  }, [placedBlocks, currentValue, setResponse]);

  // Add a block
  const addBlock = (type: keyof BlockCount) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    if (placedBlocks[type] < item.availableBlocks[type]) {
      setPlacedBlocks(prev => ({
        ...prev,
        [type]: prev[type] + 1,
      }));
    }
  };

  // Remove a block
  const removeBlock = (type: keyof BlockCount) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    if (placedBlocks[type] > 0) {
      setPlacedBlocks(prev => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
    }
  };

  // Regroup blocks (e.g., 10 ones → 1 ten)
  const regroup = (from: keyof BlockCount, to: keyof BlockCount, ratio: number) => {
    if (!item.allowRegrouping) return;
    if (state.itemState === 'submitted' || state.itemState === 'revealed') return;

    if (placedBlocks[from] >= ratio && placedBlocks[to] < item.availableBlocks[to]) {
      setPlacedBlocks(prev => ({
        ...prev,
        [from]: prev[from] - ratio,
        [to]: prev[to] + 1,
      }));
    }
  };

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted') {
      const isCorrect = currentValue === item.targetValue;

      setFeedback(
        isCorrect ? 'correct' : 'incorrect',
        isCorrect ? item.maxScore : 0,
        isCorrect
          ? item.correctFeedback || `Correct! ${item.targetValue} is the right answer!`
          : item.incorrectFeedback || `You made ${currentValue}. The target is ${item.targetValue}.`
      );
    }
  }, [state.itemState, currentValue, item, setFeedback]);

  const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';

  // Block configurations
  const blockTypes: { key: keyof BlockCount; label: string; value: number; color: string; size: { w: number; h: number } }[] = [
    { key: 'thousands', label: 'Thousands', value: 1000, color: theme.colors.primary[600], size: { w: 60, h: 60 } },
    { key: 'hundreds', label: 'Hundreds', value: 100, color: theme.colors.primary[500], size: { w: 50, h: 50 } },
    { key: 'tens', label: 'Tens', value: 10, color: theme.colors.primary[400], size: { w: 40, h: 12 } },
    { key: 'ones', label: 'Ones', value: 1, color: theme.colors.primary[300], size: { w: 12, h: 12 } },
  ];

  return (
    <div className="base-ten-blocks-player">
      {/* Target display */}
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
          className="text-sm font-medium mb-1"
          style={{ color: theme.colors.secondary[700] }}
        >
          Build this number:
        </div>
        <div
          className="text-4xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          {item.targetValue.toLocaleString()}
        </div>
      </div>

      {/* Current value display */}
      {item.showValue && (
        <div
          className="current-value p-4 rounded-lg mb-6 text-center"
          style={{
            backgroundColor: currentValue === item.targetValue
              ? theme.colors.success[50]
              : theme.colors.background.secondary,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: currentValue === item.targetValue
              ? theme.colors.success[500]
              : theme.colors.neutral[200],
          }}
        >
          <div
            className="text-sm font-medium mb-1"
            style={{ color: theme.colors.text.secondary }}
          >
            Your value:
          </div>
          <div
            className="text-3xl font-bold"
            style={{
              color: currentValue === item.targetValue
                ? theme.colors.success[600]
                : theme.colors.text.primary,
            }}
          >
            {currentValue.toLocaleString()}
            {currentValue === item.targetValue && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-2"
              >
                ✓
              </motion.span>
            )}
          </div>
        </div>
      )}

      {/* Block bank */}
      <div className="block-bank grid grid-cols-4 gap-4 mb-6">
        {blockTypes.map(({ key, label, value, color, size }) => {
          const available = item.availableBlocks[key] - placedBlocks[key];
          const placed = placedBlocks[key];

          return (
            <div
              key={key}
              className="block-type p-3 rounded-lg"
              style={{
                backgroundColor: theme.colors.neutral[50],
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme.colors.neutral[200],
              }}
            >
              <div
                className="text-xs font-medium mb-2 text-center"
                style={{ color: theme.colors.text.secondary }}
              >
                {label} ({value})
              </div>

              {/* Block visual */}
              <div className="flex justify-center mb-3">
                <div
                  className="rounded"
                  style={{
                    width: size.w,
                    height: size.h,
                    backgroundColor: color,
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              </div>

              {/* Controls */}
              {isInteractive && (
                <div className="flex items-center justify-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeBlock(key)}
                    disabled={placed === 0}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      backgroundColor: placed > 0 ? theme.colors.error[100] : theme.colors.neutral[100],
                      color: placed > 0 ? theme.colors.error[600] : theme.colors.neutral[400],
                      cursor: placed > 0 ? 'pointer' : 'not-allowed',
                    }}
                  >
                    −
                  </motion.button>

                  <span
                    className="w-8 text-center font-bold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {placed}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addBlock(key)}
                    disabled={available === 0}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      backgroundColor: available > 0 ? theme.colors.success[100] : theme.colors.neutral[100],
                      color: available > 0 ? theme.colors.success[600] : theme.colors.neutral[400],
                      cursor: available > 0 ? 'pointer' : 'not-allowed',
                    }}
                  >
                    +
                  </motion.button>
                </div>
              )}

              <div
                className="text-xs text-center mt-2"
                style={{ color: theme.colors.text.muted }}
              >
                {available} left
              </div>
            </div>
          );
        })}
      </div>

      {/* Workspace - visual representation */}
      <div
        className="workspace p-6 rounded-xl min-h-[200px]"
        style={{
          backgroundColor: theme.colors.background.secondary,
          borderWidth: '2px',
          borderStyle: 'dashed',
          borderColor: theme.colors.neutral[300],
        }}
      >
        <div className="flex flex-wrap gap-4 justify-center items-end">
          {/* Thousands */}
          <AnimatePresence>
            {Array.from({ length: placedBlocks.thousands }).map((_, idx) => (
              <motion.div
                key={`thousand-${idx}`}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 10 }}
                className="rounded-lg grid grid-cols-10 gap-0.5 p-1"
                style={{
                  backgroundColor: blockTypes[0].color,
                  boxShadow: '3px 3px 6px rgba(0,0,0,0.15)',
                }}
              >
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-sm"
                    style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                  />
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Hundreds */}
          <AnimatePresence>
            {Array.from({ length: placedBlocks.hundreds }).map((_, idx) => (
              <motion.div
                key={`hundred-${idx}`}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 10 }}
                className="rounded grid grid-cols-10 gap-0.5 p-1"
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: blockTypes[1].color,
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-0.5 rounded-sm"
                    style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                  />
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Tens */}
          <div className="flex flex-col gap-1">
            <AnimatePresence>
              {Array.from({ length: placedBlocks.tens }).map((_, idx) => (
                <motion.div
                  key={`ten-${idx}`}
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  exit={{ scale: 0, x: 10 }}
                  className="rounded flex gap-0.5"
                  style={{
                    width: 40,
                    height: 12,
                    backgroundColor: blockTypes[2].color,
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Ones */}
          <div className="flex flex-wrap gap-1 max-w-[60px]">
            <AnimatePresence>
              {Array.from({ length: placedBlocks.ones }).map((_, idx) => (
                <motion.div
                  key={`one-${idx}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="rounded"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: blockTypes[3].color,
                    boxShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {currentValue === 0 && (
          <div
            className="text-center mt-8"
            style={{ color: theme.colors.text.muted }}
          >
            Click + buttons above to add blocks
          </div>
        )}
      </div>

      {/* Regrouping buttons */}
      {item.allowRegrouping && isInteractive && (
        <div className="regrouping-controls flex flex-wrap gap-3 mt-4 justify-center">
          <button
            onClick={() => regroup('ones', 'tens', 10)}
            disabled={placedBlocks.ones < 10}
            className="text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: placedBlocks.ones >= 10 ? theme.colors.secondary[100] : theme.colors.neutral[100],
              color: placedBlocks.ones >= 10 ? theme.colors.secondary[700] : theme.colors.neutral[400],
              cursor: placedBlocks.ones >= 10 ? 'pointer' : 'not-allowed',
            }}
          >
            10 ones → 1 ten
          </button>
          <button
            onClick={() => regroup('tens', 'hundreds', 10)}
            disabled={placedBlocks.tens < 10}
            className="text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: placedBlocks.tens >= 10 ? theme.colors.secondary[100] : theme.colors.neutral[100],
              color: placedBlocks.tens >= 10 ? theme.colors.secondary[700] : theme.colors.neutral[400],
              cursor: placedBlocks.tens >= 10 ? 'pointer' : 'not-allowed',
            }}
          >
            10 tens → 1 hundred
          </button>
          <button
            onClick={() => regroup('hundreds', 'thousands', 10)}
            disabled={placedBlocks.hundreds < 10}
            className="text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: placedBlocks.hundreds >= 10 ? theme.colors.secondary[100] : theme.colors.neutral[100],
              color: placedBlocks.hundreds >= 10 ? theme.colors.secondary[700] : theme.colors.neutral[400],
              cursor: placedBlocks.hundreds >= 10 ? 'pointer' : 'not-allowed',
            }}
          >
            10 hundreds → 1 thousand
          </button>
        </div>
      )}
    </div>
  );
}

export default BaseTenBlocksPlayer;

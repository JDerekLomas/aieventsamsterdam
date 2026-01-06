'use client';

import React, { useState, useEffect } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { OrderItem } from '@/types/items';

interface OrderPlayerProps {
  item: OrderItem;
}

export function OrderPlayer({ item }: OrderPlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();

  // Initialize with shuffled items
  const [orderedItems, setOrderedItems] = useState(() => {
    return [...item.items].sort(() => Math.random() - 0.5);
  });

  // Update response when order changes
  useEffect(() => {
    setResponse(orderedItems.map(item => item.id));
  }, [orderedItems, setResponse]);

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted') {
      const currentOrder = orderedItems.map(i => i.id);

      // Calculate score based on positions
      let correctPositions = 0;
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i] === item.correctOrder[i]) {
          correctPositions++;
        }
      }

      const isAllCorrect = correctPositions === item.correctOrder.length;
      const score = item.partialCredit
        ? Math.round((correctPositions / item.correctOrder.length) * item.maxScore)
        : isAllCorrect ? item.maxScore : 0;

      const feedbackState = isAllCorrect ? 'correct' : correctPositions > 0 ? 'partial' : 'incorrect';

      setFeedback(
        feedbackState,
        score,
        isAllCorrect
          ? item.correctFeedback || 'Perfect order!'
          : item.incorrectFeedback || `${correctPositions} of ${item.correctOrder.length} items in correct position.`
      );
    }
  }, [state.itemState, orderedItems, item, setFeedback]);

  const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';

  // Get position state for each item
  const getPositionState = (itemId: string, index: number) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      if (item.correctOrder[index] === itemId) {
        return 'correct';
      }
      return 'incorrect';
    }
    return 'default';
  };

  const isHorizontal = item.orientation === 'horizontal';

  return (
    <div className="order-player">
      <div
        className="mb-4 text-sm"
        style={{ color: theme.colors.text.secondary }}
      >
        Drag items to put them in the correct order
      </div>

      <Reorder.Group
        axis={isHorizontal ? 'x' : 'y'}
        values={orderedItems}
        onReorder={isInteractive ? setOrderedItems : () => {}}
        className={isHorizontal ? 'flex flex-row gap-3 flex-wrap' : 'flex flex-col gap-3'}
      >
        {orderedItems.map((orderItem, index) => {
          const positionState = getPositionState(orderItem.id, index);

          return (
            <OrderableItem
              key={orderItem.id}
              orderItem={orderItem}
              index={index}
              positionState={positionState}
              isInteractive={isInteractive}
              showNumbers={item.showNumbers}
              isHorizontal={isHorizontal}
              theme={theme}
            />
          );
        })}
      </Reorder.Group>

      {/* Show correct order when revealed */}
      {state.itemState === 'revealed' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.success[50],
            borderLeft: `4px solid ${theme.colors.success[500]}`,
          }}
        >
          <div
            className="text-sm font-medium mb-2"
            style={{ color: theme.colors.success[700] }}
          >
            Correct order:
          </div>
          <div className="flex flex-col gap-2">
            {item.correctOrder.map((id, idx) => {
              const correctItem = item.items.find(i => i.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-2"
                  style={{ color: theme.colors.success[800] }}
                >
                  <span className="font-bold">{idx + 1}.</span>
                  <span>{correctItem?.text}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface OrderableItemProps {
  orderItem: { id: string; text: string; imageUrl?: string };
  index: number;
  positionState: string;
  isInteractive: boolean;
  showNumbers: boolean;
  isHorizontal: boolean;
  theme: any;
}

function OrderableItem({
  orderItem,
  index,
  positionState,
  isInteractive,
  showNumbers,
  isHorizontal,
  theme,
}: OrderableItemProps) {
  const dragControls = useDragControls();

  const getBorderColor = () => {
    switch (positionState) {
      case 'correct':
        return theme.colors.success[500];
      case 'incorrect':
        return theme.colors.error[500];
      default:
        return theme.colors.neutral[200];
    }
  };

  const getBgColor = () => {
    switch (positionState) {
      case 'correct':
        return theme.colors.success[50];
      case 'incorrect':
        return theme.colors.error[50];
      default:
        return theme.colors.background.primary;
    }
  };

  return (
    <Reorder.Item
      value={orderItem}
      dragListener={isInteractive}
      dragControls={dragControls}
      className={`${isHorizontal ? 'flex-shrink-0' : 'w-full'}`}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center gap-4 select-none"
        style={{
          padding: theme.components.option.padding,
          backgroundColor: getBgColor(),
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: getBorderColor(),
          borderRadius: theme.borderRadius.lg,
          cursor: isInteractive ? 'grab' : 'default',
          minWidth: isHorizontal ? '120px' : undefined,
        }}
        whileHover={isInteractive ? { scale: 1.02 } : {}}
        whileTap={isInteractive ? { scale: 1.05, cursor: 'grabbing' } : {}}
      >
        {/* Drag handle */}
        {isInteractive && (
          <div
            className="flex-shrink-0"
            style={{ color: theme.colors.neutral[400] }}
            onPointerDown={(e) => dragControls.start(e)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="6" cy="5" r="1.5" />
              <circle cx="14" cy="5" r="1.5" />
              <circle cx="6" cy="10" r="1.5" />
              <circle cx="14" cy="10" r="1.5" />
              <circle cx="6" cy="15" r="1.5" />
              <circle cx="14" cy="15" r="1.5" />
            </svg>
          </div>
        )}

        {/* Position number */}
        {showNumbers && (
          <div
            className="flex-shrink-0 flex items-center justify-center font-bold"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: theme.borderRadius.full,
              backgroundColor: positionState === 'correct'
                ? theme.colors.success[500]
                : positionState === 'incorrect'
                ? theme.colors.error[500]
                : theme.colors.primary[100],
              color: positionState === 'correct' || positionState === 'incorrect'
                ? '#fff'
                : theme.colors.primary[700],
            }}
          >
            {index + 1}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex items-center gap-3">
          {orderItem.imageUrl && (
            <img
              src={orderItem.imageUrl}
              alt={orderItem.text}
              className="w-12 h-12 object-cover rounded"
            />
          )}
          <span
            style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.primary,
            }}
          >
            {orderItem.text}
          </span>
        </div>

        {/* Result indicator */}
        {positionState !== 'default' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 text-xl"
          >
            {positionState === 'correct' ? '✓' : '✗'}
          </motion.div>
        )}
      </motion.div>
    </Reorder.Item>
  );
}

export default OrderPlayer;

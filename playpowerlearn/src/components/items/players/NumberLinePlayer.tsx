'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useItemPlayer, useItemTheme } from '../ItemPlayerContext';
import type { NumberLineItem } from '@/types/items';

interface NumberLinePlayerProps {
  item: NumberLineItem;
}

export function NumberLinePlayer({ item }: NumberLinePlayerProps) {
  const { state, setResponse, setFeedback } = useItemPlayer();
  const theme = useItemTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Track placed markers
  const [placedMarkers, setPlacedMarkers] = useState<number[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Number line dimensions
  const [dimensions, setDimensions] = useState({ width: 600, height: 120 });
  const padding = 40;

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth - padding * 2,
          height: 120,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Convert position to value
  const positionToValue = useCallback((x: number): number => {
    const ratio = x / dimensions.width;
    const value = item.min + ratio * (item.max - item.min);
    // Snap to step
    const snapped = Math.round(value / item.step) * item.step;
    return Math.max(item.min, Math.min(item.max, snapped));
  }, [dimensions.width, item.min, item.max, item.step]);

  // Convert value to position
  const valueToPosition = useCallback((value: number): number => {
    const ratio = (value - item.min) / (item.max - item.min);
    return ratio * dimensions.width;
  }, [dimensions.width, item.min, item.max]);

  // Handle click on number line to place marker
  const handleLineClick = (e: React.MouseEvent) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - padding;
    const value = positionToValue(Math.max(0, Math.min(dimensions.width, x)));

    // Add or update marker based on interaction mode
    if (item.interactionMode === 'place') {
      if (placedMarkers.length < item.correctPositions.length) {
        setPlacedMarkers([...placedMarkers, value]);
      }
    }
  };

  // Handle marker drag
  const handleMarkerDrag = (index: number, e: React.MouseEvent | React.TouchEvent) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }

    setDraggingIndex(index);

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const x = clientX - rect.left - padding;
      const value = positionToValue(Math.max(0, Math.min(dimensions.width, x)));

      setPlacedMarkers(prev => {
        const newMarkers = [...prev];
        newMarkers[index] = value;
        return newMarkers;
      });
    };

    const handleUp = () => {
      setDraggingIndex(null);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleUp);
  };

  // Remove marker
  const handleMarkerRemove = (index: number) => {
    if (state.itemState === 'submitted' || state.itemState === 'revealed') {
      return;
    }
    setPlacedMarkers(prev => prev.filter((_, i) => i !== index));
  };

  // Update response when markers change
  useEffect(() => {
    setResponse(placedMarkers);
  }, [placedMarkers, setResponse]);

  // Grade when submitted
  useEffect(() => {
    if (state.itemState === 'submitted') {
      // Check each placed marker against correct positions
      let correctCount = 0;
      const matched = new Set<number>();

      placedMarkers.forEach(placed => {
        item.correctPositions.forEach((correct, idx) => {
          if (!matched.has(idx) && Math.abs(placed - correct) <= item.tolerance) {
            correctCount++;
            matched.add(idx);
          }
        });
      });

      const totalRequired = item.correctPositions.length;
      const isAllCorrect = correctCount === totalRequired && placedMarkers.length === totalRequired;
      const score = item.partialCredit
        ? Math.round((correctCount / totalRequired) * item.maxScore)
        : isAllCorrect ? item.maxScore : 0;

      const feedbackState = isAllCorrect ? 'correct' : correctCount > 0 ? 'partial' : 'incorrect';

      setFeedback(
        feedbackState,
        score,
        isAllCorrect
          ? item.correctFeedback || 'Perfect placement!'
          : item.incorrectFeedback || `${correctCount} of ${totalRequired} markers placed correctly.`
      );
    }
  }, [state.itemState, placedMarkers, item, setFeedback]);

  const isInteractive = state.itemState !== 'submitted' && state.itemState !== 'revealed';

  // Generate tick marks
  const ticks = [];
  for (let v = item.min; v <= item.max; v += item.step) {
    const isMajor = (v - item.min) % (item.step * 5) === 0 || v === item.min || v === item.max;
    ticks.push({ value: v, position: valueToPosition(v), isMajor });
  }

  // Check if a marker is correct (for feedback display)
  const isMarkerCorrect = (value: number): boolean => {
    return item.correctPositions.some(correct => Math.abs(value - correct) <= item.tolerance);
  };

  return (
    <div className="number-line-player">
      <div
        className="mb-4 text-sm"
        style={{ color: theme.colors.text.secondary }}
      >
        {item.interactionMode === 'place' && (
          <>Click on the number line to place {item.correctPositions.length} marker{item.correctPositions.length !== 1 ? 's' : ''}</>
        )}
      </div>

      {/* Number line container */}
      <div
        ref={containerRef}
        className="number-line-container relative select-none"
        style={{
          padding: `20px ${padding}px`,
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          cursor: isInteractive ? 'crosshair' : 'default',
        }}
        onClick={handleLineClick}
      >
        <svg
          width={dimensions.width + padding * 2}
          height={dimensions.height}
          className="overflow-visible"
        >
          {/* Main line */}
          <line
            x1={padding}
            y1={60}
            x2={padding + dimensions.width}
            y2={60}
            stroke={theme.colors.neutral[400]}
            strokeWidth={3}
          />

          {/* Tick marks */}
          {item.showTicks && ticks.map(({ value, position, isMajor }) => (
            <g key={value}>
              <line
                x1={padding + position}
                y1={60 - (isMajor ? 15 : 8)}
                x2={padding + position}
                y2={60 + (isMajor ? 15 : 8)}
                stroke={theme.colors.neutral[400]}
                strokeWidth={isMajor ? 2 : 1}
              />
              {item.showLabels && isMajor && (
                <text
                  x={padding + position}
                  y={95}
                  textAnchor="middle"
                  fill={theme.colors.text.secondary}
                  fontSize={theme.typography.fontSize.sm}
                >
                  {value}
                </text>
              )}
            </g>
          ))}

          {/* Correct positions (shown after submit/reveal) */}
          {(state.itemState === 'submitted' || state.itemState === 'revealed') &&
            item.correctPositions.map((pos, idx) => (
              <g key={`correct-${idx}`}>
                <circle
                  cx={padding + valueToPosition(pos)}
                  cy={60}
                  r={12}
                  fill="none"
                  stroke={theme.colors.success[500]}
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />
              </g>
            ))}

          {/* Placed markers */}
          {placedMarkers.map((value, idx) => {
            const x = padding + valueToPosition(value);
            const isCorrect = state.itemState !== 'pristine' && state.itemState !== 'interacting'
              ? isMarkerCorrect(value)
              : null;

            return (
              <g key={idx}>
                {/* Marker */}
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  cx={x}
                  cy={60}
                  r={draggingIndex === idx ? 18 : 14}
                  fill={
                    isCorrect === true
                      ? theme.colors.success[500]
                      : isCorrect === false
                      ? theme.colors.error[500]
                      : theme.colors.primary[500]
                  }
                  stroke="#fff"
                  strokeWidth={3}
                  style={{ cursor: isInteractive ? 'grab' : 'default' }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMarkerDrag(idx, e);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleMarkerDrag(idx, e);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleMarkerRemove(idx);
                  }}
                />

                {/* Value label above marker */}
                <text
                  x={x}
                  y={25}
                  textAnchor="middle"
                  fill={theme.colors.text.primary}
                  fontSize={theme.typography.fontSize.sm}
                  fontWeight="bold"
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Instructions */}
      <div
        className="mt-4 text-sm flex items-center gap-4"
        style={{ color: theme.colors.text.muted }}
      >
        <span>Drag markers to reposition</span>
        <span>•</span>
        <span>Double-click to remove</span>
        {placedMarkers.length > 0 && (
          <>
            <span>•</span>
            <span>{placedMarkers.length} of {item.correctPositions.length} placed</span>
          </>
        )}
      </div>
    </div>
  );
}

export default NumberLinePlayer;

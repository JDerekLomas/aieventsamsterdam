'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { BaseItem, ItemResponse, AgeBand } from '@/types/items';
import type { ThemeConfig } from '@/lib/themes';
import { getTheme } from '@/lib/themes';

// ============================================
// STATE TYPES
// ============================================

export type ItemState = 'pristine' | 'interacting' | 'submitted' | 'revealed';

export type FeedbackState = 'none' | 'correct' | 'incorrect' | 'partial';

export interface ItemPlayerState {
  // Item data
  item: BaseItem | null;

  // Interaction state
  itemState: ItemState;
  response: unknown;

  // Feedback
  feedbackState: FeedbackState;
  score: number;
  maxScore: number;
  feedbackMessage: string | null;

  // Hints
  hintsUsed: number[];
  currentHintLevel: number;

  // Timing
  startTime: number | null;
  endTime: number | null;
  timeSpent: number;

  // Attempts
  attemptCount: number;
  maxAttempts: number;

  // Theme
  theme: ThemeConfig;
  ageBand: AgeBand;

  // Audio
  audioEnabled: boolean;
  voiceoverEnabled: boolean;

  // Settings
  showHints: boolean;
  showExplanation: boolean;
  allowRetry: boolean;
  immediateFeeback: boolean;
}

// ============================================
// ACTIONS
// ============================================

type ItemPlayerAction =
  | { type: 'SET_ITEM'; payload: BaseItem }
  | { type: 'SET_RESPONSE'; payload: unknown }
  | { type: 'SUBMIT' }
  | { type: 'SET_FEEDBACK'; payload: { state: FeedbackState; score: number; message?: string } }
  | { type: 'USE_HINT'; payload: number }
  | { type: 'REVEAL' }
  | { type: 'RETRY' }
  | { type: 'RESET' }
  | { type: 'SET_THEME'; payload: AgeBand }
  | { type: 'TOGGLE_AUDIO'; payload: boolean }
  | { type: 'TOGGLE_VOICEOVER'; payload: boolean }
  | { type: 'TICK' }; // For time tracking

// ============================================
// INITIAL STATE
// ============================================

const initialState: ItemPlayerState = {
  item: null,
  itemState: 'pristine',
  response: null,
  feedbackState: 'none',
  score: 0,
  maxScore: 0,
  feedbackMessage: null,
  hintsUsed: [],
  currentHintLevel: 0,
  startTime: null,
  endTime: null,
  timeSpent: 0,
  attemptCount: 0,
  maxAttempts: 3,
  theme: getTheme('3-5'),
  ageBand: '3-5',
  audioEnabled: true,
  voiceoverEnabled: false,
  showHints: true,
  showExplanation: true,
  allowRetry: true,
  immediateFeeback: true,
};

// ============================================
// REDUCER
// ============================================

function itemPlayerReducer(state: ItemPlayerState, action: ItemPlayerAction): ItemPlayerState {
  switch (action.type) {
    case 'SET_ITEM':
      return {
        ...initialState,
        item: action.payload,
        maxScore: action.payload.maxScore,
        maxAttempts: 3,
        startTime: Date.now(),
        theme: state.theme,
        ageBand: state.ageBand,
        audioEnabled: state.audioEnabled,
        voiceoverEnabled: state.voiceoverEnabled,
      };

    case 'SET_RESPONSE':
      return {
        ...state,
        response: action.payload,
        itemState: state.itemState === 'pristine' ? 'interacting' : state.itemState,
      };

    case 'SUBMIT':
      return {
        ...state,
        itemState: 'submitted',
        endTime: Date.now(),
        attemptCount: state.attemptCount + 1,
      };

    case 'SET_FEEDBACK':
      return {
        ...state,
        feedbackState: action.payload.state,
        score: action.payload.score,
        feedbackMessage: action.payload.message || null,
      };

    case 'USE_HINT':
      if (state.hintsUsed.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        hintsUsed: [...state.hintsUsed, action.payload],
        currentHintLevel: action.payload,
      };

    case 'REVEAL':
      return {
        ...state,
        itemState: 'revealed',
      };

    case 'RETRY':
      if (state.attemptCount >= state.maxAttempts) {
        return state;
      }
      return {
        ...state,
        itemState: 'pristine',
        response: null,
        feedbackState: 'none',
        feedbackMessage: null,
        startTime: Date.now(),
        endTime: null,
      };

    case 'RESET':
      return {
        ...initialState,
        theme: state.theme,
        ageBand: state.ageBand,
        audioEnabled: state.audioEnabled,
        voiceoverEnabled: state.voiceoverEnabled,
      };

    case 'SET_THEME':
      return {
        ...state,
        ageBand: action.payload,
        theme: getTheme(action.payload),
      };

    case 'TOGGLE_AUDIO':
      return {
        ...state,
        audioEnabled: action.payload,
      };

    case 'TOGGLE_VOICEOVER':
      return {
        ...state,
        voiceoverEnabled: action.payload,
      };

    case 'TICK':
      if (!state.startTime || state.endTime) {
        return state;
      }
      return {
        ...state,
        timeSpent: Math.floor((Date.now() - state.startTime) / 1000),
      };

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface ItemPlayerContextValue {
  state: ItemPlayerState;

  // Actions
  setItem: (item: BaseItem) => void;
  setResponse: (response: unknown) => void;
  submit: () => void;
  setFeedback: (state: FeedbackState, score: number, message?: string) => void;
  useHint: (level: number) => void;
  reveal: () => void;
  retry: () => void;
  reset: () => void;
  setTheme: (ageBand: AgeBand) => void;
  toggleAudio: (enabled: boolean) => void;
  toggleVoiceover: (enabled: boolean) => void;

  // Computed
  canSubmit: boolean;
  canRetry: boolean;
  canUseHint: boolean;
  nextHintLevel: number | null;
  isComplete: boolean;
}

const ItemPlayerContext = createContext<ItemPlayerContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

interface ItemPlayerProviderProps {
  children: ReactNode;
  initialAgeBand?: AgeBand;
  onComplete?: (response: ItemResponse) => void;
}

export function ItemPlayerProvider({
  children,
  initialAgeBand = '3-5',
  onComplete,
}: ItemPlayerProviderProps) {
  const [state, dispatch] = useReducer(itemPlayerReducer, {
    ...initialState,
    ageBand: initialAgeBand,
    theme: getTheme(initialAgeBand),
  });

  // Actions
  const setItem = useCallback((item: BaseItem) => {
    dispatch({ type: 'SET_ITEM', payload: item });
  }, []);

  const setResponse = useCallback((response: unknown) => {
    dispatch({ type: 'SET_RESPONSE', payload: response });
  }, []);

  const submit = useCallback(() => {
    dispatch({ type: 'SUBMIT' });
  }, []);

  const setFeedback = useCallback((feedbackState: FeedbackState, score: number, message?: string) => {
    dispatch({ type: 'SET_FEEDBACK', payload: { state: feedbackState, score, message } });

    // If complete and callback provided
    if (feedbackState !== 'none' && onComplete && state.item) {
      onComplete({
        itemId: state.item.id,
        studentId: '', // Set by parent
        timestamp: new Date(),
        responseData: state.response,
        timeSpent: state.timeSpent,
        hintsUsed: state.hintsUsed,
        attempts: state.attemptCount + 1,
        score,
        maxScore: state.maxScore,
        isCorrect: feedbackState === 'correct',
        feedback: message,
      });
    }
  }, [onComplete, state.item, state.response, state.timeSpent, state.hintsUsed, state.attemptCount, state.maxScore]);

  const useHint = useCallback((level: number) => {
    dispatch({ type: 'USE_HINT', payload: level });
  }, []);

  const reveal = useCallback(() => {
    dispatch({ type: 'REVEAL' });
  }, []);

  const retry = useCallback(() => {
    dispatch({ type: 'RETRY' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setTheme = useCallback((ageBand: AgeBand) => {
    dispatch({ type: 'SET_THEME', payload: ageBand });
  }, []);

  const toggleAudio = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_AUDIO', payload: enabled });
  }, []);

  const toggleVoiceover = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_VOICEOVER', payload: enabled });
  }, []);

  // Computed values
  const canSubmit = state.itemState === 'interacting' && state.response !== null;
  const canRetry = state.itemState === 'submitted' && state.attemptCount < state.maxAttempts && state.feedbackState !== 'correct';
  const canUseHint = state.item !== null && state.itemState !== 'revealed' && state.hintsUsed.length < (state.item.hints?.length || 0);
  const nextHintLevel = canUseHint && state.item ? (state.currentHintLevel < state.item.hints.length ? state.currentHintLevel + 1 : null) : null;
  const isComplete = state.feedbackState === 'correct' || state.itemState === 'revealed';

  const value: ItemPlayerContextValue = {
    state,
    setItem,
    setResponse,
    submit,
    setFeedback,
    useHint,
    reveal,
    retry,
    reset,
    setTheme,
    toggleAudio,
    toggleVoiceover,
    canSubmit,
    canRetry,
    canUseHint,
    nextHintLevel,
    isComplete,
  };

  return (
    <ItemPlayerContext.Provider value={value}>
      {children}
    </ItemPlayerContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useItemPlayer() {
  const context = useContext(ItemPlayerContext);
  if (!context) {
    throw new Error('useItemPlayer must be used within an ItemPlayerProvider');
  }
  return context;
}

// ============================================
// THEME HOOK
// ============================================

export function useItemTheme() {
  const { state } = useItemPlayer();
  return state.theme;
}

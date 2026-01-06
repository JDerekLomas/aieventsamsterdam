// PlayPowerLearn Item Type System
// Comprehensive item types inspired by QTI3, Mathspace, and best-in-class EdTech

// ============================================
// CORE ENUMS & CONSTANTS
// ============================================

export type AgeBand = 'k-2' | '3-5' | '6-8' | '9-12';

export type Subject = 'MATH' | 'LITERACY' | 'SCIENCE' | 'SOCIAL_STUDIES';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'ADAPTIVE';

export type ItemCategory =
  | 'selection'
  | 'constructed-response'
  | 'drag-drop'
  | 'interactive'
  | 'worked-example'
  | 'literacy'
  | 'gamified';

export type ItemType =
  // Selection Items
  | 'single-choice'
  | 'multiple-choice'
  | 'true-false'
  | 'inline-choice'
  | 'hot-text'
  | 'hot-spot'
  // Constructed Response
  | 'text-entry'
  | 'extended-text'
  | 'numeric-entry'
  | 'math-expression'
  | 'drawing'
  // Drag & Drop
  | 'gap-match'
  | 'order'
  | 'match'
  | 'categorize'
  | 'graphic-gap-match'
  // Interactive/Simulation
  | 'number-line'
  | 'base-ten-blocks'
  | 'fraction-bars'
  | 'balance-scale'
  | 'graphing'
  | 'geometry-construction'
  | 'simulation'
  // Worked Examples
  | 'stepped-problem'
  | 'faded-example'
  | 'error-analysis'
  | 'two-column-proof'
  // Literacy
  | 'passage-mcq'
  | 'highlight-evidence'
  | 'annotation'
  | 'sentence-combining'
  | 'text-reconstruction'
  // Gamified
  | 'time-attack'
  | 'poll'
  | 'collaborate-board'
  | 'flashcard';

export const ITEM_CATEGORY_MAP: Record<ItemType, ItemCategory> = {
  'single-choice': 'selection',
  'multiple-choice': 'selection',
  'true-false': 'selection',
  'inline-choice': 'selection',
  'hot-text': 'selection',
  'hot-spot': 'selection',
  'text-entry': 'constructed-response',
  'extended-text': 'constructed-response',
  'numeric-entry': 'constructed-response',
  'math-expression': 'constructed-response',
  'drawing': 'constructed-response',
  'gap-match': 'drag-drop',
  'order': 'drag-drop',
  'match': 'drag-drop',
  'categorize': 'drag-drop',
  'graphic-gap-match': 'drag-drop',
  'number-line': 'interactive',
  'base-ten-blocks': 'interactive',
  'fraction-bars': 'interactive',
  'balance-scale': 'interactive',
  'graphing': 'interactive',
  'geometry-construction': 'interactive',
  'simulation': 'interactive',
  'stepped-problem': 'worked-example',
  'faded-example': 'worked-example',
  'error-analysis': 'worked-example',
  'two-column-proof': 'worked-example',
  'passage-mcq': 'literacy',
  'highlight-evidence': 'literacy',
  'annotation': 'literacy',
  'sentence-combining': 'literacy',
  'text-reconstruction': 'literacy',
  'time-attack': 'gamified',
  'poll': 'gamified',
  'collaborate-board': 'gamified',
  'flashcard': 'gamified',
};

// ============================================
// BASE ITEM INTERFACE
// ============================================

export interface BaseItem {
  id: string;
  type: ItemType;
  version: number;

  // Content
  stem: ItemStem;
  instructions?: string;

  // Metadata
  subject: Subject;
  gradeLevel: string;
  ageBand: AgeBand;
  difficulty: Difficulty;
  standardCodes: string[];
  tags: string[];

  // Scoring
  maxScore: number;
  partialCredit: boolean;

  // Feedback
  generalFeedback?: string;
  correctFeedback?: string;
  incorrectFeedback?: string;
  hints: ItemHint[];

  // Accessibility
  altText?: string;
  audioUrl?: string;
  signLanguageUrl?: string;

  // Timing
  estimatedTime: number; // seconds
  timeLimit?: number; // seconds, optional

  // XP
  xpReward: number;
}

export interface ItemStem {
  text: string;
  richText?: string; // HTML with formatting
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  mathML?: string;
  latex?: string;
}

export interface ItemHint {
  level: 1 | 2 | 3;
  type: 'self-regulation' | 'process' | 'reveal';
  text: string;
  xpPenalty: number;
}

// ============================================
// SELECTION ITEMS
// ============================================

export interface SingleChoiceItem extends BaseItem {
  type: 'single-choice';
  options: SelectionOption[];
  correctOptionId: string;
  shuffle: boolean;
  layout: 'vertical' | 'horizontal' | 'grid';
}

export interface MultipleChoiceItem extends BaseItem {
  type: 'multiple-choice';
  options: SelectionOption[];
  correctOptionIds: string[];
  minSelections: number;
  maxSelections: number;
  shuffle: boolean;
  layout: 'vertical' | 'horizontal' | 'grid';
}

export interface TrueFalseItem extends BaseItem {
  type: 'true-false';
  correctAnswer: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export interface InlineChoiceItem extends BaseItem {
  type: 'inline-choice';
  textWithGaps: string; // Use {{gap:id}} placeholders
  gaps: InlineGap[];
}

export interface HotTextItem extends BaseItem {
  type: 'hot-text';
  passage: string;
  selectableRanges: TextRange[];
  correctRangeIds: string[];
  selectionMode: 'single' | 'multiple';
}

export interface HotSpotItem extends BaseItem {
  type: 'hot-spot';
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  regions: HotSpotRegion[];
  correctRegionIds: string[];
  selectionMode: 'single' | 'multiple';
}

export interface SelectionOption {
  id: string;
  text: string;
  richText?: string;
  imageUrl?: string;
  feedback?: string;
  isDistractor?: boolean;
  misconception?: string; // For analytics
}

export interface InlineGap {
  id: string;
  options: SelectionOption[];
  correctOptionId: string;
}

export interface TextRange {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
}

export interface HotSpotRegion {
  id: string;
  shape: 'rect' | 'circle' | 'poly';
  coords: number[];
  label?: string;
}

// ============================================
// CONSTRUCTED RESPONSE ITEMS
// ============================================

export interface TextEntryItem extends BaseItem {
  type: 'text-entry';
  correctAnswers: string[];
  caseSensitive: boolean;
  trimWhitespace: boolean;
  maxLength?: number;
  placeholder?: string;
  inputType: 'text' | 'word' | 'sentence';
}

export interface ExtendedTextItem extends BaseItem {
  type: 'extended-text';
  minWords?: number;
  maxWords?: number;
  rubric: RubricItem[];
  exemplars?: string[];
  writingPrompt?: string;
}

export interface NumericEntryItem extends BaseItem {
  type: 'numeric-entry';
  correctValue: number;
  tolerance: number;
  toleranceType: 'absolute' | 'percentage';
  acceptedFormats: ('decimal' | 'fraction' | 'scientific')[];
  unit?: string;
  unitRequired: boolean;
}

export interface MathExpressionItem extends BaseItem {
  type: 'math-expression';
  correctExpressions: string[]; // LaTeX format
  equivalenceCheck: 'exact' | 'algebraic' | 'numeric';
  variables?: string[];
  inputMode: 'keyboard' | 'handwriting' | 'both';
}

export interface DrawingItem extends BaseItem {
  type: 'drawing';
  canvasWidth: number;
  canvasHeight: number;
  backgroundImageUrl?: string;
  tools: ('pen' | 'line' | 'rectangle' | 'circle' | 'text' | 'eraser')[];
  colors: string[];
  rubric: RubricItem[];
}

export interface RubricItem {
  criterion: string;
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  description: string;
  exemplar?: string;
}

// ============================================
// DRAG & DROP ITEMS
// ============================================

export interface GapMatchItem extends BaseItem {
  type: 'gap-match';
  textWithGaps: string; // Use {{gap:id}} placeholders
  gaps: GapDefinition[];
  draggables: Draggable[];
  reuseDraggables: boolean;
}

export interface OrderItem extends BaseItem {
  type: 'order';
  items: OrderableItem[];
  correctOrder: string[];
  orientation: 'vertical' | 'horizontal';
  showNumbers: boolean;
}

export interface MatchItem extends BaseItem {
  type: 'match';
  sourceItems: MatchSource[];
  targetItems: MatchTarget[];
  correctPairs: MatchPair[];
  oneToOne: boolean;
  showLines: boolean;
}

export interface CategorizeItem extends BaseItem {
  type: 'categorize';
  categories: Category[];
  items: CategorizableItem[];
  correctAssignments: CategoryAssignment[];
}

export interface GraphicGapMatchItem extends BaseItem {
  type: 'graphic-gap-match';
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  dropZones: DropZone[];
  draggables: Draggable[];
}

export interface GapDefinition {
  id: string;
  correctDraggableId: string;
  acceptMultiple?: boolean;
}

export interface Draggable {
  id: string;
  text?: string;
  imageUrl?: string;
  mathML?: string;
}

export interface OrderableItem {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface MatchSource {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface MatchTarget {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface MatchPair {
  sourceId: string;
  targetId: string;
}

export interface Category {
  id: string;
  label: string;
  color?: string;
}

export interface CategorizableItem {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface CategoryAssignment {
  itemId: string;
  categoryId: string;
}

export interface DropZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  correctDraggableId: string;
}

// ============================================
// INTERACTIVE / SIMULATION ITEMS
// ============================================

export interface NumberLineItem extends BaseItem {
  type: 'number-line';
  min: number;
  max: number;
  step: number;
  showTicks: boolean;
  showLabels: boolean;
  markers: NumberLineMarker[];
  interactionMode: 'place' | 'drag' | 'select-range';
  correctPositions: number[];
  tolerance: number;
}

export interface BaseTenBlocksItem extends BaseItem {
  type: 'base-ten-blocks';
  targetValue: number;
  availableBlocks: {
    ones: number;
    tens: number;
    hundreds: number;
    thousands: number;
  };
  allowRegrouping: boolean;
  showValue: boolean;
}

export interface FractionBarsItem extends BaseItem {
  type: 'fraction-bars';
  targetFraction: { numerator: number; denominator: number };
  availableDenominators: number[];
  showLabels: boolean;
  showEquivalent: boolean;
  interactionMode: 'build' | 'compare' | 'operate';
}

export interface BalanceScaleItem extends BaseItem {
  type: 'balance-scale';
  leftSide: ScaleSide;
  rightSide: ScaleSide;
  unknownVariable: string;
  correctValue: number;
  allowedOperations: ('add' | 'subtract' | 'multiply' | 'divide')[];
}

export interface GraphingItem extends BaseItem {
  type: 'graphing';
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  gridLines: boolean;
  interactionMode: 'plot-points' | 'draw-line' | 'draw-function' | 'shade-region';
  correctAnswer: GraphAnswer;
  tools: ('point' | 'line' | 'segment' | 'ray' | 'parabola' | 'circle')[];
}

export interface GeometryConstructionItem extends BaseItem {
  type: 'geometry-construction';
  tools: ('point' | 'line' | 'segment' | 'ray' | 'circle' | 'compass' | 'ruler' | 'protractor')[];
  givenElements: GeometryElement[];
  constructionGoal: string;
  validationCriteria: GeometryValidation[];
}

export interface SimulationItem extends BaseItem {
  type: 'simulation';
  simulationUrl: string;
  parameters: Record<string, number | string | boolean>;
  completionCriteria: SimulationCriteria[];
}

export interface NumberLineMarker {
  id: string;
  position?: number; // Pre-placed
  label?: string;
  draggable: boolean;
}

export interface ScaleSide {
  constants: number[];
  variables: { coefficient: number; variable: string }[];
}

export interface GraphAnswer {
  type: 'points' | 'line' | 'function' | 'region';
  data: unknown; // Specific to type
  tolerance: number;
}

export interface GeometryElement {
  type: 'point' | 'line' | 'segment' | 'circle' | 'angle';
  data: unknown;
  label?: string;
}

export interface GeometryValidation {
  type: 'perpendicular' | 'parallel' | 'congruent' | 'bisector' | 'angle-measure';
  elements: string[];
  tolerance?: number;
}

export interface SimulationCriteria {
  variable: string;
  condition: 'equals' | 'greater' | 'less' | 'between';
  value: number | [number, number];
}

// ============================================
// WORKED EXAMPLES (Core Differentiator)
// ============================================

export interface SteppedProblemItem extends BaseItem {
  type: 'stepped-problem';
  problem: MathProblem;
  steps: WorkedStep[];
  allowSkip: boolean;
  showStepCount: boolean;
  requireAllSteps: boolean;
}

export interface FadedExampleItem extends BaseItem {
  type: 'faded-example';
  examples: FadedExample[];
  fadingStrategy: 'backward' | 'forward' | 'adaptive';
}

export interface ErrorAnalysisItem extends BaseItem {
  type: 'error-analysis';
  problem: MathProblem;
  givenSolution: WorkedStep[];
  errorStepIndex: number;
  errorType: string;
  correctStep: WorkedStep;
}

export interface TwoColumnProofItem extends BaseItem {
  type: 'two-column-proof';
  given: string[];
  prove: string;
  steps: ProofStep[];
  missingSteps: number[]; // Indices of steps student must fill
  reasonBank: string[];
}

export interface MathProblem {
  statement: string;
  latex?: string;
  variables?: Record<string, number>;
  imageUrl?: string;
}

export interface WorkedStep {
  id: string;
  order: number;
  instruction?: string;
  inputType: 'expression' | 'numeric' | 'text' | 'selection';
  inputPlaceholder?: string;
  correctAnswer: string;
  alternateAnswers?: string[];
  hint?: string;
  explanation: string;
  showPrevious: boolean; // Show previous step's answer
  isRevealed?: boolean; // For fading
}

export interface FadedExample {
  id: string;
  problem: MathProblem;
  steps: WorkedStep[];
  revealedSteps: number[]; // Indices of steps shown to student
}

export interface ProofStep {
  id: string;
  statement: string;
  reason: string;
  isGiven: boolean;
}

// ============================================
// LITERACY ITEMS
// ============================================

export interface PassageMCQItem extends BaseItem {
  type: 'passage-mcq';
  passage: LiteracyPassage;
  questions: PassageQuestion[];
}

export interface HighlightEvidenceItem extends BaseItem {
  type: 'highlight-evidence';
  passage: LiteracyPassage;
  claim: string;
  requiredEvidence: number; // How many pieces
  correctRanges: TextRange[];
  partialCreditPerRange: number;
}

export interface AnnotationItem extends BaseItem {
  type: 'annotation';
  passage: LiteracyPassage;
  annotationPrompts: AnnotationPrompt[];
  rubric: RubricItem[];
}

export interface SentenceCombiningItem extends BaseItem {
  type: 'sentence-combining';
  sentences: string[];
  targetStructure?: string; // e.g., "compound", "complex", "compound-complex"
  acceptedAnswers: string[];
  keyElements: string[]; // Must include these
  grammarFocus?: string;
}

export interface TextReconstructionItem extends BaseItem {
  type: 'text-reconstruction';
  originalText: string;
  segments: TextSegment[];
  correctOrder: string[];
  showFirstSegment: boolean;
}

export interface LiteracyPassage {
  id: string;
  title: string;
  text: string;
  richText?: string;
  lexileLevel?: number;
  genre: 'fiction' | 'nonfiction' | 'poetry' | 'drama';
  source?: string;
  audioUrl?: string;
  vocabulary?: VocabularyWord[];
}

export interface PassageQuestion {
  id: string;
  stem: string;
  type: 'single-choice' | 'multiple-choice' | 'text-entry';
  options?: SelectionOption[];
  correctAnswer: string | string[];
  textReference?: TextRange; // Highlight relevant passage section
  questionType: 'literal' | 'inferential' | 'evaluative' | 'vocabulary';
}

export interface AnnotationPrompt {
  id: string;
  targetRange: TextRange;
  prompt: string;
  responseType: 'text' | 'selection';
  options?: string[];
}

export interface TextSegment {
  id: string;
  text: string;
}

export interface VocabularyWord {
  word: string;
  definition: string;
  partOfSpeech: string;
  pronunciation?: string;
  audioUrl?: string;
}

// ============================================
// GAMIFIED ITEMS
// ============================================

export interface TimeAttackItem extends BaseItem {
  type: 'time-attack';
  questions: (SingleChoiceItem | NumericEntryItem | TextEntryItem)[];
  timePerQuestion: number;
  bonusTimeCorrect: number;
  penaltyTimeWrong: number;
  showLeaderboard: boolean;
}

export interface PollItem extends BaseItem {
  type: 'poll';
  question: string;
  options: PollOption[];
  allowCustom: boolean;
  showResults: 'immediately' | 'after-vote' | 'never';
  anonymous: boolean;
}

export interface CollaborateBoardItem extends BaseItem {
  type: 'collaborate-board';
  prompt: string;
  boardType: 'sticky-notes' | 'whiteboard' | 'mind-map';
  allowImages: boolean;
  allowReactions: boolean;
  moderationRequired: boolean;
}

export interface FlashcardItem extends BaseItem {
  type: 'flashcard';
  cards: Flashcard[];
  studyMode: 'standard' | 'spaced-repetition' | 'matching-game';
  showProgress: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface Flashcard {
  id: string;
  front: {
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
  };
  back: {
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
  };
  tags?: string[];
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ItemResponse {
  itemId: string;
  studentId: string;
  timestamp: Date;
  responseData: unknown; // Specific to item type
  timeSpent: number; // seconds
  hintsUsed: number[];
  attempts: number;
  score: number;
  maxScore: number;
  isCorrect: boolean;
  feedback?: string;
}

export interface WorkedStepResponse {
  stepId: string;
  response: string;
  isCorrect: boolean;
  hintsUsed: number;
  timeSpent: number;
  skipped: boolean;
}

// ============================================
// ITEM BANK & ACTIVITY
// ============================================

export interface ItemBank {
  id: string;
  name: string;
  subject: Subject;
  gradeRange: [string, string];
  items: BaseItem[];
  tags: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'assessment' | 'lesson' | 'game';
  subject: Subject;
  gradeLevel: string;
  ageBand: AgeBand;
  standardCodes: string[];
  items: BaseItem[];
  sequencing: 'fixed' | 'adaptive' | 'random';
  passingScore: number;
  maxAttempts: number;
  showAnswers: 'never' | 'after-submit' | 'after-complete';
  estimatedTime: number;
  xpReward: number;
}

// ============================================
// TYPE GUARDS
// ============================================

export function isSelectionItem(item: BaseItem): item is SingleChoiceItem | MultipleChoiceItem | TrueFalseItem {
  return ['single-choice', 'multiple-choice', 'true-false'].includes(item.type);
}

export function isWorkedExampleItem(item: BaseItem): item is SteppedProblemItem | FadedExampleItem | ErrorAnalysisItem {
  return ['stepped-problem', 'faded-example', 'error-analysis', 'two-column-proof'].includes(item.type);
}

export function isInteractiveItem(item: BaseItem): item is NumberLineItem | BaseTenBlocksItem | FractionBarsItem {
  return ['number-line', 'base-ten-blocks', 'fraction-bars', 'balance-scale', 'graphing', 'geometry-construction', 'simulation'].includes(item.type);
}

export function isLiteracyItem(item: BaseItem): item is PassageMCQItem | HighlightEvidenceItem | SentenceCombiningItem {
  return ['passage-mcq', 'highlight-evidence', 'annotation', 'sentence-combining', 'text-reconstruction'].includes(item.type);
}

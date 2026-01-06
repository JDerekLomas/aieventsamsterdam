// AI Activity Generation Utilities

import type { Activity, Question, Standard, Difficulty, QuestionOption } from '@/types';

export interface GenerateActivityRequest {
  standard: Standard;
  difficulty: Difficulty;
  questionCount: number;
  includeHints?: boolean;
  includeExplanations?: boolean;
}

export interface GeneratedActivity {
  title: string;
  description: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedQuestion {
  questionText: string;
  options: QuestionOption[];
  hint?: string;
  explanation?: string;
}

// Prompt templates for AI generation
export const ACTIVITY_GENERATION_PROMPT = `
You are an expert educational content creator specializing in K-8 curriculum aligned to Common Core State Standards.

Generate a practice activity for the following standard:
- Code: {{STANDARD_CODE}}
- Description: {{STANDARD_DESCRIPTION}}
- Grade: {{GRADE}}
- Subject: {{SUBJECT}}

Requirements:
- Difficulty: {{DIFFICULTY}}
- Number of questions: {{QUESTION_COUNT}}
- Include hints: {{INCLUDE_HINTS}}
- Include explanations: {{INCLUDE_EXPLANATIONS}}

Guidelines:
1. Questions should directly assess the standard
2. Use age-appropriate language for Grade {{GRADE}}
3. Include a variety of question formats (word problems, calculations, comparisons)
4. Distractors should represent common misconceptions
5. Hints should guide thinking without giving away the answer
6. Explanations should teach the concept

Format your response as JSON:
{
  "title": "Activity title",
  "description": "Brief description of what students will practice",
  "questions": [
    {
      "questionText": "The question",
      "options": [
        { "id": "a", "text": "Option A", "isCorrect": false },
        { "id": "b", "text": "Option B", "isCorrect": true },
        { "id": "c", "text": "Option C", "isCorrect": false },
        { "id": "d", "text": "Option D", "isCorrect": false }
      ],
      "hint": "A helpful hint (if requested)",
      "explanation": "Why the correct answer is correct (if requested)"
    }
  ]
}
`;

// Mock function for generating activities (replace with actual AI call)
export async function generateActivity(
  request: GenerateActivityRequest
): Promise<GeneratedActivity> {
  // In production, this would call OpenAI/Claude API
  // For now, return mock data

  const { standard, difficulty, questionCount, includeHints, includeExplanations } = request;

  // Mock generated activity
  const mockActivity: GeneratedActivity = {
    title: `${standard.domain} Practice`,
    description: `Practice problems for ${standard.code}: ${standard.description.substring(0, 100)}...`,
    questions: Array.from({ length: questionCount }, (_, i) => ({
      questionText: `Sample question ${i + 1} for ${standard.code}`,
      options: [
        { id: 'a', text: 'Option A', isCorrect: false },
        { id: 'b', text: 'Option B', isCorrect: true },
        { id: 'c', text: 'Option C', isCorrect: false },
        { id: 'd', text: 'Option D', isCorrect: false },
      ],
      hint: includeHints ? `Hint for question ${i + 1}` : undefined,
      explanation: includeExplanations ? `Explanation for question ${i + 1}` : undefined,
    })),
  };

  return mockActivity;
}

// Calculate XP reward based on difficulty and question count
export function calculateXPReward(difficulty: Difficulty, questionCount: number): number {
  const baseXP: Record<Difficulty, number> = {
    EASY: 2,
    MEDIUM: 3,
    HARD: 5,
    ADAPTIVE: 4,
  };

  return baseXP[difficulty] * questionCount;
}

// Estimate completion time based on difficulty and question count
export function estimateCompletionTime(difficulty: Difficulty, questionCount: number): number {
  const minutesPerQuestion: Record<Difficulty, number> = {
    EASY: 1,
    MEDIUM: 1.5,
    HARD: 2,
    ADAPTIVE: 1.5,
  };

  return Math.ceil(minutesPerQuestion[difficulty] * questionCount);
}

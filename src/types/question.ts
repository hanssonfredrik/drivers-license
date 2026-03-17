export type CategoryId =
  | 'trafikregler'
  | 'trafiksakerhet'
  | 'fordonskannedom'
  | 'miljo'
  | 'personliga';

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  trafikregler: 'Trafikregler',
  trafiksakerhet: 'Trafiksäkerhet',
  fordonskannedom: 'Fordonskännedom',
  miljo: 'Miljö',
  personliga: 'Personliga förutsättningar',
};

export const QUIZ_WEIGHTS: Record<CategoryId, number> = {
  trafikregler: 20,
  trafiksakerhet: 16,
  fordonskannedom: 13,
  miljo: 10,
  personliga: 6,
};

export interface Question {
  id: string;
  category: CategoryId;
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  imageId: string | null;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: 0 | 1 | 2 | 3 | null;
  isCorrect: boolean | null;
}

export interface StudyAnswer {
  questionId: string;
  category: CategoryId;
  selectedIndex: 0 | 1 | 2 | 3;
  isCorrect: boolean;
  answeredAt: string;
}

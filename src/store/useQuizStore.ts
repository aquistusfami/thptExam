import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizState {
  answers: Record<string, number>;
  timeLeft: number;
  setAnswer: (questionId: string, optionIndex: number) => void;
  setTimeLeft: (time: number) => void;
  clearQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      answers: {},
      timeLeft: 90 * 60, // 90 minutes
      setAnswer: (questionId, optionIndex) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionIndex },
        })),
      setTimeLeft: (time) => set({ timeLeft: time }),
      clearQuiz: () => set({ answers: {}, timeLeft: 90 * 60 }),
    }),
    { name: 'quiz-storage' }
  )
);

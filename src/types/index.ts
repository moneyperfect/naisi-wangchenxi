export interface Anniversary {
  id: number;
  title: string;
  date: string;
  description: string | null;
  isYearly: boolean;
  createdAt: Date;
}

export interface Photo {
  id: number;
  url: string;
  caption: string | null;
  takenAt: string | null;
  createdAt: Date;
}

export interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
}

export interface Letter {
  id: number;
  author: string;
  title: string | null;
  content: string;
  isRead: boolean;
  scheduledAt: Date | null;
  createdAt: Date;
}

export interface QuizQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
  createdAt: Date;
}

export interface DiaryEntry {
  id: number;
  author: string;
  content: string;
  mood: string | null;
  date: string;
  tag: string;
  createdAt: Date;
}

export interface Wishlist {
  id: number;
  text: string;
  category: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface DailyQuestion {
  id: number;
  question: string;
  createdAt: Date;
}

export interface DailyAnswer {
  id: number;
  questionId: number;
  author: string;
  answer: string;
  createdAt: Date;
}

export interface DateIdea {
  id: number;
  title: string;
  type: string;
  location: string | null;
  duration: string | null;
  locked: boolean;
  lockedBy: string | null;
  createdAt: Date;
}

export interface Rant {
  id: number;
  author: string;
  content: string;
  category: string;
  acknowledged: boolean;
  acknowledgedBy: string | null;
  createdAt: Date;
}

export type StoryItem =
  | (DiaryEntry & { type: "diary" })
  | (TimelineEvent & { type: "milestone" });

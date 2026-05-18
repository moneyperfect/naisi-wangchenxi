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
  createdAt: Date;
}

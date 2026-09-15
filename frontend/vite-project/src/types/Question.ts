export type Question = {
  _id: string;
  eventDate: string;
  category: string;
  question: string;
  answer: string;
  points: number;

  // New multiple-image fields
  questionImages: string[];
  answerImages: string[];

  // Legacy fields for existing questions
  questionImage?: string;
  answerImage?: string;
};

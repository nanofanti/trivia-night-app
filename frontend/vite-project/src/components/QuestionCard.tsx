import { useState } from "react";

import { categoryIcons } from "../data/categories";

type QuestionCardProps = {
  category: string;
  question: string;
  answer: string;
  points: number;

  // New multiple-image fields
  questionImages?: string[];
  answerImages?: string[];

  // Legacy fields for existing questions
  questionImage?: string;
  answerImage?: string;

  showAnswer: boolean;
  isLastQuestion: boolean;
  onShowAnswer: () => void;
  onCorrect: () => void;
  onWrong: () => void;
};

function QuestionCard({
  category,
  question,
  answer,
  points,
  questionImages = [],
  answerImages = [],
  questionImage,
  answerImage,
  showAnswer,
  isLastQuestion,
  onShowAnswer,
  onCorrect,
  onWrong,
}: QuestionCardProps) {
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // Use the new image arrays.
  // If an older question only has the legacy image field,
  // use that image instead.
  const displayedQuestionImages =
    questionImages.length > 0
      ? questionImages
      : questionImage
        ? [questionImage]
        : [];

  const displayedAnswerImages =
    answerImages.length > 0 ? answerImages : answerImage ? [answerImage] : [];

  const handleCorrect = () => {
    if (feedback) {
      return;
    }

    setFeedback("correct");

    setTimeout(() => {
      setFeedback(null);
      onCorrect();
    }, 1000);
  };

  const handleWrong = () => {
    if (feedback) {
      return;
    }

    setFeedback("wrong");

    setTimeout(() => {
      setFeedback(null);
      onWrong();
    }, 1000);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-white/10 sm:p-8">
      {/* Question information */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-trivia-green px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
          <span className="text-sm">
            {categoryIcons[category as keyof typeof categoryIcons]}
          </span>

          <span>{category}</span>
        </span>

        <span className="rounded-full bg-trivia-beige px-3 py-1.5 text-xs font-bold text-trivia-dark">
          {points} {points === 1 ? "point" : "points"}
        </span>
      </div>

      {/* Question */}
      <p className="text-xl font-black leading-relaxed text-trivia-dark dark:text-white sm:text-2xl">
        {question}
      </p>

      {/* Question images */}
      {displayedQuestionImages.length > 0 && (
        <div
          className={`mt-7 grid gap-4 ${
            displayedQuestionImages.length === 1
              ? "grid-cols-1"
              : "sm:grid-cols-2"
          }`}
        >
          {displayedQuestionImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="flex items-center justify-center overflow-hidden rounded-2xl border border-trivia-dark/10 bg-trivia-beige/40 dark:border-white/10"
            >
              <img
                src={image}
                alt={`Question ${index + 1}`}
                className="max-h-[500px] w-full object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {!showAnswer ? (
        <div className="mt-8 border-t border-trivia-dark/10 pt-6 dark:border-white/10">
          <button
            type="button"
            onClick={onShowAnswer}
            className="w-full rounded-xl bg-trivia-gold px-5 py-3.5 font-bold text-trivia-dark shadow-sm transition hover:-translate-y-0.5 hover:bg-trivia-green hover:text-white hover:shadow-md sm:w-auto"
          >
            Show Answer
          </button>
        </div>
      ) : (
        <div className="mt-8 border-t border-trivia-dark/10 pt-7 dark:border-white/10">
          {/* Answer */}
          <div className="rounded-2xl border border-trivia-gold/30 bg-trivia-gold/10 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
              Answer
            </p>

            <p className="mt-3 text-xl font-bold leading-8 text-trivia-dark dark:text-white">
              {answer}
            </p>

            {/* Answer images */}
            {displayedAnswerImages.length > 0 && (
              <div
                className={`mt-5 grid gap-4 ${
                  displayedAnswerImages.length === 1
                    ? "grid-cols-1"
                    : "sm:grid-cols-2"
                }`}
              >
                {displayedAnswerImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="flex items-center justify-center overflow-hidden rounded-xl bg-white/40 dark:bg-white/5"
                  >
                    <img
                      src={image}
                      alt={`Answer ${index + 1}`}
                      className="max-h-[450px] w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback */}
          {feedback ? (
            <div
              className={`mt-7 rounded-2xl px-5 py-6 text-center transition ${
                feedback === "correct"
                  ? "bg-trivia-green text-white"
                  : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
              }`}
            >
              <div className="text-3xl">
                {feedback === "correct" ? "✅" : "❌"}
              </div>

              <p className="mt-2 text-lg font-black">
                {feedback === "correct"
                  ? `Correct! +${points} ${points === 1 ? "point" : "points"}`
                  : "No points this time"}
              </p>

              <p
                className={`mt-1 text-sm ${
                  feedback === "correct"
                    ? "text-trivia-beige"
                    : "text-red-500 dark:text-red-300"
                }`}
              >
                {isLastQuestion
                  ? "Calculating your final score..."
                  : "Next question coming up..."}
              </p>
            </div>
          ) : (
            <div className="mt-7">
              <p className="font-bold text-trivia-dark dark:text-white">
                Did you get it right?
              </p>

              <p className="mt-1 text-sm text-trivia-green dark:text-trivia-beige">
                Be honest — your score depends on it.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCorrect}
                  className="rounded-xl bg-trivia-green px-5 py-4 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  ✅ Correct +{points}
                </button>

                <button
                  type="button"
                  onClick={handleWrong}
                  className="rounded-xl border-2 border-red-500 bg-white px-5 py-4 font-bold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-50 dark:bg-transparent dark:hover:bg-red-500/10"
                >
                  ❌ Wrong
                </button>
              </div>
            </div>
          )}

          {isLastQuestion && !feedback && (
            <div className="mt-6 rounded-xl bg-trivia-gold/20 px-4 py-3 text-center">
              <p className="text-sm font-bold text-trivia-dark dark:text-trivia-gold">
                🏁 Final question
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionCard;

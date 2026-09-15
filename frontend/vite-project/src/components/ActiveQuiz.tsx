import QuestionCard from "./QuestionCard";

import type { Question } from "../types/Question";

type QuizMode = "date" | "category" | "random" | null;

type ActiveQuizProps = {
  quizMode: QuizMode;
  selectedCategory: string | null;
  selectedDate: string | null;
  filteredQuestions: Question[];
  currentQuestionIndex: number;
  score: number;
  showAnswer: boolean;
  formatEventDate: (date: string) => string;
  onBack: () => void;
  onShowAnswer: () => void;
  onCorrect: () => void;
  onWrong: () => void;
};

function ActiveQuiz({
  quizMode,
  selectedCategory,
  selectedDate,
  filteredQuestions,
  currentQuestionIndex,
  score,
  showAnswer,
  formatEventDate,
  onBack,
  onShowAnswer,
  onCorrect,
  onWrong,
}: ActiveQuizProps) {
  if (filteredQuestions.length === 0) {
    return (
      <main className="min-h-screen bg-trivia-beige px-4 py-10 dark:bg-trivia-dark">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-trivia-dark/15 bg-white px-4 py-2 font-semibold text-trivia-dark shadow-sm transition hover:border-trivia-gold hover:bg-trivia-beige dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-trivia-gold"
          >
            ← Back
          </button>

          <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-white/10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-trivia-beige text-5xl">
              🤔
            </div>

            <h1 className="mt-6 text-3xl font-black text-trivia-dark dark:text-white">
              No questions available
            </h1>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-trivia-green dark:text-trivia-beige">
              {quizMode === "category" && selectedCategory
                ? `There are currently no questions in the "${selectedCategory}" category.`
                : quizMode === "date" && selectedDate
                  ? `There are currently no questions available for ${formatEventDate(
                      selectedDate,
                    )}.`
                  : "There are currently no questions available for this quiz."}
            </p>

            <button
              type="button"
              onClick={onBack}
              className="mt-7 rounded-xl bg-trivia-gold px-5 py-3 font-bold text-trivia-dark transition hover:bg-trivia-green hover:text-white"
            >
              Choose Another Quiz
            </button>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const currentQuestionNumber = currentQuestionIndex + 1;

  const progressPercentage =
    (currentQuestionNumber / filteredQuestions.length) * 100;

  const remainingQuestions = filteredQuestions.length - currentQuestionNumber;

  const backLabel =
    quizMode === "date"
      ? "← Back to Trivia Nights"
      : quizMode === "category"
        ? "← Back to Categories"
        : "← Back to Quiz Options";

  const quizTitle =
    quizMode === "category" && selectedCategory
      ? selectedCategory
      : quizMode === "date" && selectedDate === "All"
        ? "All Trivia Nights"
        : quizMode === "date" && selectedDate
          ? formatEventDate(selectedDate)
          : "Lightning Round";

  const quizLabel =
    quizMode === "category"
      ? "Category Quiz"
      : quizMode === "date"
        ? "Trivia Night"
        : "⚡ Lightning Round";

  return (
    <main className="min-h-screen bg-trivia-beige px-4 py-8 dark:bg-trivia-dark sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-trivia-dark/15 bg-white px-4 py-2 font-semibold text-trivia-dark shadow-sm transition hover:border-trivia-gold hover:bg-trivia-beige dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-trivia-gold"
          >
            {backLabel}
          </button>
        </div>

        {/* Quiz header */}
        <section className="mb-6 overflow-hidden rounded-3xl bg-trivia-dark px-6 py-7 text-white shadow-sm sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Quiz information */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-trivia-gold">
                {quizLabel}
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {quizTitle}
              </h1>

              {quizMode === "random" && (
                <p className="mt-2 text-sm text-trivia-beige">
                  A mix of questions from across the trivia library.
                </p>
              )}
            </div>

            {/* Score */}
            <div className="self-start rounded-2xl bg-white/10 px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-trivia-beige">
                Score
              </p>

              <p className="mt-1 text-2xl font-black text-trivia-gold">
                {score}
              </p>
            </div>
          </div>

          {/* Question progress */}
          <div className="mt-8">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-trivia-beige">
                  Progress
                </p>

                <p className="mt-1 text-xl font-black sm:text-2xl">
                  Question {currentQuestionNumber}
                  <span className="font-semibold text-trivia-beige">
                    {" "}
                    of {filteredQuestions.length}
                  </span>
                </p>
              </div>

              <p className="text-sm font-bold text-trivia-gold">
                {Math.round(progressPercentage)}%
              </p>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-trivia-gold transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs font-medium text-trivia-beige">
              {remainingQuestions === 0
                ? "Final question 🏁"
                : `${remainingQuestions} ${
                    remainingQuestions === 1 ? "question" : "questions"
                  } remaining`}
            </p>
          </div>
        </section>

        {/* Question */}
        <QuestionCard
          category={currentQuestion.category}
          question={currentQuestion.question}
          answer={currentQuestion.answer}
          points={currentQuestion.points ?? 1}
          questionImages={currentQuestion.questionImages}
          answerImages={currentQuestion.answerImages}
          questionImage={currentQuestion.questionImage}
          answerImage={currentQuestion.answerImage}
          showAnswer={showAnswer}
          isLastQuestion={currentQuestionIndex === filteredQuestions.length - 1}
          onShowAnswer={onShowAnswer}
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      </div>
    </main>
  );
}

export default ActiveQuiz;

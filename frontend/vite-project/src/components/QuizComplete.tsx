type QuizMode = "date" | "category" | "random" | null;

type QuizCompleteProps = {
  quizMode: QuizMode;
  selectedCategory: string | null;
  selectedDate: string | null;
  score: number;
  totalPossiblePoints: number;
  correctAnswers: number;
  answeredQuestions: number;
  accuracy: number;
  questionCount: number;
  formatEventDate: (date: string) => string;
  onPlayAgain: () => void;
  onBack: () => void;
};

function QuizComplete({
  quizMode,
  selectedCategory,
  selectedDate,
  score,
  totalPossiblePoints,
  correctAnswers,
  answeredQuestions,
  accuracy,
  questionCount,
  formatEventDate,
  onPlayAgain,
  onBack,
}: QuizCompleteProps) {
  const resultEmoji = accuracy >= 80 ? "🏆" : accuracy >= 50 ? "👏" : "💪";

  const resultMessage =
    accuracy >= 80
      ? "Excellent work!"
      : accuracy >= 50
        ? "Nice job!"
        : "Keep practicing!";

  const quizLabel =
    quizMode === "random"
      ? "⚡ Lightning Round"
      : quizMode === "category"
        ? selectedCategory
        : quizMode === "date" && selectedDate === "All"
          ? "All Trivia Nights"
          : quizMode === "date" && selectedDate
            ? formatEventDate(selectedDate)
            : null;

  const backLabel =
    quizMode === "date"
      ? "← Trivia Nights"
      : quizMode === "category"
        ? "← Categories"
        : "← Quiz Options";

  return (
    <main className="min-h-screen bg-trivia-beige px-4 py-10 dark:bg-trivia-dark">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-white/10">
          {/* Result header */}
          <div className="bg-trivia-dark px-6 py-10 text-center text-white sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-trivia-gold text-5xl shadow-md">
              {resultEmoji}
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-trivia-gold">
              Quiz Complete
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              {resultMessage}
            </h1>

            {quizLabel && (
              <p className="mt-3 text-lg font-medium text-trivia-beige">
                {quizLabel}
              </p>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {/* Main score */}
            <div className="mb-8 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-beige">
                Final score
              </p>

              <p className="mt-2 text-6xl font-black text-trivia-dark dark:text-white">
                {score}
                <span className="text-2xl font-bold text-trivia-green dark:text-trivia-beige">
                  {" "}
                  / {totalPossiblePoints}
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-trivia-beige/70 p-5 text-center dark:bg-white/5">
                <p className="text-sm font-semibold text-trivia-green dark:text-trivia-beige">
                  Correct
                </p>

                <p className="mt-2 text-3xl font-black text-trivia-dark dark:text-white">
                  {correctAnswers}
                  <span className="text-lg font-semibold text-trivia-green dark:text-trivia-beige">
                    {" "}
                    / {answeredQuestions}
                  </span>
                </p>
              </div>

              <div className="rounded-2xl bg-trivia-green p-5 text-center text-white">
                <p className="text-sm font-semibold text-trivia-beige">
                  Accuracy
                </p>

                <p className="mt-2 text-3xl font-black">{accuracy}%</p>
              </div>

              <div className="rounded-2xl bg-trivia-gold p-5 text-center">
                <p className="text-sm font-semibold text-trivia-dark/70">
                  Questions
                </p>

                <p className="mt-2 text-3xl font-black text-trivia-dark">
                  {questionCount}
                </p>
              </div>
            </div>

            {/* Accuracy */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-trivia-dark dark:text-white">
                  Accuracy
                </p>

                <p className="text-sm font-black text-trivia-green dark:text-trivia-gold">
                  {accuracy}%
                </p>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-trivia-beige dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-trivia-gold transition-all duration-500"
                  style={{
                    width: `${accuracy}%`,
                  }}
                />
              </div>
            </div>

            <p className="mb-8 text-center text-trivia-green dark:text-trivia-beige">
              You finished all{" "}
              <strong className="text-trivia-dark dark:text-white">
                {questionCount}
              </strong>{" "}
              {questionCount === 1 ? "question" : "questions"}.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onPlayAgain}
                className="flex-1 rounded-xl bg-trivia-gold px-5 py-3.5 font-bold text-trivia-dark shadow-sm transition hover:-translate-y-0.5 hover:bg-trivia-green hover:text-white hover:shadow-md"
              >
                {quizMode === "random"
                  ? "⚡ New Lightning Round"
                  : "↻ Play Again"}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="flex-1 rounded-xl border border-trivia-dark/15 bg-white px-5 py-3.5 font-bold text-trivia-dark transition hover:border-trivia-gold hover:bg-trivia-beige dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-trivia-gold"
              >
                {backLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default QuizComplete;

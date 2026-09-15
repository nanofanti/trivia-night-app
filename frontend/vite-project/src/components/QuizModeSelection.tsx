type QuizModeSelectionProps = {
  onBackHome: () => void;
  onSelectDate: () => void;
  onSelectCategory: () => void;
  onStartLightningRound: () => void;
};

function QuizModeSelection({
  onBackHome,
  onSelectDate,
  onSelectCategory,
  onStartLightningRound,
}: QuizModeSelectionProps) {
  return (
    <main className="min-h-screen bg-trivia-beige px-4 py-10 dark:bg-trivia-dark">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={onBackHome}
          className="mb-8 rounded-xl border border-trivia-dark/15 bg-white px-4 py-2 font-semibold text-trivia-dark shadow-sm transition hover:border-trivia-gold hover:bg-trivia-beige dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-trivia-gold"
        >
          ← Back to Home
        </button>

        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full bg-trivia-gold px-4 py-2 text-sm font-bold text-trivia-dark">
            Choose your challenge
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-trivia-dark sm:text-5xl dark:text-white">
            How do you want to play?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-trivia-green dark:text-trivia-beige">
            Pick a Trivia Night, focus on one category, or jump straight into a
            fast random round.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* By Trivia Night */}
          <button
            onClick={onSelectDate}
            className="group rounded-3xl bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-white/10"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-trivia-beige text-3xl">
              🗓️
            </div>

            <h2 className="text-2xl font-black text-trivia-dark dark:text-white">
              By Trivia Night
            </h2>

            <p className="mt-3 text-sm leading-6 text-trivia-green dark:text-trivia-beige">
              Play all questions from one specific Trivia Night.
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-bold text-trivia-dark dark:text-white">
                Choose a night
              </span>

              <span className="text-xl text-trivia-gold transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>

          {/* By Category */}
          <button
            onClick={onSelectCategory}
            className="group rounded-3xl bg-trivia-green p-7 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              🧠
            </div>

            <h2 className="text-2xl font-black">By Category</h2>

            <p className="mt-3 text-sm leading-6 text-trivia-beige">
              Practice questions from one topic across all Trivia Nights.
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-bold">Choose a category</span>

              <span className="text-xl text-trivia-gold transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>

          {/* Lightning Round */}
          <button
            onClick={onStartLightningRound}
            className="group rounded-3xl bg-trivia-dark p-7 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-trivia-gold text-3xl text-trivia-dark">
              ⚡
            </div>

            <h2 className="text-2xl font-black">Lightning Round</h2>

            <p className="mt-3 text-sm leading-6 text-trivia-beige">
              Jump straight into 10 random questions from any category.
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-bold">Start now</span>

              <span className="text-xl text-trivia-gold transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm font-medium text-trivia-green dark:text-trivia-beige">
            Three ways to play. One goal: beat your score.
          </p>
        </div>
      </div>
    </main>
  );
}

export default QuizModeSelection;

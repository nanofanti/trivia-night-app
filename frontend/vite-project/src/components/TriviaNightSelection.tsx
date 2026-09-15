type TriviaNightSelectionProps = {
  eventDates: string[];
  questionCountsByDate: Record<string, number>;
  formatEventDate: (date: string) => string;
  onBack: () => void;
  onSelectDate: (date: string) => void;
};

function TriviaNightSelection({
  eventDates,
  questionCountsByDate,
  formatEventDate,
  onBack,
  onSelectDate,
}: TriviaNightSelectionProps) {
  const totalQuestions = eventDates.reduce(
    (total, date) => total + (questionCountsByDate[date] ?? 0),
    0,
  );

  return (
    <main className="min-h-screen bg-trivia-beige px-4 py-10 dark:bg-trivia-dark">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={onBack}
          className="mb-8 rounded-xl border border-trivia-dark/15 bg-white px-4 py-2 font-semibold text-trivia-dark shadow-sm transition hover:border-trivia-gold hover:bg-trivia-beige dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-trivia-gold"
        >
          ← Back to Quiz Options
        </button>

        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full bg-trivia-gold px-4 py-2 text-sm font-bold text-trivia-dark">
            🗓️ Previous rounds
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-trivia-dark sm:text-5xl dark:text-white">
            Choose a Trivia Night
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-trivia-green dark:text-trivia-beige">
            Pick one of the previous Trivia Nights or mix everything together.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* All Trivia Nights */}
          <button
            onClick={() => onSelectDate("All")}
            className="group rounded-3xl bg-trivia-dark p-6 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-trivia-gold text-3xl">
                🎲
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-trivia-beige">
                ALL
              </span>
            </div>

            <h2 className="text-xl font-black">All Trivia Nights</h2>

            <p className="mt-3 text-sm leading-6 text-trivia-beige">
              Play questions from every available Trivia Night.
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-trivia-gold">
                {totalQuestions}{" "}
                {totalQuestions === 1 ? "question" : "questions"}
              </span>

              <span className="text-xl text-trivia-gold transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>

          {/* Individual Trivia Nights */}
          {eventDates.map((date, index) => {
            const questionCount = questionCountsByDate[date] ?? 0;

            return (
              <button
                key={date}
                onClick={() => onSelectDate(date)}
                className="group rounded-3xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-white/10"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-trivia-beige text-3xl">
                    🗓️
                  </div>

                  {index === 0 && (
                    <span className="rounded-full bg-trivia-green px-3 py-1 text-xs font-bold text-white">
                      LATEST
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-black leading-7 text-trivia-dark dark:text-white">
                  {formatEventDate(date)}
                </h2>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-trivia-green dark:text-trivia-beige">
                    {questionCount}{" "}
                    {questionCount === 1 ? "question" : "questions"}
                  </span>

                  <span className="text-xl text-trivia-gold transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm font-medium text-trivia-green dark:text-trivia-beige">
            {eventDates.length}{" "}
            {eventDates.length === 1 ? "Trivia Night" : "Trivia Nights"}{" "}
            available
          </p>
        </div>
      </div>
    </main>
  );
}

export default TriviaNightSelection;

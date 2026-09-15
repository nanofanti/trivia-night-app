import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

import type { Question } from "../types/Question";

type AdminScreenProps = {
  questions: Question[];
  authToken: string | null;
  eventDates: string[];
  availableCategories: string[];
  onBackHome: () => void;
  onLogout: () => void;
  onQuestionAdded: () => void;
  onQuestionChanged: () => void;
  onUnauthorized: () => void;
};

function AdminScreen({
  questions,
  authToken,
  eventDates,
  availableCategories,
  onBackHome,
  onLogout,
  onQuestionAdded,
  onQuestionChanged,
  onUnauthorized,
}: AdminScreenProps) {
  return (
    <main className="min-h-screen bg-trivia-beige px-4 py-10 dark:bg-trivia-dark">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBackHome}
            className="self-start rounded-xl border border-trivia-dark/15 bg-white px-4 py-2 font-semibold text-trivia-dark shadow-sm transition hover:border-trivia-gold hover:bg-trivia-beige dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-trivia-gold"
          >
            ← Back to Home
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="self-start rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300"
          >
            Logout
          </button>
        </div>

        {/* Admin header */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-trivia-dark px-6 py-8 text-white shadow-sm sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-trivia-gold text-3xl">
                ⚙️
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-trivia-gold">
                  Admin Area
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                  Manage Questions
                </h1>

                <p className="mt-2 max-w-2xl text-trivia-beige">
                  Add, edit, filter, and organize your trivia question library.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-trivia-beige">
              🔐 Admin session active
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-white/10">
            <p className="text-sm font-semibold uppercase tracking-wider text-trivia-green dark:text-trivia-beige">
              Total Questions
            </p>

            <p className="mt-2 text-3xl font-black text-trivia-dark dark:text-white">
              {questions.length}
            </p>
          </div>

          <div className="rounded-2xl bg-trivia-green p-5 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-trivia-beige">
              Trivia Nights
            </p>

            <p className="mt-2 text-3xl font-black">{eventDates.length}</p>
          </div>

          <div className="rounded-2xl bg-trivia-gold p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-trivia-dark/70">
              Categories
            </p>

            <p className="mt-2 text-3xl font-black text-trivia-dark">
              {availableCategories.length}
            </p>
          </div>
        </section>

        {/* Admin tools */}
        <div className="space-y-8">
          <QuestionForm
            authToken={authToken}
            onQuestionAdded={onQuestionAdded}
            onUnauthorized={onUnauthorized}
          />

          <QuestionList
            questions={questions}
            authToken={authToken}
            onQuestionChanged={onQuestionChanged}
            onUnauthorized={onUnauthorized}
          />
        </div>
      </div>
    </main>
  );
}

export default AdminScreen;

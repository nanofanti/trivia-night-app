import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { categoryIcons } from "../data/categories";

import type { Question } from "../types/Question";

type HomeScreenProps = {
  questions: Question[];
  authToken: string | null;
  randomHomeQuestion: Question | null;
  setRandomHomeQuestion: Dispatch<SetStateAction<Question | null>>;
  onPlayQuiz: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
};

function HomeScreen({
  questions,
  authToken,
  randomHomeQuestion,
  setRandomHomeQuestion,
  onPlayQuiz,
  onOpenAdmin,
  onLogout,
}: HomeScreenProps) {
  const [showWarmUpAnswer, setShowWarmUpAnswer] = useState(false);

  const warmUpQuestionImages = randomHomeQuestion
    ? randomHomeQuestion.questionImages?.length > 0
      ? randomHomeQuestion.questionImages
      : randomHomeQuestion.questionImage
        ? [randomHomeQuestion.questionImage]
        : []
    : [];

  const warmUpAnswerImages = randomHomeQuestion
    ? randomHomeQuestion.answerImages?.length > 0
      ? randomHomeQuestion.answerImages
      : randomHomeQuestion.answerImage
        ? [randomHomeQuestion.answerImage]
        : []
    : [];

  const chooseAnotherQuestion = () => {
    setShowWarmUpAnswer(false);

    if (questions.length === 0) {
      return;
    }

    if (questions.length === 1) {
      setRandomHomeQuestion(questions[0]);
      return;
    }

    let nextQuestion = randomHomeQuestion;

    while (nextQuestion?._id === randomHomeQuestion?._id) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      nextQuestion = questions[randomIndex];
    }

    setRandomHomeQuestion(nextQuestion);
  };

  return (
    <main className="min-h-screen bg-trivia-beige transition-colors dark:bg-trivia-dark">
      {/* Top navigation */}
      <header className="border-b border-trivia-dark/10 bg-white/60 backdrop-blur-sm dark:border-white/10 dark:bg-trivia-dark/80">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-trivia-dark text-xl text-white dark:bg-trivia-gold dark:text-trivia-dark">
              🧠
            </div>

            <div>
              <p className="font-bold tracking-tight text-trivia-dark dark:text-white">
                Trivia Night
              </p>

              <p className="text-xs text-trivia-green dark:text-trivia-beige">
                Test what you know
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Hero */}
        <section className="overflow-hidden rounded-3xl bg-trivia-dark px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left side */}
            <div>
              <span className="inline-flex rounded-full bg-trivia-gold px-4 py-2 text-sm font-bold text-trivia-dark">
                🏆 Monday Trivia
              </span>

              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                Think you know it all?
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-trivia-beige sm:text-xl">
                Play questions from previous Trivia Nights, practice your
                favourite categories, or challenge yourself with a Lightning
                Round.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onPlayQuiz}
                  className="rounded-xl bg-trivia-gold px-6 py-3.5 font-bold text-trivia-dark shadow-md transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                >
                  Play Quiz →
                </button>

                {/* <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:border-trivia-gold hover:bg-white/10"
                >
                  {authToken ? "Manage Questions" : "Admin Login"}
                </button> */}
              </div>
            </div>

            {/* Right side */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="/trivia-night.png"
                alt="Trivia Night"
                className="w-full max-w-md object-contain drop-shadow-2xl lg:max-w-lg"
              />
            </div>
          </div>
        </section>

        {/* Quick info */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-white/10">
            <p className="text-sm font-semibold uppercase tracking-wider text-trivia-green dark:text-trivia-beige">
              Questions
            </p>

            <p className="mt-2 text-3xl font-black text-trivia-dark dark:text-white">
              ⁉️ {questions.length}
            </p>

            <p className="mt-1 text-sm text-trivia-green dark:text-trivia-beige">
              Available to play
            </p>
          </div>

          <div className="rounded-2xl bg-trivia-green p-5 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-trivia-beige">
              Categories
            </p>

            <p className="mt-2 text-3xl font-black">🔥 19</p>

            <p className="mt-1 text-sm text-trivia-beige">
              How broad is your knowledge?
            </p>
          </div>

          <div className="rounded-2xl bg-trivia-gold p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-trivia-dark/70">
              Lightning Round
            </p>

            <p className="mt-2 text-3xl font-black text-trivia-dark">⚡ 10</p>

            <p className="mt-1 text-sm font-medium text-trivia-dark/70">
              Random questions
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Random question */}
          <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-white/10 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-trivia-gold">
                  Warm-up question
                </p>

                <h2 className="mt-2 text-2xl font-black text-trivia-dark dark:text-white">
                  Can you answer this?
                </h2>
              </div>

              {questions.length > 0 && (
                <button
                  type="button"
                  onClick={chooseAnotherQuestion}
                  className="self-start rounded-lg border border-trivia-dark/15 px-4 py-2 text-sm font-semibold text-trivia-dark transition hover:border-trivia-green hover:bg-trivia-beige dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  Another question ↻
                </button>
              )}
            </div>

            {randomHomeQuestion ? (
              <div className="mt-6 rounded-2xl border border-trivia-dark/10 bg-trivia-beige/60 p-6 dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-trivia-green px-3 py-1 text-xs font-bold uppercase text-white">
                    <span className="text-sm">
                      {
                        categoryIcons[
                          randomHomeQuestion.category as keyof typeof categoryIcons
                        ]
                      }
                    </span>

                    <span>{randomHomeQuestion.category}</span>
                  </span>

                  <span className="text-sm font-semibold text-trivia-green dark:text-trivia-beige">
                    {randomHomeQuestion.points ?? 1}{" "}
                    {(randomHomeQuestion.points ?? 1) === 1
                      ? "point"
                      : "points"}
                  </span>
                </div>

                <p className="mt-5 text-xl font-bold leading-8 text-trivia-dark dark:text-white">
                  {randomHomeQuestion.question}
                </p>

                {warmUpQuestionImages.length > 0 && (
                  <div
                    className={`mt-5 grid gap-4 ${
                      warmUpQuestionImages.length === 1
                        ? "grid-cols-1"
                        : "sm:grid-cols-2"
                    }`}
                  >
                    {warmUpQuestionImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="flex items-center justify-center overflow-hidden rounded-xl border border-trivia-dark/10 bg-white/40 dark:border-white/10 dark:bg-white/5"
                      >
                        <img
                          src={image}
                          alt={`Question ${index + 1}`}
                          className="max-h-72 w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {!showWarmUpAnswer ? (
                  <button
                    type="button"
                    onClick={() => setShowWarmUpAnswer(true)}
                    className="mt-6 rounded-xl bg-trivia-gold px-5 py-3 font-bold text-trivia-dark transition hover:bg-trivia-green hover:text-white"
                  >
                    Show Answer
                  </button>
                ) : (
                  <div className="mt-6 border-t border-trivia-dark/10 pt-5 dark:border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
                      Answer
                    </p>

                    <p className="mt-2 text-lg font-bold text-trivia-dark dark:text-white">
                      {randomHomeQuestion.answer}
                    </p>

                    {warmUpAnswerImages.length > 0 && (
                      <div
                        className={`mt-4 grid gap-4 ${
                          warmUpAnswerImages.length === 1
                            ? "grid-cols-1"
                            : "sm:grid-cols-2"
                        }`}
                      >
                        {warmUpAnswerImages.map((image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="flex items-center justify-center overflow-hidden rounded-xl bg-white/40 dark:bg-white/5"
                          >
                            <img
                              src={image}
                              alt={`Answer ${index + 1}`}
                              className="max-h-72 w-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={chooseAnotherQuestion}
                      className="mt-6 rounded-xl bg-trivia-green px-5 py-3 font-bold text-white transition hover:bg-trivia-gold hover:text-trivia-dark"
                    >
                      Next Question →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-trivia-dark/20 p-6 text-center dark:border-white/20">
                <p className="text-trivia-green dark:text-trivia-beige">
                  No questions available yet.
                </p>
              </div>
            )}
          </div>

          {/* Admin card */}
          <div className="relative overflow-hidden rounded-3xl bg-trivia-dark p-6 text-white shadow-sm sm:p-8">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-trivia-green/40" />

            <div className="relative">
              <div className="text-4xl">{authToken ? "⚙️" : "🔐"}</div>

              <h2 className="mt-5 text-2xl font-black">
                {authToken ? "Question Manager" : "Admin Area"}
              </h2>

              <p className="mt-3 leading-7 text-trivia-beige">
                {authToken
                  ? "Add new questions, edit existing ones and keep your Trivia Nights organized."
                  : "Sign in to manage the trivia question database."}
              </p>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="mt-7 rounded-xl bg-trivia-gold px-5 py-3 font-bold text-trivia-dark transition hover:bg-white"
              >
                {authToken ? "Manage Questions →" : "Admin Login →"}
              </button>
              <br />

              {authToken && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-3 rounded-xl border border-red-400/40 bg-red-500/10 px-5 py-3 font-bold text-red-200 transition hover:border-red-400/70 hover:bg-red-500/20 hover:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-10 text-center text-sm font-medium text-trivia-green dark:text-trivia-beige">
          {questions.length} {questions.length === 1 ? "question" : "questions"}{" "}
          currently available
        </footer>
      </div>
    </main>
  );
}

export default HomeScreen;

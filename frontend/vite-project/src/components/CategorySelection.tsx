import { categoryIcons } from "../data/categories";

type CategorySelectionProps = {
  availableCategories: string[];
  questionCountsByCategory: Record<string, number>;
  onBack: () => void;
  onSelectCategory: (category: string) => void;
};

function CategorySelection({
  availableCategories,
  questionCountsByCategory,
  onBack,
  onSelectCategory,
}: CategorySelectionProps) {
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
            🧠 Pick your specialty
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-trivia-dark sm:text-5xl dark:text-white">
            Choose a Category
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-trivia-green dark:text-trivia-beige">
            Focus on one topic and practice questions from every Trivia Night.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {availableCategories.map((category) => {
            const questionCount = questionCountsByCategory[category] ?? 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className="group rounded-3xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-white/10"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-trivia-beige text-3xl">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </div>

                  <span className="rounded-full bg-trivia-green/10 px-3 py-1 text-xs font-bold text-trivia-green dark:bg-white/10 dark:text-trivia-beige">
                    {questionCount}{" "}
                    {questionCount === 1 ? "question" : "questions"}
                  </span>
                </div>

                <h2 className="text-xl font-black text-trivia-dark dark:text-white">
                  {category}
                </h2>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-trivia-green dark:text-trivia-beige">
                    Start category
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
            {availableCategories.length}{" "}
            {availableCategories.length === 1 ? "category" : "categories"}{" "}
            available
          </p>
        </div>
      </div>
    </main>
  );
}

export default CategorySelection;

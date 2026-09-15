type EmptyQuizScreenProps = {
  authToken: string | null;
  onBackHome: () => void;
  onManageQuestions: () => void;
};

function EmptyQuizScreen({
  authToken,
  onBackHome,
  onManageQuestions,
}: EmptyQuizScreenProps) {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900">Trivia Quiz</h1>

        <button
          onClick={onBackHome}
          className="mt-6 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back to Home
        </button>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900">
            No questions available yet
          </h2>

          <p className="mt-3 text-gray-600">
            There are currently no trivia questions in the database.
          </p>

          {authToken && (
            <button
              onClick={onManageQuestions}
              className="mt-6 rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Manage Questions
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default EmptyQuizScreen;

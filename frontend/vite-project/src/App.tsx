import { useEffect, useState } from "react";

import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import AdminScreen from "./components/AdminScreen";
import QuizModeSelection from "./components/QuizModeSelection";
import TriviaNightSelection from "./components/TriviaNightSelection";
import CategorySelection from "./components/CategorySelection";
import QuizComplete from "./components/QuizComplete";
import ActiveQuiz from "./components/ActiveQuiz";
import EmptyQuizScreen from "./components/EmptyQuizScreen";
import ThemeToggle from "./components/ThemeToggle";

import { categories } from "./data/categories";
import { apiRequest } from "./utils/api";

import { toast } from "sonner";

import type { Question } from "./types/Question";

type AppView = "home" | "quiz" | "admin";

type QuizMode = "date" | "category" | "random" | null;

const formatEventDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  const eventDate = new Date(year, month - 1, day);

  return eventDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function App() {
  // --------------------
  // QUESTIONS
  // --------------------

  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState("");

  // --------------------
  // NAVIGATION
  // --------------------

  const [currentView, setCurrentView] = useState<AppView>("home");

  // --------------------
  // AUTHENTICATION
  // --------------------

  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("authToken"),
  );

  const [showLogin, setShowLogin] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");

  const [loginPassword, setLoginPassword] = useState("");

  const [loginError, setLoginError] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);

  // --------------------
  // QUIZ
  // --------------------

  const [quizMode, setQuizMode] = useState<QuizMode>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [randomQuestions, setRandomQuestions] = useState<Question[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);

  const [quizComplete, setQuizComplete] = useState(false);

  const [score, setScore] = useState(0);

  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  // --------------------
  // THEME
  // --------------------

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [randomHomeQuestion, setRandomHomeQuestion] = useState<Question | null>(
    null,
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const withThemeToggle = (content: React.ReactNode) => (
    <>
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {content}
    </>
  );

  // --------------------
  // FETCH QUESTIONS
  // --------------------

  const fetchQuestions = async () => {
    try {
      setFetchError("");

      const response = await apiRequest("/api/questions", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data: Question[] = await response.json();

      setQuestions(data);

      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);

        setRandomHomeQuestion(data[randomIndex]);
      } else {
        setRandomHomeQuestion(null);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);

      setFetchError("Could not load the trivia questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      await fetchQuestions();
    };

    loadQuestions();
  }, []);

  // --------------------
  // LOGIN
  // --------------------

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      setAuthToken(data.token);

      localStorage.setItem("authToken", data.token);

      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
      setShowLogin(false);
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Something went wrong.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");

    setAuthToken(null);
    setCurrentView("home");
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("authToken");

    setAuthToken(null);
    setCurrentView("home");
    setShowLogin(true);

    toast.error("Your session has expired. Please log in again.");
  };

  // --------------------
  // LOADING
  // --------------------

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <div
            className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"
            role="status"
            aria-label="Loading"
          />

          <h1 className="text-xl font-bold text-gray-900">Loading Trivia...</h1>

          <p className="mt-2 text-sm text-gray-500">
            Fetching the latest questions.
          </p>
        </div>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl">⚠️</div>

          <h1 className="text-xl font-bold text-gray-900">
            Could not load questions
          </h1>

          <p className="mt-2 text-sm text-gray-500">{fetchError}</p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchQuestions();
            }}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // --------------------
  // TRIVIA NIGHT DATES
  // --------------------

  const eventDates = [
    ...new Set(questions.map((question) => question.eventDate).filter(Boolean)),
  ]
    .sort()
    .reverse();

  // --------------------
  // AVAILABLE CATEGORIES
  // --------------------

  const availableCategories = categories.filter((category) =>
    questions.some((question) => question.category === category),
  );

  // --------------------
  // FILTER QUESTIONS
  // --------------------

  let filteredQuestions = questions;

  if (quizMode === "date" && selectedDate) {
    filteredQuestions =
      selectedDate === "All"
        ? questions
        : questions.filter((question) => question.eventDate === selectedDate);
  }

  if (quizMode === "category" && selectedCategory) {
    filteredQuestions = questions.filter(
      (question) => question.category === selectedCategory,
    );
  }

  if (quizMode === "random") {
    filteredQuestions = randomQuestions;
  }

  // --------------------
  // SCORE
  // --------------------

  const totalPossiblePoints = filteredQuestions.reduce(
    (total, question) => total + (question.points ?? 1),
    0,
  );

  const accuracy =
    answeredQuestions === 0
      ? 0
      : Math.round((correctAnswers / answeredQuestions) * 100);

  // --------------------
  // QUIZ FUNCTIONS
  // --------------------

  const handleNextQuestion = () => {
    setShowAnswer(false);

    if (currentQuestionIndex === filteredQuestions.length - 1) {
      setQuizComplete(true);
      return;
    }

    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
  };

  const handleCorrectAnswer = () => {
    const currentQuestion = filteredQuestions[currentQuestionIndex];

    const questionPoints = currentQuestion.points ?? 1;

    setScore((previousScore) => previousScore + questionPoints);

    setCorrectAnswers((previousCorrectAnswers) => previousCorrectAnswers + 1);

    setAnsweredQuestions(
      (previousAnsweredQuestions) => previousAnsweredQuestions + 1,
    );

    handleNextQuestion();
  };

  const handleWrongAnswer = () => {
    setAnsweredQuestions(
      (previousAnsweredQuestions) => previousAnsweredQuestions + 1,
    );

    handleNextQuestion();
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setQuizComplete(false);

    setScore(0);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
  };

  // --------------------
  // LIGHTNING ROUND
  // --------------------

  const startLightningRound = () => {
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

    const selectedQuestions = shuffledQuestions.slice(0, 10);

    setRandomQuestions(selectedQuestions);

    setQuizMode("random");

    resetQuiz();
  };

  // --------------------
  // NAVIGATION FUNCTIONS
  // --------------------

  const handleBackHome = () => {
    setCurrentView("home");

    setQuizMode(null);
    setSelectedDate(null);
    setSelectedCategory(null);
    setRandomQuestions([]);

    resetQuiz();
  };

  const handleBackToQuizOptions = () => {
    setQuizMode(null);

    setSelectedDate(null);
    setSelectedCategory(null);
    setRandomQuestions([]);

    resetQuiz();
  };

  const handleBackToSelection = () => {
    setSelectedDate(null);
    setSelectedCategory(null);

    resetQuiz();
  };

  // --------------------
  // QUESTION COUNTS
  // --------------------

  const questionCountsByDate = questions.reduce<Record<string, number>>(
    (counts, question) => {
      counts[question.eventDate] = (counts[question.eventDate] ?? 0) + 1;

      return counts;
    },
    {},
  );

  const questionCountsByCategory = questions.reduce<Record<string, number>>(
    (counts, question) => {
      counts[question.category] = (counts[question.category] ?? 0) + 1;

      return counts;
    },
    {},
  );

  // --------------------
  // LOGIN SCREEN
  // --------------------

  if (showLogin) {
    return withThemeToggle(
      <LoginScreen
        loginEmail={loginEmail}
        loginPassword={loginPassword}
        loginError={loginError}
        loginLoading={loginLoading}
        setLoginEmail={setLoginEmail}
        setLoginPassword={setLoginPassword}
        onSubmit={handleLogin}
        onBack={() => {
          setShowLogin(false);
          setLoginError("");
        }}
      />,
    );
  }

  // --------------------
  // HOME
  // --------------------

  if (currentView === "home") {
    return withThemeToggle(
      <HomeScreen
        questions={questions}
        authToken={authToken}
        randomHomeQuestion={randomHomeQuestion}
        setRandomHomeQuestion={setRandomHomeQuestion}
        onPlayQuiz={() => setCurrentView("quiz")}
        onOpenAdmin={() => {
          if (authToken) {
            setCurrentView("admin");
          } else {
            setShowLogin(true);
          }
        }}
        onLogout={handleLogout}
      />,
    );
  }

  // --------------------
  // ADMIN
  // --------------------

  if (currentView === "admin" && authToken) {
    return withThemeToggle(
      <AdminScreen
        questions={questions}
        authToken={authToken}
        eventDates={eventDates}
        availableCategories={availableCategories}
        onBackHome={() => setCurrentView("home")}
        onLogout={handleLogout}
        onQuestionAdded={fetchQuestions}
        onQuestionChanged={fetchQuestions}
        onUnauthorized={handleUnauthorized}
      />,
    );
  }

  // --------------------
  // EMPTY QUIZ
  // --------------------

  if (currentView === "quiz" && questions.length === 0) {
    return withThemeToggle(
      <EmptyQuizScreen
        authToken={authToken}
        onBackHome={handleBackHome}
        onManageQuestions={() => setCurrentView("admin")}
      />,
    );
  }

  // --------------------
  // CHOOSE QUIZ MODE
  // --------------------

  if (!quizMode) {
    return withThemeToggle(
      <QuizModeSelection
        onBackHome={handleBackHome}
        onSelectDate={() => {
          setQuizMode("date");
          resetQuiz();
        }}
        onSelectCategory={() => {
          setQuizMode("category");
          resetQuiz();
        }}
        onStartLightningRound={startLightningRound}
      />,
    );
  }

  // --------------------
  // CHOOSE TRIVIA NIGHT
  // --------------------

  if (quizMode === "date" && !selectedDate) {
    return withThemeToggle(
      <TriviaNightSelection
        eventDates={eventDates}
        questionCountsByDate={questionCountsByDate}
        formatEventDate={formatEventDate}
        onBack={handleBackToQuizOptions}
        onSelectDate={(date) => {
          setSelectedDate(date);
          resetQuiz();
        }}
      />,
    );
  }

  // --------------------
  // CHOOSE CATEGORY
  // --------------------

  if (quizMode === "category" && !selectedCategory) {
    return withThemeToggle(
      <CategorySelection
        availableCategories={availableCategories}
        questionCountsByCategory={questionCountsByCategory}
        onBack={handleBackToQuizOptions}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          resetQuiz();
        }}
      />,
    );
  }

  // --------------------
  // QUIZ COMPLETE
  // --------------------

  if (quizComplete) {
    return withThemeToggle(
      <QuizComplete
        quizMode={quizMode}
        selectedCategory={selectedCategory}
        selectedDate={selectedDate}
        score={score}
        totalPossiblePoints={totalPossiblePoints}
        correctAnswers={correctAnswers}
        answeredQuestions={answeredQuestions}
        accuracy={accuracy}
        questionCount={filteredQuestions.length}
        formatEventDate={formatEventDate}
        onPlayAgain={quizMode === "random" ? startLightningRound : resetQuiz}
        onBack={
          quizMode === "random"
            ? handleBackToQuizOptions
            : handleBackToSelection
        }
      />,
    );
  }

  // --------------------
  // ACTIVE QUIZ
  // --------------------

  return withThemeToggle(
    <ActiveQuiz
      quizMode={quizMode}
      selectedCategory={selectedCategory}
      selectedDate={selectedDate}
      filteredQuestions={filteredQuestions}
      currentQuestionIndex={currentQuestionIndex}
      score={score}
      showAnswer={showAnswer}
      formatEventDate={formatEventDate}
      onBack={
        quizMode === "random" ? handleBackToQuizOptions : handleBackToSelection
      }
      onShowAnswer={() => setShowAnswer(true)}
      onCorrect={handleCorrectAnswer}
      onWrong={handleWrongAnswer}
    />,
  );
}

export default App;

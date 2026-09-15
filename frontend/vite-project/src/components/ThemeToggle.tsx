type ThemeToggleProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

function ThemeToggle({ darkMode, setDarkMode }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={() => setDarkMode((current) => !current)}
      className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-trivia-dark/15 bg-white/90 px-3 py-2 text-sm font-semibold text-trivia-dark shadow-md backdrop-blur transition hover:border-trivia-gold dark:border-white/20 dark:bg-trivia-dark/90 dark:text-white"
    >
      <span>{darkMode ? "🌙" : "☀️"}</span>

      <span className="hidden sm:inline">{darkMode ? "Dark" : "Light"}</span>

      <span
        className={`relative h-5 w-9 rounded-full transition ${
          darkMode ? "bg-trivia-gold" : "bg-trivia-green"
        }`}
      >
        <span
          className={`absolute top-1 h-3 w-3 rounded-full bg-white transition ${
            darkMode ? "left-5" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

export default ThemeToggle;

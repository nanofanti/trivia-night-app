import { useState } from "react";
import type { FormEvent } from "react";

type LoginScreenProps = {
  loginEmail: string;
  loginPassword: string;
  loginError: string;
  loginLoading: boolean;
  setLoginEmail: (value: string) => void;
  setLoginPassword: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
};

function LoginScreen({
  loginEmail,
  loginPassword,
  loginError,
  loginLoading,
  setLoginEmail,
  setLoginPassword,
  onSubmit,
  onBack,
}: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-trivia-dark/15 bg-white px-4 py-3 text-trivia-dark outline-none transition placeholder:text-trivia-green/40 focus:border-trivia-gold focus:ring-2 focus:ring-trivia-gold/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-trivia-beige/40";

  return (
    <main className="min-h-screen bg-trivia-beige px-4 py-10 transition-colors dark:bg-trivia-dark">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 rounded-xl border border-trivia-dark/15 bg-white px-4 py-2 font-semibold text-trivia-dark shadow-sm transition hover:border-trivia-gold hover:bg-trivia-beige dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-trivia-gold"
        >
          ← Back to Home
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-white/10">
          <div className="bg-trivia-dark px-6 py-10 text-center text-white sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-trivia-gold text-3xl text-trivia-dark shadow-md">
              🔐
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-trivia-gold">
              Admin Area
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Admin Login
            </h1>

            <p className="mt-3 text-trivia-beige">
              Sign in to manage your trivia question library.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-trivia-dark dark:text-white"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-trivia-dark dark:text-white"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`${inputClass} pr-24`}
                  />

                  {loginPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-bold text-trivia-green transition hover:text-trivia-gold dark:text-trivia-beige dark:hover:text-trivia-gold"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
              </div>

              {loginError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-400/30 dark:bg-red-500/10">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                    {loginError}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-xl bg-trivia-gold px-5 py-3.5 font-bold text-trivia-dark shadow-sm transition hover:-translate-y-0.5 hover:bg-trivia-green hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loginLoading ? "Logging in..." : "Login →"}
              </button>
            </form>

            <div className="mt-6 border-t border-trivia-dark/10 pt-5 text-center dark:border-white/10">
              <p className="text-xs leading-5 text-trivia-green dark:text-trivia-beige">
                Admin access is restricted to authorized users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginScreen;

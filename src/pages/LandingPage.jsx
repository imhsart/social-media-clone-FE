import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex flex-col bg-bg font-mono text-text-primary">
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div
          className="bubble w-full max-w-4xl text-center rounded-3xl border border-line px-10 py-14 sm:px-24 sm:py-16"
          style={{
            backgroundImage:
              "linear-gradient(160deg, var(--color-surface), color-mix(in srgb, var(--color-accent-soft) 25%, transparent))",
            boxShadow:
              "0 0 30px -15px color-mix(in srgb, var(--color-accent) 30%, transparent), 0 0 0 1px var(--color-line) inset",
          }}
        >
          <div
            className="inline-block rounded-full px-4 py-1.5 text-sm tracking-wide mb-10 bg-bg text-text-secondary"
            style={{
              boxShadow:
                "0 0 8px -1px color-mix(in srgb, var(--color-accent) 40%, transparent), 0 0 0 1px color-mix(in srgb, var(--color-accent) 30%, transparent) inset",
            }}
          >
            Where your people find you
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold mb-2 leading-tight text-text-primary">
            Welcome to
          </h1>

          <h1
            className="text-6xl sm:text-7xl font-normal mb-4 leading-tight bg-clip-text text-transparent"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              backgroundImage:
                "linear-gradient(135deg, var(--color-text-primary), var(--color-accent))",
            }}
          >
            Saṃyogaḥ
          </h1>

          <p className="text-base mb-10 text-text-secondary">
            The coming together of people
          </p>

          <p className="text-lg leading-relaxed mb-12 max-w-md mx-auto text-text-primary">
            A place to share what's happening in your life and stay close to the people who matter.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3 rounded-lg font-medium text-base bg-accent text-bg
                         transition-all duration-200
                         hover:bg-text-primary hover:-translate-y-0.5
                         hover:shadow-[0_8px_20px_-6px_var(--color-accent)]"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-7 py-3 rounded-lg font-medium text-base border-2 border-text-secondary text-text-primary
                         transition-all duration-200
                         hover:border-accent hover:text-accent hover:bg-accent/10 hover:-translate-y-0.5"
            >
              Log in
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-line py-5 text-center text-xs text-text-secondary">
        Saṃyogaḥ — built to connect, not to scroll forever.
      </footer>
    </div>
  );
}

export default LandingPage
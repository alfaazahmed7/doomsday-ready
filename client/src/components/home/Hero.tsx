import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-label="Hero section">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#0b0d12]/80 dark:bg-[#0b0d12]/90" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[560px] text-center sm:text-left">
          <div className="sm:max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Get Doomsday Ready.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-xl mx-auto sm:mx-0 leading-relaxed">
              Your ultimate MCU rewatch companion. Plan your movie marathon, track your progress, and get
              your crew ready for opening night.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/rewatch-plan"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Start Your Rewatch
              </Link>
              <Link
                to="/movies"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Explore Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

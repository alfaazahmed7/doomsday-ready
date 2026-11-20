import { Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

const links = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/movies' },
  { name: 'Rewatch Plan', path: '/rewatch-plan' },
  { name: 'Booking', path: '/booking' },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0d12]">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-12 py-12">
          <div className="sm:col-span-4 lg:col-span-3">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black" aria-label="Doomsday Ready logo">
                DR
              </Link>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Doomsday Ready</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your ultimate MCU rewatch companion. Plan your marathon, track your progress, and get ready for opening night.
                </p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-5 lg:col-span-4">
            <nav className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Quick Links</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="sm:col-span-3 lg:col-span-3 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-8 sm:pt-0 pl-0 sm:pl-8">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Doomsday Ready is an independent fan-made project and is not affiliated with, endorsed by, or associated with Marvel Studios or Disney.
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              &copy; {CURRENT_YEAR} Doomsday Ready. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

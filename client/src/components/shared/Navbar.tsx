import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/movies' },
  { name: 'Rewatch Plan', path: '/rewatch-plan' },
  { name: 'Booking', path: '/booking' },
];

const linkClasses = (isActive: boolean) =>
  `flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-600 hover:bg-slate-100'
  }`;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black"
              aria-label="Doomsday Ready logo"
            >
              DR
            </Link>
            <Link
              to="/"
              onClick={closeMenu}
              className="text-xl font-bold tracking-tight text-slate-900"
            >
              Doomsday Ready
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => linkClasses(isActive)}
                onClick={closeMenu}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link
              to="/rewatch-plan"
              onClick={closeMenu}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Start Your Rewatch
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={closeMenu}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={(e) => e.stopPropagation()} />
          <div className="fixed right-0 top-0 h-full w-full sm:max-w-md p-6 bg-white border-l border-slate-200 flex flex-col gap-6 shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out md:translate-x-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black"
                  aria-label="Doomsday Ready logo"
                >
                  DR
                </Link>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="text-xl font-bold tracking-tight text-slate-900"
                >
                  Doomsday Ready
                </Link>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:text-slate-900 transition-colors"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="mt-4 flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => linkClasses(isActive)}
                  onClick={closeMenu}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
            <Link
              to="/rewatch-plan"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Start Your Rewatch
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

import { Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/movies' },
  { name: 'Rewatch Plan', path: '/rewatch-plan' },
  { name: 'Booking', path: '/booking' },
];

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Main banner area */}
        <div className="py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Branding */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black"
                  aria-label="Doomsday Ready logo"
                >
                  DR
                </Link>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">Doomsday Ready</h2>
                  <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-[420px] leading-relaxed">
                    Your ultimate MCU rewatch companion. Plan your marathon, track your progress, and get your crew ready for opening night.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-7">
              <nav className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
                <div className="flex flex-wrap gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-0" />

        {/* Copyright & Disclaimer */}
        <div className="py-10 sm:py-12 lg:py-14 border-t border-slate-200 mt-10 sm:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <p className="text-sm text-slate-500 leading-relaxed">
              &copy; {CURRENT_YEAR} Doomsday Ready. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 text-right lg:text-right leading-relaxed">
              Doomsday Ready is an independent fan-made project and is not affiliated with, endorsed by, or associated with Marvel Studios or Disney.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

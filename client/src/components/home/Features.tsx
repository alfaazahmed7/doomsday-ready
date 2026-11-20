import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Movie Collection',
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    description:
      'Manage your MCU movie collection, organize movies, and define prerequisites to maintain the correct viewing order.',
    button: 'Explore Movies',
    href: '/movies',
  },
  {
    title: 'Smart Rewatch Planner',
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 12h-4l-3 3L9 18l6-6" />
        <path d="M2 12h5l3 3-4 4 2-2" />
      </svg>
    ),
    description:
      'Generate an organized movie-watching plan based on movie prerequisites and keep track of your rewatch progress.',
    button: 'Create Rewatch Plan',
    href: '/rewatch-plan',
  },
  {
    title: 'Watch Party Calculator',
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="10" rx="1" ry="1" />
        <line x1="12" y1="7" x2="12" y2="17" />
        <path d="M2 17h20" />
        <line x1="7" y1="7" x2="7" y2="17" />
        <line x1="17" y1="7" x2="17" y2="17" />
      </svg>
    ),
    description:
      'Plan your cinema experience by calculating the minimum number of seat bundles required for your entire group.',
    button: 'Plan Your Booking',
    href: '/booking',
  },
];

export function Features() {
  return (
    <section className="py-16 lg:py-24" aria-label="Features">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Features</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to plan, track, and enjoy your MCU rewatch with your crew.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-500 shadow-sm transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
              <Link
                to={feature.href}
                className="mt-auto flex w-fit items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {feature.button}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

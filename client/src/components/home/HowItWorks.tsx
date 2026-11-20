export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Build Your Collection',
      description:
        'Add MCU movies and define their prerequisites to organize your collection.',
    },
    {
      number: 2,
      title: 'Plan Your Rewatch',
      description:
        'Generate your rewatch plan, follow the correct movie order, and track your watched movies.',
    },
    {
      number: 3,
      title: 'Get Your Crew Ready',
      description:
        'Select a cinema, enter your group size, and calculate the required seat bundles.',
    },
  ];

  return (
    <section className="py-16 lg:py-24" aria-label="How it works">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">How It Works</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Three simple steps to go from your movie list to opening night.
          </p>
        </div>
        <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:gap-8">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="flex flex-col items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 lg:p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-black shrink-0">
                {step.number}
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <svg className="mt-2 hidden lg:block w-6 h-6 text-slate-400 dark:text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                </svg>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

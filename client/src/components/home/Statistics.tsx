type Stat = {
  label: string;
  value: string | number;
};

const stats: Stat[] = [
  { label: 'Total Movies', value: 0 },
  { label: 'Total Cinemas', value: 0 },
  { label: 'Total Watched Movies', value: 0 },
];

export function Statistics() {
  return (
    <section className="py-16 lg:py-24" aria-label="Statistics">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">Statistics</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your MCU rewatch progress at a glance.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-2 text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

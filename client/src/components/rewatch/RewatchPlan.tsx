import type { Movie } from '../../types/movie';
import { RewatchMovie } from './RewatchMovie';
import { ProgressBar } from './ProgressBar';

export function RewatchPlan({
  targetMovie,
  prerequisites,
  isGenerating
}: {
  targetMovie: Movie | null;
  prerequisites: Movie[];
  isGenerating: boolean;
}) {
  const watchedCount = prerequisites.filter((m) => m.watched).length;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <div className="lg:grid-cols-2 gap-8">
            <div>
              {targetMovie && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Selected Movie</h2>
                  <p className="text-slate-600">
                    {targetMovie.title} ({targetMovie.releaseYear})
                  </p>
                  <p className="text-slate-500 font-medium">
                    {targetMovie.runtime} min runtime
                  </p>
                </div>
              )}
            </div>

            <div>
              {prerequisites.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Rewatch Order</h2>
                  <ol className="space-y-3">
                    {prerequisites.map((movie, index) => (
                      <li key={movie._id} className="flex items-center gap-3">
                        <RewatchMovie
                          movie={movie}
                          index={index}
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className="text-slate-600 text-center py-8">
                  You're all caught up! This movie has no prerequisite movies.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {targetMovie && prerequisites.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Summary</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Total Prerequisites</p>
                    <p className="text-3xl font-black text-slate-900">{prerequisites.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Watched</p>
                    <p className="text-3xl font-black text-blue-600">{watchedCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Remaining</p>
                    <p className="text-3xl font-black text-slate-900">{prerequisites.length - watchedCount}</p>
                  </div>
                </div>

                <ProgressBar
                  watchedCount={watchedCount}
                  totalCount={prerequisites.length}
                />

                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-600">Remaining Runtime</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {prerequisites
                      .filter((m) => !m.watched)
                      .reduce((total, m) => total + m.runtime, 0)} min
                  </p>
                </div>
              </div>
            ) : targetMovie && prerequisites.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                You're all caught up! This movie has no prerequisite movies.
              </p>
            ) : (
              <p className="text-slate-600 text-center py-8">Select a target movie to generate a rewatch plan.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
import type { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onToggleWatched: (id: string, watched: boolean) => void;
  onRewatchOrder: (id: string) => void;
}

export function MovieCard({
  movie,
  onEdit,
  onToggleWatched,
  onRewatchOrder
}: MovieCardProps) {
  const handleToggleWatched = () => {
    onToggleWatched(movie._id, !movie.watched);
  };

  return (
    <article
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{movie.title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {movie.releaseYear} &bull; {movie.runtime} min
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                movie.watched
                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {movie.watched ? 'Watched' : 'Unwatched'}
            </span>
            <button
              type="button"
              onClick={handleToggleWatched}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              aria-label={movie.watched ? 'Mark as unwatched' : 'Mark as watched'}
            >
              {movie.watched ? '&#10003;' : '&#10003;'}
            </button>
          </div>
        </div>

        {movie.prerequisites.length > 0 ? (
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prerequisites
            </span>
            <div className="flex flex-wrap gap-2">
              {movie.prerequisites.map((prereq) => (
                <span
                  key={prereq._id}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700"
                >
                  {prereq.title}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="pt-2 border-t border-slate-100 text-sm text-slate-400 italic">
            No prerequisites
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => onEdit(movie)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Edit Movie
          </button>
          <button
            type="button"
            onClick={() => onRewatchOrder(movie._id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            Rewatch Order
          </button>
        </div>
      </div>
    </article>
  );
}

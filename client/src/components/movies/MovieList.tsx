import type { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onToggleWatched: (id: string, watched: boolean) => void;
  onRewatchOrder: (id: string) => void;
}

export function MovieList({
  movies,
  onEdit,
  onToggleWatched,
  onRewatchOrder
}: MovieListProps) {
  if (movies.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Your movie collection is waiting to be assembled.
        </h3>
        <p className="text-sm text-slate-600 max-w-xs mb-6">
          Start by adding your first MCU movie to the collection.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onEdit={onEdit}
          onToggleWatched={onToggleWatched}
          onRewatchOrder={onRewatchOrder}
        />
      ))}
    </div>
  );
}

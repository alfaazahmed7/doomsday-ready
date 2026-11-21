import type { Movie } from '../../types/movie';
import { RiCheckLine, RiArrowDropDownLine } from 'react-icons/ri';

export function RewatchMovie({
  movie,
  index
}: {
  movie: Movie;
  index: number;
}) {
  const watchedClass = `
    px-2 py-1 rounded text-xs font-medium
    ${movie.watched ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'}
  `;

  const icon = movie.watched ? <RiCheckLine className="text-blue-500" /> : <RiArrowDropDownLine className="text-slate-500" />;

  return (
    <div
      key={movie._id}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700"
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
        {index + 1}
      </span>
      <span className="font-medium">{movie.title}</span>
      <span className="text-xs text-slate-400 ml-auto">({movie.releaseYear})</span>
      <span className="ml-3 text-xs font-medium {watchedClass}">
        {movie.watched ? 'Watched' : 'Unwatched'}
      </span>
    </div>
  );
}
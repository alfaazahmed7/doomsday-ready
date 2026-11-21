import { useState, useEffect, useCallback } from 'react';
import type { Movie, MovieStats, CreateMovieData } from '../types/movie';
import {
  createMovie,
  getAllMovies,
  updateMovie,
  getRewatchOrder
} from '../services/movie.services';
import { MovieList } from '../components/movies/MovieList';
import { MovieForm } from '../components/movies/MovieForm';
import { Loading } from '../components/shared/Loading';

export function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const [rewatchOpen, setRewatchOpen] = useState(false);
  const [rewatchMovieId, setRewatchMovieId] = useState<string | null>(null);
  const [rewatchOrder, setRewatchOrder] = useState<Movie[]>([]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMovies();
      setMovies(data);
    } catch (err: any) {
      setError(
        err.message || 'Failed to load movies. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const stats: MovieStats = {
    totalMovies: movies.length,
    totalWatched: movies.filter((m) => m.watched).length,
    totalUnwatched: movies.filter((m) => !m.watched).length
  };

  const handleCreate = async (data: {
    title: string;
    releaseYear: number;
    runtime: number;
    prerequisites: string[];
  }) => {
    try {
      await createMovie(data);
      setFormOpen(false);
      setEditingMovie(null);
      await fetchMovies();
    } catch (err: any) {
      setError(err.message || 'Failed to create movie.');
    }
  };

  const handleUpdate = async (id: string, data: {
    title?: string;
    releaseYear?: number;
    runtime?: number;
    prerequisites?: string[];
    watched?: boolean;
  }) => {
    try {
      const updated = await updateMovie(id, data);
      setFormOpen(false);
      setEditingMovie(null);
      setMovies((prev) =>
        prev.map((m) => (m._id === id ? updated : m))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update movie.');
    }
  };

  const handleToggleWatched = async (id: string, watched: boolean) => {
    const current = movies.find((m) => m._id === id);
    const originalWatched = current?.watched ?? false;

    setMovies((prev) =>
      prev.map((m) => (m._id === id ? { ...m, watched } : m))
    );

    try {
      await updateMovie(id, { watched });
    } catch (err: any) {
      setMovies((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, watched: originalWatched } : m
        )
      );
      setError(err.message || 'Failed to update watched status.');
    }
  };

  const handleRewatchOrder = async (id: string) => {
    setRewatchMovieId(id);
    setRewatchOpen(true);
    try {
      const order = await getRewatchOrder(id);
      setRewatchOrder(order);
    } catch (err: any) {
      setError(err.message || 'Failed to generate rewatch order.');
      setRewatchOpen(false);
    }
  };

  const handleSave = (data: CreateMovieData) => {
    if (editingMovie) {
      handleUpdate(editingMovie._id, {
        title: data.title,
        releaseYear: data.releaseYear,
        runtime: data.runtime,
        prerequisites: data.prerequisites
      });
    } else {
      handleCreate(data);
    }
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Loading message="Loading your movie collection..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchMovies}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
              MCU Movie Collection
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl leading-relaxed">
              Explore and manage your Marvel Cinematic Universe movie
              collection. Organize prerequisites, track your watching progress,
              and prepare for your ultimate rewatch.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingMovie(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            + Add Movie
          </button>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 mb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Total Movies
            </p>
            <p className="mt-2 text-4xl font-black text-slate-900">
              {stats.totalMovies}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Watched Movies
            </p>
            <p className="mt-2 text-4xl font-black text-blue-600">
              {stats.totalWatched}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Unwatched Movies
            </p>
            <p className="mt-2 text-4xl font-black text-slate-900">
              {stats.totalUnwatched}
            </p>
          </div>
        </div>

        <MovieList
          movies={movies}
          onEdit={(movie) => {
            setEditingMovie(movie);
            setFormOpen(true);
          }}
          onToggleWatched={handleToggleWatched}
          onRewatchOrder={handleRewatchOrder}
        />

        <MovieForm
          open={formOpen}
          movie={editingMovie}
          availableMovies={movies}
          onSubmit={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditingMovie(null);
            setError(null);
          }}
        />

        {rewatchOpen && rewatchMovieId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-hidden={!rewatchOpen}
          >
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setRewatchOpen(false)}
            />
            <div className="relative w-full max-w-md p-4 sm:p-6 z-10">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Rewatch Order
                  </h2>
                  <button
                    type="button"
                    onClick={() => setRewatchOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close"
                  >
                    &#215;
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Watch these movies in order before{' '}
                  {rewatchOrder.find((m) => m._id === rewatchMovieId)?.title}
                  :
                </p>
                <ol className="space-y-3">
                  {rewatchOrder.map((movie, index) => (
                    <li
                      key={movie._id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                        movie._id === rewatchMovieId
                          ? 'bg-blue-50 border-blue-100 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 {movie._id === rewatchMovieId ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}">
                        {index + 1}
                      </span>
                      <span className="font-medium">{movie.title}</span>
                      <span className="ml-auto text-xs text-slate-400">
                        ({movie.releaseYear})
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


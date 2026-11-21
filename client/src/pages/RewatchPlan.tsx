import { useState, useEffect, useCallback } from 'react';
import type { Movie } from '../types/movie';
import { getAllMovies, getRewatchOrder } from '../services/movie.services';
import { Loading } from '../components/shared/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RewatchPlan as RewatchPlanComponent } from '../components/rewatch/RewatchPlan';
import { RewatchMovie } from '../components/rewatch/RewatchMovie';

export function RewatchPlan() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [prerequisites, setPrerequisites] = useState<Movie[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Reset prerequisites when selected movie changes
  const handleMovieSelect = useCallback((movie: Movie | null) => {
    setSelectedMovie(movie);
    setPrerequisites([]); // Clear old prerequisites when movie changes
  }, []);

  const handleGenerate = useCallback(async (movieId: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const order = await getRewatchOrder(movieId);
      setPrerequisites(order);
      setSelectedMovie(movies.find((m) => m._id === movieId) || null);
      toast.success('Rewatch plan generated successfully.');
    } catch (err: any) {
      setError(
        err.message || 'Failed to generate rewatch plan. Please try again.'
      );
      toast.error(err.message || 'Failed to generate rewatch plan.');
    } finally {
      setIsGenerating(false);
    }
  }, [movies]); // Depend on movies so find() always uses current list

  const onSelectorChange = useCallback((value: string) => {
    const movie = movies.find((m) => m.title === value);
    handleMovieSelect(movie ?? null);
  }, [movies]); // Depend on movies so find() always uses current list

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
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-slate-900">
            Your MCU Rewatch Plan
          </h1>
          <p className="mt-4 text-center text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Choose your next MCU milestone and discover every movie you need to watch first.
            Track your progress and get ready for the big screen.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Select Target Movie
            </label>
            <select
              value={selectedMovie ? selectedMovie.title : ''}
              onChange={(e) => onSelectorChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
            >
              <option value="">-- Select a movie --</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie.title}>
                  {movie.title} ({movie.releaseYear})
                </option>
              ))}
            </select>
          </div>

          {selectedMovie && (
            <button
              onClick={() => handleGenerate(selectedMovie._id)}
              className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Rewatch Plan'}
            </button>
          )}
        </div>

        {selectedMovie && !isGenerating && (
          <RewatchPlanComponent
            targetMovie={selectedMovie}
            prerequisites={prerequisites}
            isGenerating={isGenerating}
          />
        )}

        {!selectedMovie && (
          <p className="mt-8 text-center text-slate-600">
            Select a target movie above to generate a rewatch plan.
          </p>
        )}
      </div>
    </section>
  );
}
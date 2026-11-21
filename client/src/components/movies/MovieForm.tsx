import { useEffect, useState } from 'react';
import type { Movie, CreateMovieData } from '../../types/movie';

interface MovieFormProps {
  open: boolean;
  movie: Movie | null;
  availableMovies: Movie[];
  onSubmit: (data: CreateMovieData) => void;
  onClose: () => void;
}

interface FormValues {
  title: string;
  releaseYear: string;
  runtime: string;
  prerequisites: string[];
}

export function MovieForm({
  open,
  movie,
  availableMovies,
  onSubmit,
  onClose
}: MovieFormProps) {
  const [formData, setFormData] = useState<FormValues>({
    title: movie?.title || '',
    releaseYear: movie?.releaseYear ? String(movie.releaseYear) : '',
    runtime: movie?.runtime ? String(movie.runtime) : '',
    prerequisites: movie?.prerequisites.map((p) => p._id) || []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // Sync form data with movie prop changes to avoid stale values
  useEffect(() => {
    if (movie !== null) {
      setFormData({
        title: movie.title || '',
        releaseYear: movie.releaseYear ? String(movie.releaseYear) : '',
        runtime: movie.runtime ? String(movie.runtime) : '',
        prerequisites: movie.prerequisites.map((p) => p._id) || []
      });
    } else {
      setFormData({
        title: '',
        releaseYear: '',
        runtime: '',
        prerequisites: []
      });
    }
  }, [movie]);

  const isEdit = movie !== null;

  const eligiblePrerequisites = availableMovies.filter(
    (m) => m._id !== movie?._id
  );

  const selectedIds = new Set(formData.prerequisites);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePrerequisiteToggle = (id: string) => {
    setFormData((prev) => {
      const next = new Set(prev.prerequisites);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ...prev, prerequisites: [...next] };
    });
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.title || !formData.title.trim()) {
      nextErrors.title = 'Movie title is required.';
    }
    const releaseYearNum = Number(formData.releaseYear);
    if (!formData.releaseYear || Number.isNaN(releaseYearNum)) {
      nextErrors.releaseYear = 'Release year is required and must be a valid number.';
    }
    const runtimeNum = Number(formData.runtime);
    if (
      !formData.runtime ||
      Number.isNaN(runtimeNum) ||
      runtimeNum < 1 ||
      runtimeNum > 300
    ) {
      nextErrors.runtime =
        'Runtime is required and must be between 1 and 300 minutes.';
    }
    if (formData.prerequisites.includes(movie?._id || '')) {
      nextErrors.prerequisites = 'A movie cannot be its own prerequisite.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    const releaseYearNum = Number(formData.releaseYear);
    const runtimeNum = Number(formData.runtime);

    const payload: CreateMovieData = {
      title: formData.title.trim(),
      releaseYear: releaseYearNum,
      runtime: runtimeNum,
      prerequisites: formData.prerequisites
    };

    onSubmit(payload);
    setLoading(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl p-4 sm:p-6 z-10">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit Movie' : 'Add Movie'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close form"
            >
              &#215;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Movie Title
              </label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Iron Man"
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Release Year
              </label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.releaseYear}
                onChange={(e) => handleChange('releaseYear', e.target.value)}
                placeholder="e.g. 2008"
                disabled={loading}
              />
              {errors.releaseYear && (
                <p className="mt-1 text-sm text-red-600">{errors.releaseYear}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Runtime (minutes)
              </label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.runtime}
                onChange={(e) => handleChange('runtime', e.target.value)}
                placeholder="e.g. 126"
                disabled={loading}
              />
              {errors.runtime && (
                <p className="mt-1 text-sm text-red-600">{errors.runtime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prerequisite Movies
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Select movies that must be watched before this one.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {eligiblePrerequisites.map((m) => {
                  const isSelected = selectedIds.has(m._id);
                  return (
                    <label key={m._id} className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-colors hover:bg-slate-50 border-transparent">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={() => handlePrerequisiteToggle(m._id)}
                        disabled={loading}
                      />
                      <span className="text-sm text-slate-700">{m.title}</span>
                    </label>
                  );
                })}
                {eligiblePrerequisites.length === 0 && (
                  <p className="col-span-2 text-sm text-slate-500 italic">
                    No other movies available to select as prerequisites.
                  </p>
                )}
              </div>
              {errors.prerequisites && (
                <p className="mt-1 text-sm text-red-600">{errors.prerequisites}</p>
              )}
            </div>

            {message && (
              <p className="mt-2 text-sm text-red-600">{message}</p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Movie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


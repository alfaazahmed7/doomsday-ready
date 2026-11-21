import type { Cinema } from '../../types/cinema';
import { useState, useEffect, useCallback } from 'react';
import { getAllCinemas } from '../../services/cinema.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function CinemaList() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCinemas = useCallback(async () => {
    try {
      const data = await getAllCinemas();
      setCinemas(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load cinemas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCinemas();
  }, [fetchCinemas]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-12 h-12 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-2 text-slate-500">Loading cinemas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchCinemas()}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cinemas.map((cinema) => (
        <div
          key={cinema._id}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <h3 className="text-lg font-bold text-slate-900">{cinema.name}</h3>
          <p className="text-sm text-slate-500">
            Bundles: {cinema.bundleSizes.map((s) => `${s} seat${s !== 1 ? 's' : ''}`).join(', ')}
          </p>
        </div>
      ))}
    </div>
  );
}
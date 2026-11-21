import type { CreateCinemaData } from '../../types/cinema';
import { useState } from 'react';
import { createCinema } from '../../services/cinema.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function CreateCinemaForm({ onCinemaCreated }: { onCinemaCreated?: () => void } = {}) {
  const [name, setName] = useState('');
  const [bundleSizes, setBundleSizes] = useState<number[]>([]);
  const [sizeInput, setSizeInput] = useState('');

  const addSize = () => {
    const size = parseInt(sizeInput, 10);
    if (isNaN(size) || size < 1 || size > 500) {
      toast.error('Bundle size must be an integer between 1 and 500.');
      return;
    }
    if (bundleSizes.includes(size)) {
      toast.error('Duplicate bundle sizes are not allowed.');
      return;
    }
    setBundleSizes([...bundleSizes, size]);
    setSizeInput('');
  };

  const removeSize = (size: number) => {
    setBundleSizes(bundleSizes.filter((s) => s !== size));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Cinema name is required.');
      return;
    }
    if (bundleSizes.length === 0) {
      toast.error('At least one bundle size is required.');
      return;
    }
    if (bundleSizes.length > 10) {
      toast.error('Maximum 10 bundle sizes allowed.');
      return;
    }

    try {
      const data: CreateCinemaData = { name, bundleSizes };
      const cinema = await createCinema(data);
      toast.success('Cinema created successfully.');
      setName('');
      setBundleSizes([]);
      setSizeInput('');
      onCinemaCreated?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create cinema.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Create Cinema</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Cinema Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="e.g., Cinema A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Bundle Sizes</label>
          <div className="grid grid-cols-2 gap-2">
            {bundleSizes.map((size) => (
              <div
                key={size}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm"
              >
                <span>{size} seat{size !== 1 ? 's' : ''}</span>
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            {bundleSizes.length < 10 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <input
                  type="number"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  className="w-20 px-2 py-1 rounded border border-slate-300 focus:outline-none focus:border-blue-500 text-center"
                  min="1"
                  max="500"
                  step="1"
                  placeholder="Add size"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {bundleSizes.length}/10 sizes added
          </p>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!name.trim() || bundleSizes.length === 0}
        >
          Create Cinema
        </button>
      </form>
    </div>
  );
}
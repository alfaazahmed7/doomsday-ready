import type { Cinema, BookingResult } from '../../types/cinema';
import { useState, useEffect, useCallback } from 'react';
import { calculateBooking } from '../../services/cinema.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export function BookingForm({ cinemas, selectedCinema, setSelectedCinema }: { cinemas: Cinema[], selectedCinema: Cinema | null, setSelectedCinema: React.Dispatch<React.SetStateAction<Cinema | null>> }) {
  const [groupSize, setGroupSize] = useState(0);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear result when selected cinema changes
  useEffect(() => {
    setResult(null);
  }, [selectedCinema]);

  // Clear result when group size changes
  useEffect(() => {
    setResult(null);
  }, [groupSize]);

  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setGroupSize(0);
    } else {
      setGroupSize(num);
    }
    setResult(null);
  };

  const handleCalculate = useCallback(async () => {
    if (!selectedCinema) {
      toast.error('Please select a cinema first.');
      return;
    }
    if (groupSize < 1 || groupSize > 10000) {
      toast.error('Please enter a valid group size (1-10000).');
      return;
    }

    setLoading(true);
    try {
      const booking = await calculateBooking(selectedCinema._id, groupSize);
      setResult(booking);
      if (!booking.possible) {
        toast.warning('Exact combination not possible with available bundle sizes.');
      } else {
        toast.success('Booking calculated successfully.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to calculate booking.');
    } finally {
      setLoading(false);
    }
  }, [selectedCinema, groupSize]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 max-w-2xl mx-auto">
      <h1 className="text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-2">
        Cinema Booking Calculator
      </h1>
      <p className="mt-2 text-center text-lg text-slate-600">
        Select a cinema and enter a group size to find the optimal ticket bundle combination.
      </p>

      {/* Cinema Selection Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Select Cinema
        </label>
        <select
          value={selectedCinema ? selectedCinema.name : ''}
          onChange={(e) => {
            const cinema = cinemas.find((c) => c.name === e.target.value);
            setSelectedCinema(cinema || null);
          }}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
        >
          <option value="">-- Select a cinema --</option>
          {cinemas.map((cinema) => (
            <option key={cinema._id} value={cinema.name}>
              {cinema.name} ({cinema.bundleSizes.map((s) => s + ' seat').join(', ')})
            </option>
          ))}
        </select>
      </div>

      {/* Group Size Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Group Size
        </label>
        <input
          type="number"
          value={groupSize}
          onChange={handleGroupSizeChange}
          min="1"
          max="10000"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
          placeholder="e.g., 6"
        />
      </div>

      {/* Calculate Button */}
      <div className="mb-6">
        <button
          onClick={handleCalculate}
          disabled={loading || !selectedCinema || groupSize < 1 || groupSize > 10000}
          className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Calculate Booking'}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="mt-8 p-4 rounded-2xl border {
          result?.possible ? 'border-green-500' : 'border-red-500'
        } bg-${
          result?.possible ? 'green-50' : 'red-50'
        } text-${
          result?.possible ? 'green-700' : 'red-700'
        }">
          {result?.possible ? (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Booking Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">Cinema</p>
                  <p className="font-medium">{selectedCinema?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Group Size</p>
                  <p className="font-medium">{groupSize} people</p>
                </div>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-slate-200 p-2 text-left text-sm font-medium text-slate-500">Bundle Size</th>
                    <th className="border border-slate-200 p-2 text-left text-sm font-medium text-slate-500">Quantity</th>
                    <th className="border border-slate-200 p-2 text-left text-sm font-medium text-slate-500">Total Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {result?.bundles.map((bundle) => (
                    <tr key={bundle.size}>
                      <td className="border border-slate-200 p-2">{bundle.size} seats</td>
                      <td className="border border-slate-200 p-2">{bundle.quantity} bundle{bundle.size !== 1 ? 's' : ''}</td>
                      <td className="border border-slate-200 p-2">{bundle.size * bundle.quantity} seats</td>
                    </tr>
                  ))}
                  {result?.totalBundles > 0 && (
                    <tr>
                      <td className="border border-slate-200 p-2 font-bold" colSpan={3}>
                        Total: {result?.totalBundles} bundles, {result?.totalSeats} seats
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <p className="text-center text-red-600 mb-4">
                Unfortunately, this cinema cannot accommodate exactly {groupSize} people with its available bundle sizes.
              </p>
              <p className="text-center text-slate-500">
                The cinema's bundle sizes are: {selectedCinema?.bundleSizes.map((s) => s + ' seat').join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {!selectedCinema && (
        <p className="mt-8 text-center text-slate-600">
          Select a cinema above to begin.
        </p>
      )}
    </div>
  );
}
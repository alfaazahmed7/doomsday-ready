import { useCallback, useEffect, useState } from 'react';
import { CreateCinemaForm } from '../components/cinema/CreateCinemaForm';
import { BookingForm } from '../components/cinema/BookingForm';
import { calculateBooking, getAllCinemas } from '../services/cinema.services';
import type { BookingResult, Cinema } from '../types/cinema';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function Booking() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [groupSize, setGroupSize] = useState(0);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate('');

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const data = await getAllCinemas();
      setCinemas(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load cinemas.');
    }
  };

  useEffect(() => {
    setResult(null);
  }, [selectedCinema]);

  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setGroupSize(0);
    } else {
      setGroupSize(num);
    }
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
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <CreateCinemaForm onCinemaCreated={fetchCinemas} />
            </div>
            <div>
              <BookingForm cinemas={cinemas} selectedCinema={selectedCinema} setSelectedCinema={setSelectedCinema} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Booking;
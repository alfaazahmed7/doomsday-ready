import { useEffect } from 'react';
import { CreateCinemaForm } from '../components/cinema/CreateCinemaForm';
import { BookingForm } from '../components/cinema/BookingForm';
import 'react-toastify/dist/ReactToastify.css';

function Booking() {
  useEffect(() => {
    // Initialize when page loads
  }, []);

return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <CreateCinemaForm />
            </div>
            <div>
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Booking;
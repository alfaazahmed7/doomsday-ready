import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/shared/Navbar';
import { Footer } from './components/shared/Footer';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { RewatchPlan } from './pages/RewatchPlan';
import { Booking } from './pages/Booking';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/rewatch-plan" element={<RewatchPlan />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

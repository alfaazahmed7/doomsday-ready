import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { Statistics } from '../components/home/Statistics';
import { HowItWorks } from '../components/home/HowItWorks';

export function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Statistics />
      <HowItWorks />
    </>
  );
}

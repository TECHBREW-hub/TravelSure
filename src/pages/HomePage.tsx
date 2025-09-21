import { HeroSection } from '../components/HeroSection';
import { CitySelector } from '../components/CitySelector';
import { FeaturedDestinations } from '../components/FeaturedDestinations';
import { ServicesSection } from '../components/ServicesSection';
import { PromoSection } from '../components/PromoSection';
import { useData } from '../hooks/useData';

export function HomePage() {
  // Initialize data loading
  useData();
  
  return (
    <main className="flex-1">
      <HeroSection />
      <CitySelector />
      <FeaturedDestinations />
      <ServicesSection />
      <PromoSection />
    </main>
  );
}
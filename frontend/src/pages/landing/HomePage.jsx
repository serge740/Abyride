import HeroSection from '../../components/landing/home/HeroSection';
import PartnersSection from '../../components/landing/home/PartnersSection';
import ServicesSection from '../../components/landing/home/ServicesSection';
import WhyAbyride from '../../components/landing/home/WhyAbyride';
import AppShowcase from '../../components/landing/home/AppShowcase';
import SuccessSection from '../../components/landing/home/SuccessSection';
import NewsBanner from '../../components/landing/home/NewsBanner';
import TestimonialsSection from '../../components/landing/home/TestimonialsSection';
import BlogSection from '../../components/landing/home/BlogSection';
import DriverCTA from '../../components/landing/home/DriverCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PartnersSection />
      <ServicesSection />
      <WhyAbyride />
      <AppShowcase />
      <SuccessSection />
      <NewsBanner />
      <TestimonialsSection />
      <BlogSection />
      <DriverCTA />
    </>
  );
}

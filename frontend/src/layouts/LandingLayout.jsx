import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

export default function LandingLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </LanguageProvider>
    </ThemeProvider>
  );
}

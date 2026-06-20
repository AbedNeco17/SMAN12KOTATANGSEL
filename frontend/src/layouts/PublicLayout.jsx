import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import InteractiveGrid from '@components/ui/InteractiveGrid';

const PublicLayout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Wait slightly for layout rendering
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="flex flex-col min-h-[100dvh] relative bg-slate-50/10 overflow-hidden">
      {/* Dynamic interactive grid lines canvas running globally on page body background */}
      <InteractiveGrid />
      
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

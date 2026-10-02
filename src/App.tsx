import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { ProductCatalog } from './components/ProductCatalog';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import type { Product } from './types';
import { StorageService } from './services/storage';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeView, setActiveView] = useState<'home' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initialize data and check login
  useEffect(() => {
    // Load products
    const initial = StorageService.getProducts();
    setProducts(initial);

    // Check auth
    const user = StorageService.getCurrentUser();
    if (user) {
      setIsAdminLoggedIn(true);
    }

    // Check URL hash for direct #admin route
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        const currentUser = StorageService.getCurrentUser();
        if (currentUser) {
          setActiveView('admin');
        } else {
          setIsLoginModalOpen(true);
        }
      } else {
        setActiveView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleRefreshProducts = () => {
    const updated = StorageService.getProducts();
    setProducts(updated);
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setActiveView('admin');
      window.location.hash = '#admin';
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsLoginModalOpen(false);
    setActiveView('admin');
    window.location.hash = '#admin';
  };

  const handleLogout = () => {
    StorageService.logout();
    setIsAdminLoggedIn(false);
    setActiveView('home');
    window.location.hash = '';
  };

  const handleNavigateHome = () => {
    setActiveView('home');
    window.location.hash = '';
  };

  const handleExploreProducts = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfc] text-gray-800 font-sans selection:bg-[#88C025]/20 selection:text-[#13331c]">
      {/* Navigation */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
        activeView={activeView}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content */}
      <main className="flex-1">
        {activeView === 'home' ? (
          <>
            <Hero onExploreProducts={handleExploreProducts} />
            <Services />
            <ProductCatalog products={products} />
            <AboutSection />
            <Footer onOpenAdmin={handleOpenAdmin} />
            <FloatingWhatsApp />
          </>
        ) : (
          <AdminDashboard
            products={products}
            onRefreshProducts={handleRefreshProducts}
            onNavigateHome={handleNavigateHome}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;

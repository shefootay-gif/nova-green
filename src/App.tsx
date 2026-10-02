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
import { ProductDetailsModal } from './components/ProductDetailsModal';
import type { Product, CompanySettings } from './types';
import { StorageService, DEFAULT_SETTINGS } from './services/storage';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [activeView, setActiveView] = useState<'home' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  // Initialize data and check login
  useEffect(() => {
    // Load products & settings
    const initial = StorageService.getProducts();
    setProducts(initial);

    const initialSettings = StorageService.getSettings();
    setSettings(initialSettings);

    // Check auth
    const user = StorageService.getCurrentUser();
    if (user) {
      setIsAdminLoggedIn(true);
    }

    // Check URL hash for direct #admin route
    const handleHash = () => {
      const isDemo = window.location.search.includes('admin=demo');
      if (window.location.hash === '#admin' || isDemo) {
        const currentUser = StorageService.getCurrentUser();
        if (currentUser || isDemo) {
          setIsAdminLoggedIn(true);
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

  const handleRefreshSettings = () => {
    const updatedSettings = StorageService.getSettings();
    setSettings(updatedSettings);
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
        whatsappNumber={settings.whatsapp}
      />

      {/* Main Content */}
      <main className="flex-1">
        {activeView === 'home' ? (
          <>
            <Hero 
              onExploreProducts={handleExploreProducts} 
              whatsappNumber={settings.whatsapp} 
              hero={settings.hero}
              trustRibbon={settings.trustRibbon}
            />
            <Services servicesData={settings.services} />
            <ProductCatalog
              products={products}
              whatsappNumber={settings.whatsapp}
              onSelectProduct={(p) => setSelectedProductModal(p)}
              catalogNotice={settings.catalogNotice}
            />
            <AboutSection aboutData={settings.about} />
            <Footer 
              settings={settings} 
              onOpenAdmin={handleOpenAdmin} 
            />
            <FloatingWhatsApp phoneNumber={settings.whatsapp} />
          </>
        ) : (
          <AdminDashboard
            products={products}
            settings={settings}
            onRefreshProducts={handleRefreshProducts}
            onRefreshSettings={handleRefreshSettings}
            onNavigateHome={handleNavigateHome}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        settings={settings}
      />

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

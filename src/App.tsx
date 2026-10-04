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
import { ProductDetailPage } from './components/ProductDetailPage';
import type { Product, CompanySettings } from './types';
import { StorageService, DEFAULT_SETTINGS, PRODUCTS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './services/storage';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [activeView, setActiveView] = useState<'home' | 'admin' | 'product'>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
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

    // Check URL hash for direct #admin or #product-<id> route
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        const currentUser = StorageService.getCurrentUser();
        if (currentUser) {
          setIsAdminLoggedIn(true);
          setActiveView('admin');
        } else {
          // Clear the hash and show login modal
          window.location.hash = '';
          setIsLoginModalOpen(true);
        }
      } else if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const currentProducts = StorageService.getProducts();
        const found = currentProducts.find((p) => p.id === prodId);
        if (found) {
          setActiveProduct(found);
          setActiveView('product');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setActiveView('home');
        }
      } else {
        setActiveView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Synchronize products and settings automatically across tabs/windows via BroadcastChannel & StorageEvent
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PRODUCTS_STORAGE_KEY || !e.key) {
        setProducts(StorageService.getProducts());
      }
      if (e.key === SETTINGS_STORAGE_KEY || !e.key) {
        setSettings(StorageService.getSettings());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const unsubscribeSync = StorageService.onSync((type) => {
      if (type === 'products' || type === 'all') {
        setProducts(StorageService.getProducts());
      }
      if (type === 'settings' || type === 'all') {
        setSettings(StorageService.getSettings());
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('storage', handleStorageChange);
      unsubscribeSync();
    };
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
              onSelectProduct={(p) => {
                setSelectedProductModal(p);
              }}
              onOpenProductPage={(p) => {
                setActiveProduct(p);
                setActiveView('product');
                window.location.hash = `#product-${p.id}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              catalogNotice={settings.catalogNotice}
              showPrices={settings.showPrices}
              showDiscounts={settings.showDiscounts}
            />
            <AboutSection aboutData={settings.about} />
            <Footer 
              settings={settings} 
              onOpenAdmin={handleOpenAdmin} 
            />
            <FloatingWhatsApp phoneNumber={settings.whatsapp} />
          </>
        ) : activeView === 'product' && activeProduct ? (
          <>
            <ProductDetailPage
              product={activeProduct}
              settings={settings}
              onBack={handleNavigateHome}
            />
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
        onOpenFullPage={(p) => {
          setActiveProduct(p);
          setActiveView('product');
          window.location.hash = `#product-${p.id}`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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

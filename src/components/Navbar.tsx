import { useState, type FC } from 'react';
import { Menu, X, Shield, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  activeView: 'home' | 'admin';
  onNavigateHome: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
  activeView,
  onNavigateHome,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    if (activeView === 'admin') {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/logo.png" 
              alt="Nova Green - نوفا جرين" 
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </div>

          {/* Desktop Navigation */}
          {activeView === 'home' ? (
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
              <button 
                onClick={() => scrollTo('hero')} 
                className="hover:text-[#88C025] transition-colors py-1 cursor-pointer"
              >
                الرئيسية
              </button>
              <button 
                onClick={() => scrollTo('services')} 
                className="hover:text-[#88C025] transition-colors py-1 cursor-pointer"
              >
                ماذا نقدم؟
              </button>
              <button 
                onClick={() => scrollTo('catalog')} 
                className="hover:text-[#88C025] transition-colors py-1 cursor-pointer flex items-center gap-1.5"
              >
                <span>كتالوج المنتجات</span>
                <span className="w-2 h-2 rounded-full bg-[#88C025] animate-pulse"></span>
              </button>
              <button 
                onClick={() => scrollTo('about')} 
                className="hover:text-[#88C025] transition-colors py-1 cursor-pointer"
              >
                من نحن
              </button>
              <button 
                onClick={() => scrollTo('contact')} 
                className="hover:text-[#88C025] transition-colors py-1 cursor-pointer"
              >
                تواصل معنا
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onNavigateHome}
                className="text-sm font-bold text-gray-700 hover:text-[#88C025] transition-colors px-4 py-2"
              >
                العودة إلى واجهة الموقع
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/201131603110?text=السلام%20عليكم%20،%20أود%20طلب%20استشارة%20زراعية%20من%20نوفا%20جرين"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-[#13331c] bg-[#f2f9e8] hover:bg-[#e4f5d3] border border-[#88C025]/30 px-3.5 py-2 rounded-full transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#88C025]" />
              <span>استشارة زراعية</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="لوحة تحكم إضافة المنتجات"
            >
              <Shield className="w-3.5 h-3.5 text-[#22A3E2]" />
              <span>{isAdminLoggedIn ? 'لوحة التحكم' : 'دخول الإدارة'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-gray-600 hover:text-[#88C025]"
              title="لوحة التحكم"
            >
              <Shield className="w-5 h-5 text-[#22A3E2]" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 rounded-lg hover:bg-gray-100"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {activeView === 'home' ? (
            <>
              <button
                onClick={() => scrollTo('hero')}
                className="block w-full text-right py-2 text-sm font-semibold text-gray-800 hover:text-[#88C025]"
              >
                الرئيسية
              </button>
              <button
                onClick={() => scrollTo('services')}
                className="block w-full text-right py-2 text-sm font-semibold text-gray-800 hover:text-[#88C025]"
              >
                ماذا نقدم؟
              </button>
              <button
                onClick={() => scrollTo('catalog')}
                className="block w-full text-right py-2 text-sm font-semibold text-gray-800 hover:text-[#88C025]"
              >
                كتالوج المنتجات
              </button>
              <button
                onClick={() => scrollTo('about')}
                className="block w-full text-right py-2 text-sm font-semibold text-gray-800 hover:text-[#88C025]"
              >
                من نحن والرؤية
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="block w-full text-right py-2 text-sm font-semibold text-gray-800 hover:text-[#88C025]"
              >
                تواصل معنا
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onNavigateHome();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-right py-2 text-sm font-bold text-[#88C025]"
            >
              ← العودة لواجهة الموقع
            </button>
          )}

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <a
              href="https://wa.me/201131603110?text=السلام%20عليكم%20،%20أود%20طلب%20استشارة%20زراعية%20من%20نوفا%20جرين"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-bold text-[#13331c] bg-[#f2f9e8] py-2.5 rounded-xl border border-[#88C025]/30"
            >
              <PhoneCall className="w-4 h-4 text-[#88C025]" />
              <span>اطلب استشارة زراعية الآن</span>
            </a>

            <button
              onClick={() => {
                onOpenAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#13331c] py-2.5 rounded-xl shadow-xs"
            >
              <Shield className="w-4 h-4 text-[#22A3E2]" />
              <span>{isAdminLoggedIn ? 'فتح لوحة التحكم' : 'دخول المشرف'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

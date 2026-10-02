import type { FC } from 'react';
import { ArrowDown, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExploreProducts: () => void;
}

export const Hero: FC<HeroProps> = ({ onExploreProducts }) => {
  return (
    <section id="hero" className="relative pt-8 pb-12 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#88C025]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#22A3E2]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Top Badge: حلول زراعية • جودة • ثقة */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f9e8] border border-[#88C025]/30 text-[#4c7412] text-xs sm:text-sm font-bold mb-6 shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#88C025]" />
          <span>حلول زراعية • جودة • ثقة</span>
        </div>

        {/* Main Headline: نزرع النجاح مع كل مزارع */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          نزرع النجاح <br className="hidden sm:inline" />
          <span className="text-[#88C025] relative inline-block">
            مع كل مزارع
            <svg 
              className="absolute -bottom-2 left-0 w-full h-3 text-[#22A3E2]/40" 
              viewBox="0 0 100 12" 
              preserveAspectRatio="none"
            >
              <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
          نوفا جرين شركة متخصصة في مستلزمات الزراعة، نقدم حلولاً ومنتجات تساعد المزارعين على تحسين جودة المحصول وتحقيق أفضل نتائج ممكنة.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <button
            onClick={onExploreProducts}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#88C025] hover:bg-[#77ab1f] text-white font-bold text-base shadow-md shadow-[#88C025]/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>استكشف منتجاتنا</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <a
            href="https://wa.me/201131603110?text=السلام%20عليكم%20،%20أود%20طلب%20استشارة%20زراعية%20بخصوص%20محصولي%20من%20نوفا%20جرين"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#13331c] font-bold text-base border-2 border-[#88C025]/40 hover:border-[#88C025] transition-all cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-5 h-5 text-[#22A3E2]" />
            <span>اطلب استشارة زراعية</span>
          </a>
        </div>

        {/* Logo Card Section (Exactly as in the video frame 00:01) */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl shadow-gray-200/50 max-w-xl mx-auto flex flex-col items-center justify-center group hover:border-[#88C025]/30 transition-all">
          <div className="w-56 sm:w-64 max-w-full">
            <img
              src="/logo.png"
              alt="Nova Green Logo"
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          <div className="mt-4 flex items-center gap-6 text-xs text-gray-500 font-semibold border-t border-gray-100 pt-4 w-full justify-center">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#88C025]" />
              <span>علامة تجارية معتمدة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22A3E2]" />
              <span>أعلى معايير الجودة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import type { FC } from 'react';
import { ArrowDown, MessageCircle, Sparkles, Sprout, Award, Truck, CheckCircle2 } from 'lucide-react';
import { Animated3DLogo } from './Animated3DLogo';

interface HeroProps {
  onExploreProducts: () => void;
  whatsappNumber?: string;
}

export const Hero: FC<HeroProps> = ({ 
  onExploreProducts, 
  whatsappNumber = '011 31603110' 
}) => {
  const rawPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.startsWith('0') ? '2' + rawPhone : rawPhone;

  return (
    <section id="hero" className="relative pt-8 sm:pt-12 pb-16 overflow-hidden bg-gradient-to-b from-[#f4f9f1] via-[#fbfdfa] to-white border-b border-gray-100">
      {/* Decorative Brand Gradient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#88C025]/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow"></div>
      <div className="absolute top-40 left-10 w-96 h-96 bg-[#22A3E2]/18 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      {/* Floating Ambient Organic Elements */}
      <div className="absolute top-24 left-[15%] text-[#88C025]/30 pointer-events-none animate-float-badge-1 hidden md:block">
        <Sprout className="w-8 h-8" />
      </div>
      <div className="absolute top-36 right-[8%] text-[#22A3E2]/25 pointer-events-none animate-float-badge-2 hidden md:block">
        <Sparkles className="w-7 h-7" />
      </div>
      <div className="absolute bottom-20 left-[8%] text-[#88C025]/25 pointer-events-none animate-float-badge-2 hidden md:block">
        <Award className="w-9 h-9" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Right Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-right space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#88C025]/40 shadow-xs text-xs sm:text-sm font-black text-[#386208]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#88C025] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#88C025]"></span>
              </span>
              <span>حلول زراعية متطورة • جودة موثوقة • إنتاجية أعلى</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.18] tracking-tight">
              نزرع النجاح <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22A3E2] via-[#5db930] to-[#88C025]">
                مع كل مزارع مصري
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              شركة <strong>نوفا جرين (Nova Green)</strong> متخصصة في تقديم أحدث مركبات التغذية النباتية، المخصبات الحيوية، والمبيدات الوقائية والعلاجية لضمان أعلى إنتاجية وأفضل جودة تسويقية لمحصولك.
            </p>

            {/* Highlights Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-bold text-gray-700 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-[#88C025]/40 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#88C025] shrink-0" />
                <span>مركبات أصلية معتمدة ومسجلة</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-[#22A3E2]/40 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#22A3E2] shrink-0" />
                <span>دعم واستشارات فنية مجانية</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-[#88C025]/40 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#88C025] shrink-0" />
                <span>أسعار تنافسية وعروض حصرية</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-[#22A3E2]/40 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#22A3E2] shrink-0" />
                <span>شحن وتوريد سريع لكافة المحافظات</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#88C025] to-[#70a518] hover:from-[#76ab1c] hover:to-[#5e8f13] text-white font-black text-base shadow-lg shadow-[#88C025]/30 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                <span>استكشف كتالوج المنتجات (17 منتج)</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('السلام عليكم ، أود طلب استشارة زراعية بخصوص محصولي من شركة نوفا جرين')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-[#f9fbf8] text-[#13331c] font-black text-base border-2 border-[#22A3E2]/50 hover:border-[#22A3E2] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 text-[#22A3E2] group-hover:scale-110 transition-transform" />
                <span>استشارة زراعية فورية (واتساب)</span>
              </a>
            </div>
          </div>

          {/* Left Column: 3D Interactive Animated Logo */}
          <div className="lg:col-span-5 flex justify-center">
            <Animated3DLogo />
          </div>
        </div>

        {/* Floating Trust Metrics Ribbon */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-gray-200/80 shadow-md">
          <div className="flex items-center gap-3.5 p-2 group hover:scale-102 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f9e8] text-[#88C025] flex items-center justify-center shrink-0 border border-[#88C025]/30 group-hover:bg-[#88C025] group-hover:text-white transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-gray-900">مستلزمات متكاملة</span>
              <span className="text-xs text-gray-500 font-medium">أسمدة، مبيدات، ومخصبات</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 group hover:scale-102 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf6fc] text-[#22A3E2] flex items-center justify-center shrink-0 border border-[#22A3E2]/30 group-hover:bg-[#22A3E2] group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-gray-900">جودة فائقة</span>
              <span className="text-xs text-gray-500 font-medium">خامات نقية سريعة المفعول</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 group hover:scale-102 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-gray-900">دعم واستشارات</span>
              <span className="text-xs text-gray-500 font-medium">فريق فني متخصص بالواتساب</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 group hover:scale-102 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-gray-900">توريد سريع</span>
              <span className="text-xs text-gray-500 font-medium">شحن لكافة المحافظات</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

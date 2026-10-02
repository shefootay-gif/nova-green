import type { FC } from 'react';
import { ArrowDown, MessageCircle, Sparkles, ShieldCheck, Sprout, Award, Truck, CheckCircle2 } from 'lucide-react';

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
    <section id="hero" className="relative pt-10 pb-16 overflow-hidden bg-gradient-to-b from-[#f4f9f1] via-[#fbfdfa] to-white border-b border-gray-100">
      {/* Decorative Brand Gradient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#88C025]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-40 left-10 w-96 h-96 bg-[#22A3E2]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Right Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-right space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#88C025]/40 shadow-xs text-xs sm:text-sm font-black text-[#386208]">
              <Sparkles className="w-4 h-4 text-[#88C025]" />
              <span>حلول زراعية متطورة • جودة موثوقة • إنتاجية أعلى</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.18] tracking-tight">
              نزرع النجاح <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22A3E2] to-[#88C025]">
                مع كل مزارع مصري
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              شركة <strong>نوفا جرين (Nova Green)</strong> متخصصة في تقديم أحدث مركبات التغذية النباتية، المخصبات الحيوية، والمبيدات الوقائية والعلاجية لضمان أعلى إنتاجية وأفضل جودة تسويقية لمحصولك.
            </p>

            {/* Highlights Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-bold text-gray-700 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#88C025] shrink-0" />
                <span>مركبات أصلية معتمدة ومسجلة</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#22A3E2] shrink-0" />
                <span>دعم واستشارات فنية مجانية</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#88C025] shrink-0" />
                <span>أسعار تنافسية وعروض حصرية</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#22A3E2] shrink-0" />
                <span>شحن وتوريد سريع لكافة المحافظات</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#88C025] to-[#73a71b] hover:from-[#76ab1c] hover:to-[#639314] text-white font-black text-base shadow-lg shadow-[#88C025]/30 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                <span>استكشف كتالوج المنتجات (17 منتج)</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('السلام عليكم ، أود طلب استشارة زراعية بخصوص محصولي من شركة نوفا جرين')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-[#f9fbf8] text-[#13331c] font-black text-base border-2 border-[#22A3E2]/50 hover:border-[#22A3E2] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-[#22A3E2]" />
                <span>استشارة زراعية فورية (واتساب)</span>
              </a>
            </div>
          </div>

          {/* Left Column: Visual Brand Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer decorative card */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#88C025]/20 shadow-2xl shadow-gray-200/70 relative z-10 flex flex-col items-center group hover:border-[#88C025]/40 transition-all">
                {/* Logo Showcase */}
                <div className="w-64 max-w-full py-4 transition-transform duration-500 group-hover:scale-105">
                  <img
                    src="/logo.png"
                    alt="Nova Green Logo"
                    className="w-full h-auto object-contain drop-shadow-xs"
                  />
                </div>

                <div className="w-full border-t border-gray-100 my-4"></div>

                {/* Badges bar */}
                <div className="w-full grid grid-cols-2 gap-2 text-center text-xs font-bold text-gray-700">
                  <div className="bg-[#f2f9e8] p-3 rounded-2xl border border-[#88C025]/30">
                    <span className="block text-xl font-black text-[#88C025]">17+</span>
                    <span className="text-[11px] text-gray-600">مركب زراعي متخصص</span>
                  </div>
                  <div className="bg-[#eaf6fc] p-3 rounded-2xl border border-[#22A3E2]/30">
                    <span className="block text-xl font-black text-[#22A3E2]">100%</span>
                    <span className="text-[11px] text-gray-600">جودة وفاعلية مؤكدة</span>
                  </div>
                </div>

                {/* Assurance pill */}
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200/60 w-full justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#88C025]" />
                  <span>علامة تجارية زراعية موثوقة</span>
                </div>
              </div>

              {/* Floating glow effects */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#22A3E2]/20 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#88C025]/20 rounded-full blur-xl pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Floating Trust Metrics Ribbon */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md">
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f9e8] text-[#88C025] flex items-center justify-center shrink-0 border border-[#88C025]/30">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-gray-900">مستلزمات متكاملة</span>
              <span className="text-xs text-gray-500 font-medium">أسمدة، مبيدات، ومخصبات</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf6fc] text-[#22A3E2] flex items-center justify-center shrink-0 border border-[#22A3E2]/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-gray-900">جودة فائقة</span>
              <span className="text-xs text-gray-500 font-medium">خامات نقية سريعة المفعول</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black text-gray-900">دعم واستشارات</span>
              <span className="text-xs text-gray-500 font-medium">فريق فني متخصص بالواتساب</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
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

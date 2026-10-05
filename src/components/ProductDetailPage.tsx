import { useState, useRef, type MouseEvent, type FC } from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Share2, 
  Check, 
  Truck, 
  FileText
} from 'lucide-react';
import type { Product, CompanySettings } from '../types';

interface ProductDetailPageProps {
  product: Product;
  settings: CompanySettings;
  onBack: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailPage: FC<ProductDetailPageProps> = ({
  product,
  settings,
  onBack,
}) => {
  // Amazon-style Zoom lens & loupe state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [copied, setCopied] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const rawPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.startsWith('0') ? '2' + rawPhone : rawPhone;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `السلام عليكم، أود طلب واستفسار عن منتج (${product.name}) - التصنيف: ${product.category} - المادة الفعالة: ${product.activeIngredient} من شركة نوفا جرين`
  )}`;

  // Mouse move handler for Amazon-style precision zoom
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `مركب ${product.name} من شركة نوفا جرين`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const discount =
    product.price && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-right py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Back Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm shadow-2xs hover:border-[#88C025] transition-all cursor-pointer group"
          >
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 group-hover:text-[#88C025] transition-transform" />
            <span>العودة إلى الكتالوج الرئيسي</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Direct WhatsApp Share Button */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `*شركة نوفا جرين (Nova Green)* 🌱\n\n📌 *مركب:* ${product.name}\n🔬 *المادة الفعالة:* ${product.activeIngredient}\n🏷️ *التصنيف:* ${product.category}\n\n📖 للاطلاع على المواصفات الفنية الكاملة والصور ثلاثية الأبعاد:\n${window.location.origin}/#product-${product.id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#128C7E] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              title="مشاركة تفاصيل ومواصفات المنتج عبر واتساب"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>مشاركة عبر واتساب</span>
            </a>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              title="مشاركة رابط المنتج"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم نسخ الرابط!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-gray-500" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Product Showcase (Amazon-style Split Layout) */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* RIGHT SIDE: Amazon Interactive Magnifier & Visual Stage (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                ref={imageContainerRef}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                className="relative w-full aspect-square max-w-md sm:max-w-lg bg-gradient-to-br from-[#f8fbf6] via-[#f1f7ed] to-[#eaf5fc] rounded-3xl border border-gray-200/80 p-6 flex items-center justify-center cursor-crosshair overflow-hidden group select-none shadow-xs"
              >
                {/* Visual Ambient Glow Orb */}
                <div className="absolute w-48 h-48 rounded-full bg-white/80 blur-xl pointer-events-none"></div>

                {/* Top Badges */}
                <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-20 pointer-events-none">
                  <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#f2f9e8] text-[#3e660e] border border-[#88C025]/40 shadow-xs backdrop-blur-md">
                    {product.category}
                  </span>

                  {settings.showDiscounts !== false && discount && (
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-red-500 text-white shadow-xs animate-pulse">
                      خصم {discount}%
                    </span>
                  )}
                </div>

                {/* Primary High-Resolution Image */}
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={`w-full h-full object-contain relative z-10 drop-shadow-xl transition-transform duration-300 ${
                      isZooming ? 'opacity-30' : 'opacity-100 group-hover:scale-105'
                    }`}
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 rounded-3xl bg-white border-2 border-[#88C025]/40 shadow-lg flex items-center justify-center text-3xl font-black text-[#88C025] mb-2">
                      NG
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Nova Green</span>
                  </div>
                )}

                {/* Amazon-Style Lens Loupe Over Main Image */}
                {isZooming && product.imageUrl && (
                  <div
                    className="absolute inset-0 z-20 pointer-events-none bg-no-repeat transition-opacity duration-150"
                    style={{
                      backgroundImage: `url(${product.imageUrl})`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundSize: '280%',
                    }}
                  >
                    {/* Visual target reticle in center */}
                    <div 
                      className="absolute w-24 h-24 border-2 border-[#88C025]/80 bg-[#88C025]/10 rounded-2xl pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-lg"
                      style={{
                        left: `${zoomPos.x}%`,
                        top: `${zoomPos.y}%`,
                      }}
                    />
                  </div>
                )}

                {/* Bottom Instruction Tag */}
                <div className="absolute bottom-3 text-[11px] font-bold text-gray-500 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-gray-200 z-10 pointer-events-none shadow-2xs">
                  {isZooming ? 'مرر الفأرة للتكبير والتفاصيل الدقيقة' : '🔍 مرر مؤشر الفأرة للتكبير (Amazon Zoom)'}
                </div>
              </div>

              {/* Package Size Badge */}
              {product.unit && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-[#f4f7f2] border border-gray-200 rounded-xl text-xs font-bold text-gray-700">
                  <span className="text-gray-400">حجم ونوع العبوة:</span>
                  <span className="text-[#13331c]">{product.unit}</span>
                </div>
              )}
            </div>

            {/* LEFT SIDE: Product Data, Composition & Action Box (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-[#22A3E2] bg-[#eaf6fc] px-3 py-1 rounded-lg border border-[#22A3E2]/30">
                    مركب زراعي معتمد
                  </span>
                  {product.badge && (
                    <span className="text-xs font-black text-[#88C025] bg-[#f2f9e8] px-3 py-1 rounded-lg border border-[#88C025]/30">
                      {product.badge}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                  {product.name}
                </h1>

                {/* Active Ingredient */}
                <div className="inline-flex items-center gap-2 bg-[#f4f8f1] border border-[#88C025]/30 px-3.5 py-1.5 rounded-xl text-sm font-bold text-gray-800">
                  <Tag className="w-4 h-4 text-[#88C025] shrink-0" />
                  <span>
                    {product.activeIngredient.startsWith('المادة') || product.activeIngredient.startsWith('المواد')
                      ? product.activeIngredient
                      : `المادة الفعالة / النوع: ${product.activeIngredient}`}
                  </span>
                </div>
              </div>

              {/* Price & Commercial Offer Card */}
              <div className="bg-[#f9fbf8] p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
                <div className="flex items-baseline justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-xs text-gray-400 font-bold block mb-1">السعر المعتمد:</span>
                    {settings.showPrices !== false ? (
                      product.price ? (
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-3xl sm:text-4xl font-black text-[#13331c]">
                            {product.price} <span className="text-base font-bold text-[#88C025]">ج.م</span>
                          </span>
                          {settings.showDiscounts !== false && product.oldPrice && (
                            <del className="text-sm font-bold text-gray-400">
                              {product.oldPrice} ج.م
                            </del>
                          )}
                        </div>
                      ) : (
                        <span className="text-lg font-black text-gray-700">السعر عند التواصل</span>
                      )
                    ) : (
                      <span className="inline-block text-sm font-bold text-[#22A3E2] bg-[#eaf6fc] px-3.5 py-1.5 rounded-xl border border-[#22A3E2]/30">
                        تواصل للاستفسار وعرض السعر
                      </span>
                    )}
                  </div>

                  <div className="text-left">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      <Truck className="w-3.5 h-3.5" />
                      <span>توريد وشحن سريع لكافة المحافظات</span>
                    </span>
                  </div>
                </div>

                {/* Order Call to Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1eb755] hover:from-[#20ba59] hover:to-[#179644] text-white font-black text-sm sm:text-base shadow-lg shadow-[#25D366]/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group/btn"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 pointer-events-none"></div>
                    <MessageCircle className="w-5 h-5 fill-white text-transparent shrink-0 group-hover/btn:rotate-12 transition-transform" />
                    <span>اضغط للطلب عبر واتساب</span>
                  </a>

                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm sm:text-base border-2 border-gray-200 hover:border-[#88C025] shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Phone className="w-4.5 h-4.5 text-[#22A3E2]" />
                    <span>اتصال هاتفي مباشر</span>
                  </a>
                </div>
              </div>

              {/* Comprehensive Description Field */}
              <div className="space-y-2">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#88C025]" />
                  <span>الوصف والخصائص الحقلية للمركب:</span>
                </h3>
                <div className="bg-[#fcfdfc] p-4 sm:p-5 rounded-2xl border border-gray-200/80 text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-line shadow-2xs">
                  {product.description ||
                    'مركب عالي الجودة والفاعلية مخصص لحماية وتغذية المحاصيل، تم اختياره واعتماده وفق أعلى معايير الجودة لتأمين أعلى إنتاجية وسلامة للنبات.'}
                </div>
              </div>

              {/* Chemical & Physical Composition Field (خانه التركيبات الموسعة) */}
              {product.composition && (
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#22A3E2]" />
                    <span>التركيب والتحليل الكيميائي / المكونات الفعالة:</span>
                  </h3>
                  <div className="bg-[#eaf6fc]/40 p-4 sm:p-5 rounded-2xl border border-[#22A3E2]/30 text-sm text-gray-800 leading-relaxed font-semibold whitespace-pre-line shadow-2xs">
                    {product.composition}
                  </div>
                </div>
              )}

              {/* Usage & Dose Recommendation */}
              {product.usage && (
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>توصيات الجرعة وطريقة الاستخدام:</span>
                  </h3>
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-gray-800 leading-relaxed font-medium shadow-2xs">
                    {product.usage}
                  </div>
                </div>
              )}

              {/* Official Quality Trust Guarantee */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-gray-600">
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#88C025] shrink-0" />
                  <span>مطابق للمواصفات الزراعية</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-[#22A3E2] shrink-0" />
                  <span>دعم فني واستشارة مستمرة</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>فاعلية حقليّة مؤكدة</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

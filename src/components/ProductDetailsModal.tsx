import type { FC } from 'react';
import { X, MessageCircle, Phone, Sparkles, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import type { Product, CompanySettings } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  settings: CompanySettings;
}

export const ProductDetailsModal: FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  settings,
}) => {
  if (!product) return null;

  const rawPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.startsWith('0') ? '2' + rawPhone : rawPhone;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `السلام عليكم، أود طلب واستفسار عن منتج (${product.name}) - التصنيف: ${product.category} - المادة الفعالة: ${product.activeIngredient} من شركة نوفا جرين`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#f9fbf8] px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#88C025] bg-[#f2f9e8] px-2.5 py-1 rounded-full border border-[#88C025]/30">
              {product.category}
            </span>
            <span className="text-xs text-gray-400 font-semibold">بطاقة المنتج الفنية</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top Banner / Product Visual */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-br from-[#fcfdfc] to-[#f4f8f1] p-5 rounded-2xl border border-gray-100">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-[#88C025]/30 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#88C025]">NG</span>
                  <span className="text-[10px] text-[#22A3E2] font-bold">Nova Green</span>
                </div>
              )}
            </div>

            <div className="text-center sm:text-right flex-1">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <h2 className="text-2xl font-black text-gray-900">{product.name}</h2>
                {settings.showPrices !== false ? (
                  product.price ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-[#13331c]">
                        {product.price} <span className="text-sm text-[#88C025]">ج.م</span>
                      </span>
                      {settings.showDiscounts !== false && product.oldPrice && (
                        <del className="text-xs text-gray-400 font-bold">{product.oldPrice} ج.م</del>
                      )}
                    </div>
                  ) : null
                ) : (
                  <span className="inline-block text-xs font-bold text-[#22A3E2] bg-[#eaf6fc] px-3 py-1 rounded-lg border border-[#22A3E2]/30">
                    السعر عند الطلب
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-2">
                <div className="inline-flex items-center gap-1.5 text-xs text-gray-700 font-bold bg-white px-3 py-1 rounded-lg border border-gray-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-[#88C025]" />
                  <span>
                    {product.activeIngredient.startsWith('المادة') || product.activeIngredient.startsWith('المواد')
                      ? product.activeIngredient
                      : `المادة: ${product.activeIngredient}`}
                  </span>
                </div>
                {product.unit && (
                  <span className="text-xs font-bold text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200/80">
                    {product.unit}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500">
                مركب عالي الفاعلية والجودة مخصص لحماية وتغذية المحاصيل الزراعية.
              </p>
            </div>
          </div>

          {/* Details / Specifications */}
          <div className="space-y-3.5 text-sm">
            {/* Description */}
            <div className="bg-[#f9fbf8] p-4 rounded-xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#88C025]" />
                <span>الخصائص والمواصفات:</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                {product.description || 'مركب فعال ذو جودة عالية تم اختياره بعناية لتقديم أعلى كفاءة وإنتاجية للمحصول.'}
              </p>
            </div>

            {/* Usage or Target if present */}
            {product.usage && (
              <div className="bg-[#eaf6fc]/40 p-4 rounded-xl border border-[#22A3E2]/20">
                <h3 className="text-xs font-bold text-[#1b8dc4] mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#22A3E2]" />
                  <span>طريقة ومجال الاستخدام:</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  {product.usage}
                </p>
              </div>
            )}

            {/* Quality Guarantees */}
            <div className="flex items-center justify-around py-2 px-3 bg-white rounded-xl border border-gray-100 text-[11px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#88C025]" />
                <span>جودة مضمونة 100%</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22A3E2]" />
                <span>دعم فني واستشارة زراعية</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md shadow-[#25D366]/20 transition-all transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5 fill-white text-transparent" />
            <span>اضغط للطلب عبر واتساب <span dir="ltr" className="inline-block font-mono">({settings.whatsapp})</span></span>
          </a>

          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all"
            title="اتصال هاتفي مباشر"
          >
            <Phone className="w-4 h-4 text-[#22A3E2]" />
            <span className="sm:hidden">اتصال هاتفي</span>
          </a>
        </div>
      </div>
    </div>
  );
};

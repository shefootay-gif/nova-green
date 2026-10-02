import { useState, useMemo, type FC } from 'react';
import { Search, Filter, MessageCircle, AlertCircle, Sparkles, Info } from 'lucide-react';
import type { Product } from '../types';

interface ProductCatalogProps {
  products: Product[];
  whatsappNumber?: string;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCatalog: FC<ProductCatalogProps> = ({
  products,
  whatsappNumber = '011 31603110',
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (!item.isActive) return false;

      const matchesSearch =
        searchTerm.trim() === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const getCategoryColor = (cat: string) => {
    if (cat.includes('حشري') || cat.includes('أكاروسي')) {
      return 'bg-amber-50 text-amber-700 border-amber-200/60';
    }
    if (cat.includes('فطري') || cat.includes('أعفان')) {
      return 'bg-purple-50 text-purple-700 border-purple-200/60';
    }
    if (cat.includes('طحالب') || cat.includes('أحماض') || cat.includes('هيوميك') || cat.includes('فولفيك')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    }
    if (cat.includes('كالسيوم') || cat.includes('ملوحة') || cat.includes('نيماتودا')) {
      return 'bg-blue-50 text-blue-700 border-blue-200/60';
    }
    return 'bg-[#f2f9e8] text-[#4c7412] border-[#88C025]/30';
  };

  const createWhatsAppLink = (product: Product) => {
    const raw = whatsappNumber.replace(/[^0-9]/g, '');
    const cleanNum = raw.startsWith('0') ? '2' + raw : raw;

    const text = encodeURIComponent(
      `السلام عليكم، أود طلب منتج (${product.name}) - التصنيف: ${product.category} - المادة الفعالة: ${product.activeIngredient} من شركة نوفا جرين`
    );
    return `https://wa.me/${cleanNum}?text=${text}`;
  };

  return (
    <section id="catalog" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f9e8] text-[#4c7412] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#88C025]" />
            <span>دليل المنتجات والمبيدات الزراعية</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">كتالوج منتجاتنا</h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl mx-auto">
            منتجات Nova Green للمغذيات وحماية المحاصيل – اضغط على أي منتج لعرض تفاصيله الفنية
          </p>
        </div>

        {/* Filter & Search Bar matching video */}
        <div className="bg-[#f9fbf8] p-4 sm:p-5 rounded-2xl border border-gray-200/80 mb-6 shadow-xs space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم المنتج أو المادة الفعالة..."
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pr-11 pl-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025] focus:border-transparent transition-all shadow-2xs"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Category Dropdown */}
            <div className="relative flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#88C025] cursor-pointer shadow-2xs"
              >
                <option value="all">كل التصنيفات ({products.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Product Counter Badge */}
            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm font-bold text-gray-600 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#88C025]"></span>
              <span>{filteredProducts.length} منتج</span>
            </div>
          </div>
        </div>

        {/* Products List (Layout matching the video exactly) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#f9fbf8] rounded-2xl border border-dashed border-gray-200">
            <p className="text-base font-bold text-gray-600 mb-2">لا توجد منتجات مطابقة للبحث</p>
            <p className="text-sm text-gray-400 mb-4">جرب البحث بكلمات أخرى أو اختر "كل التصنيفات"</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-[#88C025] hover:underline"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-sm hover:shadow-md transition-all hover:border-[#88C025]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Right: Badge / Product Thumbnail & Name & Ingredients */}
                <div 
                  onClick={() => onSelectProduct?.(product)}
                  className="flex items-start gap-4 flex-1 cursor-pointer"
                >
                  {/* Thumbnail / NG Logo Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-[#f2f9e8] border border-[#88C025]/30 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-black text-[#88C025] tracking-wider">NG</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    {/* Category pill */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                          product.category
                        )}`}
                      >
                        {product.category}
                      </span>
                      {product.badge && product.badge !== product.category && (
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#88C025] transition-colors">
                      {product.name}
                    </h3>

                    {/* Active ingredient / details */}
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      {product.activeIngredient.startsWith('المادة الفعالة') ||
                      product.activeIngredient.startsWith('المواد الفعالة')
                        ? product.activeIngredient
                        : `المادة الفعالة: ${product.activeIngredient}`}
                    </p>

                    {product.description && (
                      <p className="text-xs text-gray-400 line-clamp-1 max-w-lg pt-0.5">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Left: Action Buttons (Details + Order Button via WhatsApp) */}
                <div className="w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onSelectProduct?.(product)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-2.5 rounded-xl border border-gray-200/80 transition-colors cursor-pointer"
                    title="عرض البطاقة الفنية للمنتج"
                  >
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                    <span>التفاصيل</span>
                  </button>

                  <a
                    href={createWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>اضغط للطلب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer Note (Exactly as in video frame 00:18) */}
        <div className="mt-10 bg-[#f9fbf8] border border-gray-200/70 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-gray-500 leading-relaxed font-medium">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-700 ml-1">ملاحظة هامة:</strong>
            هذه البيانات مبدئية حسب المعلومات المرسلة، ولا تغني عن مراجعة ملصق العبوة والتسجيل الرسمي لوزارة الزراعة قبل الاستخدام.
          </p>
        </div>
      </div>
    </section>
  );
};

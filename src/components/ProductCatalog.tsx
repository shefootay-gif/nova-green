import { useState, useMemo, type FC } from 'react';
import { Search, Filter, MessageCircle, Sparkles, Info, Tag, CheckCircle2 } from 'lucide-react';
import type { Product, CatalogNoticeContent, ProductCategory } from '../types';

interface ProductCatalogProps {
  products: Product[];
  categories?: ProductCategory[];
  whatsappNumber?: string;
  onSelectProduct?: (product: Product) => void;
  onOpenProductPage?: (product: Product) => void;
  catalogNotice?: CatalogNoticeContent;
  showPrices?: boolean;
  showDiscounts?: boolean;
}

export const ProductCatalog: FC<ProductCatalogProps> = ({
  products,
  categories: managedCategories,
  whatsappNumber = '011 31603110',
  onSelectProduct,
  onOpenProductPage,
  catalogNotice,
  showPrices = true,
  showDiscounts = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Resolved categories list (uses managed categories if provided, else falls back to product categories)
  const categoryItems = useMemo<ProductCategory[]>(() => {
    if (managedCategories && Array.isArray(managedCategories) && managedCategories.length > 0) {
      // Filter active categories and sort by order
      return [...managedCategories]
        .filter((c) => c.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    // Fallback: extract unique categories from products
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).map((name, index) => ({
      id: `cat-${index + 1}`,
      name,
      isActive: true,
      order: index + 1,
    }));
  }, [managedCategories, products]);

  const getCategoryProductCount = (categoryName: string) => {
    return products.filter((p) => p.isActive && p.category === categoryName).length;
  };

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

  const getCategoryTheme = (cat: string) => {
    const matched = categoryItems.find((c) => c.name === cat);
    const color = matched?.color;

    if (color === 'amber' || (!color && (cat.includes('حشري') || cat.includes('أكاروسي')))) {
      return {
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        glow: 'from-amber-500/10 to-transparent',
        accentColor: '#d97706',
      };
    }
    if (color === 'purple' || (!color && (cat.includes('فطري') || cat.includes('أعفان')))) {
      return {
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
        glow: 'from-purple-500/10 to-transparent',
        accentColor: '#9333ea',
      };
    }
    if (color === 'rose') {
      return {
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
        glow: 'from-rose-500/10 to-transparent',
        accentColor: '#e11d48',
      };
    }
    if (color === 'blue' || (!color && (cat.includes('كالسيوم') || cat.includes('نيماتودا')))) {
      return {
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        glow: 'from-blue-500/10 to-transparent',
        accentColor: '#2563eb',
      };
    }
    if (color === 'cyan' || (!color && cat.includes('ملوحة'))) {
      return {
        badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        glow: 'from-cyan-500/10 to-transparent',
        accentColor: '#0891b2',
      };
    }
    if (color === 'teal' || (!color && (cat.includes('طحالب') || cat.includes('أحماض')))) {
      return {
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
        glow: 'from-teal-500/10 to-transparent',
        accentColor: '#0d9488',
      };
    }
    if (color === 'lime') {
      return {
        badgeBg: 'bg-lime-50 text-lime-800 border-lime-200',
        glow: 'from-lime-500/10 to-transparent',
        accentColor: '#65a30d',
      };
    }
    return {
      badgeBg: 'bg-[#f2f9e8] text-[#3e660e] border-[#88C025]/30',
      glow: 'from-[#88C025]/10 to-transparent',
      accentColor: '#88C025',
    };
  };

  const createWhatsAppLink = (product: Product) => {
    const raw = whatsappNumber.replace(/[^0-9]/g, '');
    const cleanNum = raw.startsWith('0') ? '2' + raw : raw;

    const priceText = product.price ? `بسعر: ${product.price} ج.م (${product.unit || 'عبوة'})` : '';
    const text = encodeURIComponent(
      `السلام عليكم، أود طلب منتج (${product.name}) ${priceText} - المادة الفعالة: ${product.activeIngredient} من شركة نوفا جرين`
    );
    return `https://wa.me/${cleanNum}?text=${text}`;
  };

  return (
    <section id="catalog" className="py-20 bg-gradient-to-b from-white via-[#f7faf6] to-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f9e8] border border-[#88C025]/40 text-[#3b630b] text-xs font-black mb-4 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#88C025]" />
            <span>كتالوج المنتجات والمبيدات المعتمدة</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            حلول غذائية ووقائية <span className="text-[#88C025]">بأعلى معايير الجودة</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 font-medium">
            تصفح قائمة منتجات Nova Green المتطورة، أسعار تنافسية ومواصفات فنية دقيقة لخدمة مزارعك.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/80 shadow-md shadow-gray-100 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم المنتج أو المادة الفعالة (مثال: شامل، اسيتامبريد، ابامكتين...)"
                className="w-full bg-[#f9fbf8] border border-gray-200 rounded-2xl py-3.5 pr-12 pl-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025] focus:bg-white transition-all shadow-2xs"
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-200/70 px-2.5 py-1 rounded-full cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="relative md:w-72">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-[#f9fbf8] border border-gray-200 rounded-2xl py-3.5 pr-11 pl-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#88C025] cursor-pointer shadow-2xs"
              >
                <option value="all">كل التصنيفات ({products.filter((p) => p.isActive).length} منتج)</option>
                {categoryItems.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.icon ? `${cat.icon} ` : ''}{cat.name} ({getCategoryProductCount(cat.name)} منتج)
                  </option>
                ))}
              </select>
              <Filter className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>الكل</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-black ${
                  selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {products.filter((p) => p.isActive).length}
              </span>
            </button>
            {categoryItems.map((cat) => {
              const count = getCategoryProductCount(cat.name);
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id || cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#88C025] text-white shadow-sm'
                      : 'bg-[#f2f9e8] text-gray-700 hover:bg-[#e4f5d2]'
                  }`}
                >
                  {cat.icon && <span className="text-sm">{cat.icon}</span>}
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-[#88C025]/20 text-[#3b630b]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid: 3 or 4 Columns of Rich Cards */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 p-8">
            <p className="text-xl font-black text-gray-700 mb-2">لا توجد منتجات مطابقة لبحثك</p>
            <p className="text-sm text-gray-500 mb-6">جرب البحث بكلمات أخرى أو اختر "كل التصنيفات"</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2.5 bg-[#88C025] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#75a91e] transition-colors cursor-pointer"
            >
              عرض كافة المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 [&>*:last-child:nth-child(4n-3)]:xl:col-start-2 [&>*:last-child:nth-child(3n-2)]:lg:col-start-2">
            {filteredProducts.map((product) => {
              const theme = getCategoryTheme(product.category);
              const discount =
                product.price && product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : null;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-xs hover-glow-card flex flex-col overflow-hidden group hover:border-[#88C025]/60 hover:-translate-y-2 relative"
                >
                  {/* Top Image Showcase Area */}
                  <div 
                    onClick={() => {
                      if (onOpenProductPage) {
                        onOpenProductPage(product);
                      } else {
                        onSelectProduct?.(product);
                      }
                    }}
                    className="relative h-52 bg-gradient-to-br from-[#f8fbf6] via-[#eef6ec] to-[#e6f3fa] p-5 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    {/* Background glow circle */}
                    <div className="absolute w-36 h-36 rounded-full bg-white/70 blur-md pointer-events-none"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between z-10">
                      <span className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-2xs backdrop-blur-md ${theme.badgeBg}`}>
                        {product.category}
                      </span>

                      {showDiscounts && discount && (
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-red-500 text-white shadow-xs">
                          خصم {discount}%
                        </span>
                      )}
                    </div>

                    {/* Visual Product Representation */}
                    {product.imageUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 ease-out relative z-10 drop-shadow-md"
                        />
                        {/* Shimmer sweep effect on card hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-20"></div>
                      </div>
                    ) : (
                      /* High-end Styled Brand Container */
                      <div className="relative z-10 flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                        {/* Styled Bottle/Bag Graphic */}
                        <div className="w-24 h-28 rounded-2xl bg-white border-2 border-[#88C025]/40 shadow-lg flex flex-col items-center justify-center p-2 relative overflow-hidden">
                          {/* Top cap */}
                          <div className="w-8 h-2 bg-[#22A3E2] rounded-t-sm absolute top-0"></div>
                          
                          {/* Brand circular badge */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#22A3E2] to-[#88C025] flex items-center justify-center text-white font-black text-sm shadow-sm mb-1">
                            NG
                          </div>
                          
                          <span className="text-[10px] font-black text-gray-900 line-clamp-1">
                            {product.name}
                          </span>
                          <span className="text-[8px] font-bold text-[#88C025] uppercase">
                            Nova Green
                          </span>
                        </div>

                        {/* Subtle Reflection Shadow */}
                        <div className="w-16 h-2 bg-gray-400/20 rounded-full blur-xs mt-2"></div>
                      </div>
                    )}

                    {/* Unit Tag Bottom Right */}
                    {product.unit && (
                      <div className="absolute bottom-3 right-3 text-[11px] font-bold text-gray-600 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-gray-200/60 shadow-2xs z-10">
                        {product.unit}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Product Name */}
                      <h3 
                        onClick={() => {
                          if (onOpenProductPage) {
                            onOpenProductPage(product);
                          } else {
                            onSelectProduct?.(product);
                          }
                        }}
                        className="text-xl font-black text-gray-900 group-hover:text-[#88C025] transition-colors cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      {/* Active Ingredient Tag */}
                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-semibold bg-[#f4f7f2] px-2.5 py-1 rounded-lg border border-gray-100 w-full">
                        <Tag className="w-3.5 h-3.5 text-[#22A3E2] shrink-0" />
                        <span className="line-clamp-1">
                          {product.activeIngredient.startsWith('المادة') || product.activeIngredient.startsWith('المواد')
                            ? product.activeIngredient
                            : `المادة: ${product.activeIngredient}`}
                        </span>
                      </div>

                      {/* Description Preview */}
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                        {product.description || 'مركب عالي الجودة والفاعلية مخصص لحماية وتغذية المحاصيل.'}
                      </p>
                    </div>

                    {/* Price and Action Section */}
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      {/* Price Tag */}
                      <div className="flex items-baseline justify-between">
                        {showPrices ? (
                          <div>
                            <span className="text-xs text-gray-400 font-bold block">السعر:</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-[#13331c]">
                                {product.price || 280} <span className="text-sm font-bold text-[#88C025]">ج.م</span>
                              </span>
                              {showDiscounts && product.oldPrice && (
                                <del className="text-xs text-gray-400 font-bold">
                                  {product.oldPrice} ج.م
                                </del>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs text-gray-400 font-bold block">السعر:</span>
                            <span className="inline-block text-xs font-bold text-[#22A3E2] bg-[#eaf6fc] px-2.5 py-1 rounded-lg border border-[#22A3E2]/30">
                              تواصل للطلب وعرض السعر
                            </span>
                          </div>
                        )}

                        {product.badge && (
                          <span className="text-[10px] font-extrabold text-[#386208] bg-[#f2f9e8] px-2 py-0.5 rounded-md border border-[#88C025]/30">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-5 gap-2.5">
                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={() => onSelectProduct?.(product)}
                          className="col-span-1 min-h-[44px] rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer group/info focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                          title="عرض المواصفات الفنية الكاملة"
                          aria-label={`عرض تفاصيل ومواصفات ${product.name}`}
                        >
                          <Info className="w-4 h-4 group-hover/info:scale-110 transition-transform" />
                        </button>

                        {/* WhatsApp Order Button */}
                        <a
                          href={createWhatsAppLink(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="col-span-4 min-h-[44px] relative overflow-hidden inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1eb755] hover:from-[#20ba59] hover:to-[#179644] text-white font-black text-xs sm:text-sm shadow-md shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group/btn focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                          aria-label={`طلب ${product.name} عبر واتساب`}
                        >
                          <div className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-700 pointer-events-none"></div>
                          <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span>اضغط للطلب</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer Note */}
        <div className="mt-14 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm text-gray-600 font-medium">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1 text-center sm:text-right">
            <strong className="text-gray-900 block mb-0.5">{catalogNotice?.title || 'ضمان الجودة والتسجيل الرسمي:'}</strong>
            {catalogNotice?.text || 'كافة المنتجات والمركبات مختارة وفق أعلى معايير الجودة ومطابقة للتوصيات الفنية المعتمدة لوزارة الزراعة المصرية لتحقيق أعلى إنتاجية لمحصولك.'}
          </div>
        </div>
      </div>
    </section>
  );
};

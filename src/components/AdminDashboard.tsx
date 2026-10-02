import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent, FC } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  LogOut,
  RotateCcw,
  KeyRound,
  Cloud,
  Layers,
  Sparkles,
  Eye,
  Settings,
  Phone,
  MessageCircle,
  Mail,
  Share2,
} from 'lucide-react';
import type { Product, CompanySettings } from '../types';
import { StorageService } from '../services/storage';
import { compressImage } from '../utils/imageCompressor';

interface AdminDashboardProps {
  products: Product[];
  settings: CompanySettings;
  onRefreshProducts: () => void;
  onRefreshSettings: () => void;
  onNavigateHome: () => void;
  onLogout: () => void;
}

export const AdminDashboard: FC<AdminDashboardProps> = ({
  products,
  settings,
  onRefreshProducts,
  onRefreshSettings,
  onNavigateHome,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [formActiveIngredient, setFormActiveIngredient] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formUsage, setFormUsage] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  // Contact Settings State & Modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsWhatsapp, setSettingsWhatsapp] = useState(settings.whatsapp);
  const [settingsPhone, setSettingsPhone] = useState(settings.phone);
  const [settingsFacebook, setSettingsFacebook] = useState(settings.facebook);
  const [settingsEmail, setSettingsEmail] = useState(settings.email);

  // Password Change State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Notification Toast
  const [toastMsg, setToastMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Categories list
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  // Open modal for new product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0] || 'عناصر صغرى');
    setCustomCategory('');
    setFormActiveIngredient('');
    setFormDescription('');
    setFormUsage('');
    setFormImageUrl('');
    setFormBadge('');
    setFormIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    if (categories.includes(prod.category)) {
      setFormCategory(prod.category);
      setCustomCategory('');
    } else {
      setFormCategory('custom');
      setCustomCategory(prod.category);
    }
    setFormActiveIngredient(prod.activeIngredient);
    setFormDescription(prod.description || '');
    setFormUsage(prod.usage || '');
    setFormImageUrl(prod.imageUrl || '');
    setFormBadge(prod.badge || '');
    setFormIsActive(prod.isActive);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Image Upload with Automatic Client-Side Compression
  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        setFormError('');
        // Automatically resize and compress image to keep storage ultra-lightweight
        const compressedBase64 = await compressImage(file, 640, 640, 0.75);
        setFormImageUrl(compressedBase64);
      } catch {
        setFormError('حدث خطأ أثناء معالجة الصورة، يرجى اختيار ملف صورة صالح');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Save product (Add or Update)
  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      setFormError('يرجى كتابة اسم المنتج');
      return;
    }

    const finalCategory = formCategory === 'custom' ? customCategory.trim() : formCategory;
    if (!finalCategory) {
      setFormError('يرجى تحديد أو كتابة تصنيف المنتج');
      return;
    }

    if (!formActiveIngredient.trim()) {
      setFormError('يرجى كتابة المادة الفعالة أو تصنيف المادة');
      return;
    }

    if (editingProduct) {
      // Update
      StorageService.updateProduct({
        ...editingProduct,
        name: formName.trim(),
        category: finalCategory,
        activeIngredient: formActiveIngredient.trim(),
        description: formDescription.trim(),
        usage: formUsage.trim(),
        imageUrl: formImageUrl,
        badge: formBadge.trim() || finalCategory,
        isActive: formIsActive,
      });
      showToast('تم تحديث بيانات المنتج بنجاح');
    } else {
      // Add
      StorageService.addProduct({
        name: formName.trim(),
        category: finalCategory,
        activeIngredient: formActiveIngredient.trim(),
        description: formDescription.trim(),
        usage: formUsage.trim(),
        imageUrl: formImageUrl,
        badge: formBadge.trim() || finalCategory,
        isActive: formIsActive,
      });
      showToast('تمت إضافة المنتج الجديد بنجاح');
    }

    onRefreshProducts();
    setIsModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings({
      ...settings,
      whatsapp: settingsWhatsapp.trim(),
      phone: settingsPhone.trim(),
      facebook: settingsFacebook.trim(),
      email: settingsEmail.trim(),
    });
    onRefreshSettings();
    setIsSettingsModalOpen(false);
    showToast('تم حفظ وتحديث بيانات التواصل بنجاح');
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف منتج "${name}"؟`)) {
      StorageService.deleteProduct(id);
      onRefreshProducts();
      showToast(`تم حذف المنتج "${name}"`);
    }
  };

  // Toggle active status
  const handleToggleActive = (prod: Product) => {
    StorageService.updateProduct({
      ...prod,
      isActive: !prod.isActive,
    });
    onRefreshProducts();
    showToast(`تم تغيير حالة منتج "${prod.name}"`);
  };

  // Reset to initial 17 products
  const handleResetDefaults = () => {
    if (
      confirm(
        'هل تريد استعادة قائمة المنتجات الأصلية (17 منتجاً زراعياً الأساسية من الفيديو)؟ سيتم تحديث القائمة.'
      )
    ) {
      StorageService.resetToDefault();
      onRefreshProducts();
      showToast('تمت استعادة المنتجات الـ 17 الأصلية');
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'يرجى ملء جميع الحقول' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'كلمتا المرور الجديدتان غير متطابقتين' });
      return;
    }

    const success = await StorageService.updatePassword(oldPassword, newPassword);
    if (success) {
      setPasswordMsg({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح!' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordMsg({ type: '', text: '' });
      }, 1500);
    } else {
      setPasswordMsg({ type: 'error', text: 'كلمة المرور الحالية غير صحيحة' });
    }
  };

  // Filtered in table
  const displayedProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8faf7] pb-20">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#13331c] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-4 h-4 text-[#88C025]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span>لوحة تحكم المنتجات</span>
                  <span className="text-xs bg-[#f2f9e8] text-[#4c7412] px-2.5 py-0.5 rounded-full font-bold">
                    نوفا جرين
                  </span>
                </h1>
                <p className="text-xs text-gray-400">إدارة كتالوج المنتجات الزراعية والتحديثات</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 bg-[#88C025] hover:bg-[#76a81e] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </button>

              <button
                onClick={() => {
                  setSettingsWhatsapp(settings.whatsapp);
                  setSettingsPhone(settings.phone);
                  setSettingsFacebook(settings.facebook);
                  setSettingsEmail(settings.email);
                  setIsSettingsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                title="تعديل أرقام الواتساب والفيسبوك والتواصل"
              >
                <Settings className="w-4 h-4 text-emerald-600" />
                <span>بيانات التواصل</span>
              </button>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                title="تغيير كلمة المرور"
              >
                <KeyRound className="w-4 h-4 text-[#22A3E2]" />
                <span className="hidden sm:inline">كلمة المرور</span>
              </button>

              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 bg-[#f2f9e8] hover:bg-[#e5f5d2] text-[#13331c] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#88C025]" />
                <span>معاينة الموقع</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold block mb-1">إجمالي المنتجات</span>
              <span className="text-3xl font-black text-gray-900">{products.length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f2f9e8] text-[#88C025] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold block mb-1">التصنيفات المتاحة</span>
              <span className="text-3xl font-black text-gray-900">{categories.length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#eaf6fc] text-[#22A3E2] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold block mb-1">المنتجات النشطة</span>
              <span className="text-3xl font-black text-emerald-600">
                {products.filter((p) => p.isActive).length}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Cloudflare Pages Free Tier Banner */}
        <div className="bg-gradient-to-r from-[#13331c] to-[#1e4a2a] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#88C025]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">متوافق 100% مع الخطة المجانية لـ Cloudflare Pages</h4>
              <p className="text-xs text-emerald-200/80">
                ضغط فوري للصور محلياً لمنع امتلاء الذاكرة، وباندويث غير محدود على Cloudflare مجاناً.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 border border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#88C025]" />
            <span>استعادة المنتجات الـ 17 الأصلية</span>
          </button>
        </div>

        {/* Table & Controls Section */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في المنتجات..."
                className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#88C025] cursor-pointer"
              >
                <option value="all">كل التصنيفات ({products.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-2 rounded-xl">
                {displayedProducts.length} منتج
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#f9fbf8] text-gray-500 font-bold text-xs border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">المنتج</th>
                  <th className="py-3.5 px-4">التصنيف</th>
                  <th className="py-3.5 px-4">المادة الفعالة</th>
                  <th className="py-3.5 px-4 text-center">الحالة</th>
                  <th className="py-3.5 px-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      لا توجد منتجات مطابقة لخيارات البحث
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Product Name & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#f2f9e8] border border-[#88C025]/30 flex items-center justify-center shrink-0 overflow-hidden">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-black text-[#88C025]">NG</span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{p.name}</span>
                            {p.description && (
                              <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                                {p.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {p.category}
                        </span>
                      </td>

                      {/* Active Ingredient */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-gray-600 font-semibold">
                          {p.activeIngredient}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                            p.isActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title="اضغط لتغيير الحالة"
                        >
                          {p.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>معروض</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-gray-400" />
                              <span>مخفي</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-left">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل المنتج"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف المنتج"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج زراعي جديد'}
                </h3>
                <p className="text-xs text-gray-400">
                  {editingProduct ? `تعديل (${editingProduct.name})` : 'أدخل بيانات المنتج ومادته الفعالة ومواصفاته'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  اسم المنتج <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: شامل، اسيدا، هلوفر..."
                  required
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  تصنيف المنتج <span className="text-red-500">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025] cursor-pointer mb-2"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="custom">+ إضافة تصنيف جديد يدوي...</option>
                </select>

                {formCategory === 'custom' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="اكتب اسم التصنيف الجديد هنا..."
                    required
                    className="w-full bg-[#f2f9e8] border border-[#88C025]/40 rounded-xl py-2 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  />
                )}
              </div>

              {/* Active Ingredient */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  المادة الفعالة / التفاصيل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formActiveIngredient}
                  onChange={(e) => setFormActiveIngredient(e.target.value)}
                  placeholder="مثال: عناصر صغري، اسيتامبريد، ابامكتين..."
                  required
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  الوصف والمواصفات الفنية
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="نبذة عن فوائد وخصائص المركب..."
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                ></textarea>
              </div>

              {/* Usage & Dose */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  طريقة ومجال الاستخدام والجرعة (اختياري)
                </label>
                <input
                  type="text"
                  value={formUsage}
                  onChange={(e) => setFormUsage(e.target.value)}
                  placeholder="مثال: 100سم / 200 لتر ماء رشا للمكافحة..."
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Image Upload with Auto-Compression */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  صورة المنتج (يتم ضغطها تلقائياً لحفظ السرعة)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#f2f9e8] border border-[#88C025]/30 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {isCompressing ? (
                      <span className="text-[10px] text-gray-400 font-bold">جاري الضغط...</span>
                    ) : formImageUrl ? (
                      <img src={formImageUrl} alt="معاينة" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#88C025]" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCompressing}
                        className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#22A3E2]" />
                        <span>{isCompressing ? 'معالجة الصورة...' : 'رفع صورة من جهازك'}</span>
                      </button>

                      {formImageUrl && (
                        <button
                          type="button"
                          onClick={() => setFormImageUrl('')}
                          className="text-xs text-red-500 hover:underline font-bold"
                        >
                          إزالة الصورة
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="أو ضع رابط صورة خارجي مباشر..."
                      className="w-full bg-[#f9fbf8] border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#88C025]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#88C025]"></div>
                </label>
                <span className="text-xs font-bold text-gray-700">
                  {formIsActive ? 'المنتج معروض في الكتالوج' : 'إخفاء المنتج مؤقتاً'}
                </span>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
                  {formError}
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isCompressing}
                  className="px-6 py-2.5 text-xs font-bold bg-[#88C025] hover:bg-[#74a51e] text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">إعدادات التواصل والروابط</h3>
                <p className="text-xs text-gray-400">تحديث أرقام الواتساب والاتصال وصفحة الفيسبوك</p>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>رقم الواتساب للطلب</span>
                </label>
                <input
                  type="text"
                  value={settingsWhatsapp}
                  onChange={(e) => setSettingsWhatsapp(e.target.value)}
                  placeholder="مثال: 011 31603110"
                  required
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025] text-left dir-ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#22A3E2]" />
                  <span>رقم الاتصال الهاتفي المباشر</span>
                </label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  placeholder="مثال: 011 31603110"
                  required
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025] text-left dir-ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>رابط صفحة فيسبوك</span>
                </label>
                <input
                  type="url"
                  value={settingsFacebook}
                  onChange={(e) => setSettingsFacebook(e.target.value)}
                  placeholder="https://www.facebook.com/..."
                  required
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025] text-left dir-ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>البريد الإلكتروني</span>
                </label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  placeholder="info@novagreen.com"
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025] text-left dir-ltr"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#13331c] text-white rounded-xl hover:bg-[#1a4426] cursor-pointer"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#eaf6fc] text-[#22A3E2] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900">تغيير كلمة مرور المشرف</h3>
              <p className="text-xs text-gray-400 mt-1">تحديث كلمة مرور الدخول للوحة التحكم</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="كلمة المرور الحالية (الافتراضية: admin123)"
                  required
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل 6 أحرف على الأقل..."
                  required
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور الجديدة..."
                  required
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {passwordMsg.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#13331c] text-white rounded-xl hover:bg-[#1a4426]"
                >
                  حفظ كلمة المرور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

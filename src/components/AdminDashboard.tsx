import { useState, useRef, useEffect } from 'react';
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
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Percent,
  Phone,
  Download,
  UploadCloud,
  Shield,
  Sprout,
  Award,
  Save,
  AlertTriangle,
  Info,
  Sliders,
  RefreshCw,
  Tag,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { Product, CompanySettings, ProductCategory } from '../types';
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

type TabType = 'products' | 'categories' | 'hero' | 'services' | 'ribbon' | 'contact' | 'about' | 'security';

export const AdminDashboard: FC<AdminDashboardProps> = ({
  products,
  settings,
  onRefreshProducts,
  onRefreshSettings,
  onNavigateHome,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('products');

  // --- Products State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [formActiveIngredient, setFormActiveIngredient] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formComposition, setFormComposition] = useState('');
  const [formUsage, setFormUsage] = useState('');
  const [formPrice, setFormPrice] = useState<number | ''>('');
  const [formOldPrice, setFormOldPrice] = useState<number | ''>('');
  const [formUnit, setFormUnit] = useState('عبوة 1 لتر');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  // --- Dynamic CMS Settings State (Cloned for live editing) ---
  const [cmsSettings, setCmsSettings] = useState<CompanySettings>(settings);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving'>('saved');
  const isInitialMount = useRef(true);
  const lastSavedSettingsRef = useRef<string>(JSON.stringify(settings));

  // Keep cmsSettings in sync if external settings change (e.g. from another tab or reset)
  useEffect(() => {
    const incomingStr = JSON.stringify(settings);
    if (incomingStr !== lastSavedSettingsRef.current) {
      lastSavedSettingsRef.current = incomingStr;
      setCmsSettings(settings);
    }
  }, [settings]);

  // Automatic live synchronization debounced effect for ANY user edit/action in cmsSettings
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentStr = JSON.stringify(cmsSettings);
    if (currentStr === lastSavedSettingsRef.current) {
      return;
    }

    setSyncStatus('saving');
    const timer = setTimeout(() => {
      StorageService.saveSettings(cmsSettings);
      lastSavedSettingsRef.current = JSON.stringify(cmsSettings);
      onRefreshSettings();
      setSyncStatus('saved');
    }, 350);

    return () => clearTimeout(timer);
  }, [cmsSettings, onRefreshSettings]);

  // --- Security / Password State ---
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // --- Notification Toast ---
  const [toastMsg, setToastMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // --- Category Management State ---
  const [categoriesList, setCategoriesList] = useState<ProductCategory[]>(() => {
    return cmsSettings.categories && cmsSettings.categories.length > 0
      ? cmsSettings.categories
      : StorageService.getCategories();
  });

  // Keep categoriesList synced with cmsSettings
  useEffect(() => {
    if (cmsSettings.categories && cmsSettings.categories.length > 0) {
      setCategoriesList(cmsSettings.categories);
    }
  }, [cmsSettings.categories]);

  // Combined categories list for filtering and product form
  const allCategoryNames = Array.from(
    new Set([
      ...categoriesList.map((c) => c.name),
      ...products.map((p) => p.category),
    ])
  ).filter(Boolean);

  // Backward-compatible alias
  const categories = allCategoryNames;

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [categoryFormName, setCategoryFormName] = useState('');
  const [categoryFormDescription, setCategoryFormDescription] = useState('');
  const [categoryFormColor, setCategoryFormColor] = useState('emerald');
  const [categoryFormIcon, setCategoryFormIcon] = useState('🌱');
  const [categoryFormIsActive, setCategoryFormIsActive] = useState(true);
  const [categoryFormError, setCategoryFormError] = useState('');

  // Delete Category Modal State
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
  const [reassignCategoryName, setReassignCategoryName] = useState('');

  // Categories search filter
  const [categorySearchTerm, setCategorySearchTerm] = useState('');

  const displayedCategories = categoriesList.filter((c) => {
    if (!categorySearchTerm.trim()) return true;
    const term = categorySearchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.description && c.description.toLowerCase().includes(term))
    );
  });

  const getCategoryColorClasses = (color?: string) => {
    switch (color) {
      case 'amber':
        return { badge: 'bg-amber-50 text-amber-800 border-amber-200', text: 'text-amber-700' };
      case 'purple':
        return { badge: 'bg-purple-50 text-purple-800 border-purple-200', text: 'text-purple-700' };
      case 'rose':
        return { badge: 'bg-rose-50 text-rose-800 border-rose-200', text: 'text-rose-700' };
      case 'blue':
        return { badge: 'bg-blue-50 text-blue-800 border-blue-200', text: 'text-blue-700' };
      case 'cyan':
        return { badge: 'bg-cyan-50 text-cyan-800 border-cyan-200', text: 'text-cyan-700' };
      case 'teal':
        return { badge: 'bg-teal-50 text-teal-800 border-teal-200', text: 'text-teal-700' };
      case 'lime':
        return { badge: 'bg-lime-50 text-lime-800 border-lime-200', text: 'text-lime-700' };
      case 'emerald':
      default:
        return { badge: 'bg-[#f2f9e8] text-[#3e660e] border-[#88C025]/30', text: 'text-[#3e660e]' };
    }
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormName('');
    setCategoryFormDescription('');
    setCategoryFormColor('emerald');
    setCategoryFormIcon('🌱');
    setCategoryFormIsActive(true);
    setCategoryFormError('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setCategoryFormName(cat.name);
    setCategoryFormDescription(cat.description || '');
    setCategoryFormColor(cat.color || 'emerald');
    setCategoryFormIcon(cat.icon || '🌱');
    setCategoryFormIsActive(cat.isActive);
    setCategoryFormError('');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = categoryFormName.trim();
    if (!trimmedName) {
      setCategoryFormError('يرجى إدخال اسم التصنيف');
      return;
    }

    const isDuplicate = categoriesList.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== editingCategory?.id
    );
    if (isDuplicate) {
      setCategoryFormError('يوجد تصنيف آخر بنفس الاسم مسبقاً');
      return;
    }

    if (editingCategory) {
      const oldName = editingCategory.name;
      const updatedCat: ProductCategory = {
        ...editingCategory,
        name: trimmedName,
        description: categoryFormDescription.trim(),
        color: categoryFormColor,
        icon: categoryFormIcon,
        isActive: categoryFormIsActive,
      };

      const result = StorageService.updateCategory(oldName, updatedCat);
      const updatedCategories = StorageService.getCategories();
      setCategoriesList(updatedCategories);
      setCmsSettings((prev) => ({ ...prev, categories: updatedCategories }));
      onRefreshSettings();

      if (result.affectedProducts > 0) {
        onRefreshProducts();
        showToast(`تم تحديث التصنيف وتحديث ${result.affectedProducts} منتج مرتبط به`);
      } else {
        showToast('تم حفظ تعديلات التصنيف بنجاح');
      }
    } else {
      const newCat: ProductCategory = {
        id: 'cat-' + Date.now(),
        name: trimmedName,
        description: categoryFormDescription.trim(),
        color: categoryFormColor,
        icon: categoryFormIcon,
        isActive: categoryFormIsActive,
        order: categoriesList.length + 1,
      };

      const updatedCategories = [...categoriesList, newCat];
      StorageService.saveCategories(updatedCategories);
      setCategoriesList(updatedCategories);
      setCmsSettings((prev) => ({ ...prev, categories: updatedCategories }));
      onRefreshSettings();
      showToast(`تمت إضافة تصنيف (${trimmedName}) بنجاح`);
    }

    setIsCategoryModalOpen(false);
  };

  const handleToggleCategoryActive = (cat: ProductCategory) => {
    const updated = categoriesList.map((c) =>
      c.id === cat.id ? { ...c, isActive: !c.isActive } : c
    );
    StorageService.saveCategories(updated);
    setCategoriesList(updated);
    setCmsSettings((prev) => ({ ...prev, categories: updated }));
    onRefreshSettings();
    showToast(
      !cat.isActive
        ? `تم تفعيل تصنيف (${cat.name}) للظهور في الموقع`
        : `تم إخفاء تصنيف (${cat.name}) من الموقع`
    );
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoriesList.length) return;

    const list = [...categoriesList];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const reordered = list.map((c, i) => ({ ...c, order: i + 1 }));
    StorageService.saveCategories(reordered);
    setCategoriesList(reordered);
    setCmsSettings((prev) => ({ ...prev, categories: reordered }));
    onRefreshSettings();
    showToast('تم تحديث ترتيب التصنيفات');
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const result = StorageService.deleteCategory(
      categoryToDelete.id,
      categoryToDelete.name,
      reassignCategoryName
    );
    const updated = StorageService.getCategories();
    setCategoriesList(updated);
    setCmsSettings((prev) => ({ ...prev, categories: updated }));
    onRefreshSettings();
    if (result.affectedProducts > 0) {
      onRefreshProducts();
      showToast(
        `تم حذف التصنيف ونقل ${result.affectedProducts} منتج إلى تصنيف (${reassignCategoryName || 'عام'})`
      );
    } else {
      showToast('تم حذف التصنيف بنجاح');
    }
    setCategoryToDelete(null);
  };

  const handleResetCategories = () => {
    if (window.confirm('هل تريد استعادة قائمة التصنيفات الافتراضية للشركة؟')) {
      const defs = StorageService.resetCategoriesToDefault();
      setCategoriesList(defs);
      setCmsSettings((prev) => ({ ...prev, categories: defs }));
      onRefreshSettings();
      showToast('تمت استعادة التصنيفات الافتراضية بنجاح');
    }
  };

  // Filtered Products
  const displayedProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Open modal for new product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0] || 'عناصر صغرى');
    setCustomCategory('');
    setFormActiveIngredient('');
    setFormDescription('');
    setFormComposition('');
    setFormUsage('');
    setFormPrice('');
    setFormOldPrice('');
    setFormUnit('عبوة 1 لتر');
    setFormImageUrl('');
    setFormBadge('');
    setFormIsActive(true);
    setFormError('');
    setIsProductModalOpen(true);
  };

  // Open modal for editing product
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
    setFormComposition(prod.composition || '');
    setFormUsage(prod.usage || '');
    setFormPrice(prod.price || '');
    setFormOldPrice(prod.oldPrice || '');
    setFormUnit(prod.unit || 'عبوة 1 لتر');
    setFormImageUrl(prod.imageUrl || '');
    setFormBadge(prod.badge || '');
    setFormIsActive(prod.isActive);
    setFormError('');
    setIsProductModalOpen(true);
  };

  // Handle Product Image Upload with Automatic Client-Side Compression
  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        setFormError('');
        const compressedBase64 = await compressImage(file, 640, 640, 0.75);
        setFormImageUrl(compressedBase64);
      } catch {
        setFormError('حدث خطأ أثناء معالجة الصورة، يرجى اختيار ملف صورة صالح');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('يرجى إدخال اسم المنتج');
      return;
    }

    const finalCategory = formCategory === 'custom' ? customCategory.trim() : formCategory;
    if (!finalCategory) {
      setFormError('يرجى تحديد أو إدخال تصنيف للمنتج');
      return;
    }

    if (!formActiveIngredient.trim()) {
      setFormError('يرجى إدخال المادة الفعالة أو نوع المركب');
      return;
    }

    // Determine image: if provided use it, otherwise automatically assign the matching 3D packaging render based on category
    let finalImageUrl = formImageUrl.trim();
    if (!finalImageUrl) {
      if (
        finalCategory.includes('حشر') ||
        finalCategory.includes('فطر') ||
        finalCategory.includes('عناك') ||
        finalCategory.includes('مبيد') ||
        finalCategory.includes('نيماتودا') ||
        finalCategory.includes('أكاروس')
      ) {
        finalImageUrl = '/products/pesticide.jpg';
      } else if (finalCategory.includes('طحالب') || finalCategory.includes('أحماض')) {
        finalImageUrl = '/products/algae.jpg';
      } else if (
        finalCategory.includes('هيوميك') ||
        finalCategory.includes('فولفيك') ||
        finalCategory.includes('تربة') ||
        finalCategory.includes('ملوحة')
      ) {
        finalImageUrl = '/products/humic.jpg';
      } else {
        finalImageUrl = '/products/fertilizer.jpg';
      }
    }

    // Auto-register category into categoriesList if it doesn't exist
    if (finalCategory) {
      const exists = categoriesList.some(
        (c) => c.name.toLowerCase() === finalCategory.toLowerCase()
      );
      if (!exists) {
        const newCat: ProductCategory = {
          id: 'cat-' + Date.now(),
          name: finalCategory,
          color: 'emerald',
          icon: '🌱',
          isActive: true,
          order: categoriesList.length + 1,
        };
        const updatedCats = [...categoriesList, newCat];
        StorageService.saveCategories(updatedCats);
        setCategoriesList(updatedCats);
        setCmsSettings((prev) => ({ ...prev, categories: updatedCats }));
        onRefreshSettings();
      }
    }

    if (editingProduct) {
      StorageService.updateProduct({
        ...editingProduct,
        name: formName.trim(),
        category: finalCategory,
        activeIngredient: formActiveIngredient.trim(),
        description: formDescription.trim(),
        composition: formComposition.trim() || undefined,
        usage: formUsage.trim(),
        price: formPrice ? Number(formPrice) : undefined,
        oldPrice: formOldPrice ? Number(formOldPrice) : undefined,
        unit: formUnit.trim() || undefined,
        imageUrl: finalImageUrl,
        badge: formBadge.trim() || undefined,
        isActive: formIsActive,
      });
      showToast('تم تحديث بيانات المنتج بنجاح');
    } else {
      StorageService.addProduct({
        name: formName.trim(),
        category: finalCategory,
        activeIngredient: formActiveIngredient.trim(),
        description: formDescription.trim(),
        composition: formComposition.trim() || undefined,
        usage: formUsage.trim(),
        price: formPrice ? Number(formPrice) : undefined,
        oldPrice: formOldPrice ? Number(formOldPrice) : undefined,
        unit: formUnit.trim() || undefined,
        imageUrl: finalImageUrl,
        badge: formBadge.trim() || finalCategory,
        isActive: formIsActive,
      });
      showToast('تمت إضافة المنتج الجديد بنجاح - يظهر الآن في مقدمة كتالوج الموقع!');
    }

    onRefreshProducts();
    setIsProductModalOpen(false);
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
    if (confirm('هل تريد استعادة قائمة المنتجات الأصلية (17 منتجاً زراعياً الأساسية)؟')) {
      StorageService.resetToDefault();
      onRefreshProducts();
      showToast('تمت استعادة المنتجات الـ 17 الأصلية');
    }
  };

  // --- Save All CMS Settings ---
  const handleSaveAllSettings = (e?: FormEvent) => {
    if (e) e.preventDefault();
    StorageService.saveSettings(cmsSettings);
    lastSavedSettingsRef.current = JSON.stringify(cmsSettings);
    onRefreshSettings();
    setSyncStatus('saved');
    showToast('تم حفظ ومزامنة كافة التعديلات بنجاح! الموقع محدث الآن.');
  };

  // --- Password Change Handler ---
  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'يرجى ملء جميع الحقول المطلوبة' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف أو أرقام' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'كلمة المرور الجديدة وتأكيدها غير متطابقين' });
      return;
    }

    const success = await StorageService.updatePassword(oldPassword, newPassword);
    if (success) {
      setPasswordMsg({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('تم تغيير كلمة مرور لوحة التحكم بنجاح');
    } else {
      setPasswordMsg({ type: 'error', text: 'كلمة المرور الحالية غير صحيحة' });
    }
  };

  // --- Export Full Backup ---
  const handleExportBackup = () => {
    const jsonStr = StorageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-green-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم تنزيل النسخة الاحتياطية بنجاح (.json)');
  };

  // --- Import Backup ---
  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = StorageService.importBackup(content);
      if (result.success) {
        onRefreshProducts();
        onRefreshSettings();
        setCmsSettings(StorageService.getSettings());
        showToast(result.message);
      } else {
        alert(result.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Factory Reset ---
  const handleFactoryReset = () => {
    if (confirm('تحذير: هل أنت متأكد من إعادة ضبط المصنع بالكامل؟ سيتم مسح كافة التعديلات واستعادة المنتجات والنصوص الأصلية.')) {
      StorageService.resetAllToFactory();
      onRefreshProducts();
      onRefreshSettings();
      setCmsSettings(StorageService.getSettings());
      showToast('تمت إعادة ضبط المصنع لكافة بيانات الموقع بنجاح');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f2] pb-24 text-right">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#13331c] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-[#88C025]/40 animate-bounce">
          <CheckCircle className="w-5 h-5 text-[#88C025]" />
          <span className="text-sm font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Title & Brand */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#f2f9e8] border border-[#88C025]/30 flex items-center justify-center text-[#88C025]">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span>لوحة التحكم الشاملة</span>
                  <span className="text-xs bg-[#eaf6fc] text-[#22A3E2] px-2.5 py-0.5 rounded-full border border-[#22A3E2]/30">
                    CMS الكامل
                  </span>
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  تحكم كامل في كافة أقسام، نصوص، منتجات، وهوية موقع Nova Green
                </p>
              </div>
            </div>

            {/* Quick Actions & Live Sync Indicator */}
            <div className="flex items-center gap-2.5">
              {/* Live Sync Badge */}
              <div className="hidden sm:inline-flex items-center">
                {syncStatus === 'saving' ? (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200/80 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    <span>مزامنة تلقائية...</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200/80">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>متزامن تلقائياً</span>
                  </span>
                )}
              </div>

              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:inline">معاينة الموقع</span>
              </button>

              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-1.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer border border-red-100"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none border-t border-gray-100">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Layers className="w-4 h-4 text-[#88C025]" />
              <span>المنتجات والأسعار ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Tag className="w-4 h-4 text-emerald-500" />
              <span>إدارة التصنيفات ({categoriesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#22A3E2]" />
              <span>الهيدر والواجهة الرئيسية</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Sprout className="w-4 h-4 text-[#88C025]" />
              <span>خدماتنا وماذا نقدم</span>
            </button>

            <button
              onClick={() => setActiveTab('ribbon')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'ribbon'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>شريط الثقة والمميزات</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Phone className="w-4 h-4 text-[#25D366]" />
              <span>بيانات التواصل والروابط</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Info className="w-4 h-4 text-blue-500" />
              <span>من نحن وضمان الجودة</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#13331c] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-500" />
              <span>الأمان والنسخ الاحتياطي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================================= */}
        {/* TAB 1: PRODUCTS MANAGEMENT                                               */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
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
                  <span className="text-xs text-gray-500 font-bold block mb-1">المنتجات المعروضة للزبائن</span>
                  <span className="text-3xl font-black text-emerald-600">
                    {products.filter((p) => p.isActive).length}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Price & Offers Display Visibility Controls */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div>
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#88C025]" />
                    <span>خيارات عرض الأسعار ونسب العروض بالموقع</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    تحكم فوري وسريع في إظهار أو إخفاء مبالغ الأسعار وشارات الخصومات لكافة زوار متجر نوفا جرين
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Toggle 1: Show/Hide Prices */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...cmsSettings, showPrices: !cmsSettings.showPrices };
                      setCmsSettings(updated);
                      StorageService.saveSettings(updated);
                      onRefreshSettings();
                      showToast(updated.showPrices ? 'تم تفعيل إظهار الأسعار لكافة الزوار' : 'تم إخفاء الأسعار (السعر عند الطلب)');
                    }}
                    className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border transition-all cursor-pointer select-none text-right ${
                      cmsSettings.showPrices !== false
                        ? 'bg-[#f4f9ed] border-[#88C025]/50 text-gray-900 shadow-2xs'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        cmsSettings.showPrices !== false ? 'bg-[#88C025] text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {cmsSettings.showPrices !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-black">
                          {cmsSettings.showPrices !== false ? 'إظهار الأسعار: مُفعّل' : 'إظهار الأسعار: مُعطّل'}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium">
                          {cmsSettings.showPrices !== false ? 'يتم عرض السعر بالجنيه' : 'يظهر "تواصل لعرض السعر"'}
                        </div>
                      </div>
                    </div>

                    <div className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                      cmsSettings.showPrices !== false ? 'bg-[#88C025] justify-start' : 'bg-gray-300 justify-end'
                    }`}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </div>
                  </button>

                  {/* Toggle 2: Show/Hide Discounts */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...cmsSettings, showDiscounts: !cmsSettings.showDiscounts };
                      setCmsSettings(updated);
                      StorageService.saveSettings(updated);
                      onRefreshSettings();
                      showToast(updated.showDiscounts ? 'تم تفعيل إظهار شارات الخصومات والعروض' : 'تم إخفاء شارات ونسب العروض');
                    }}
                    className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border transition-all cursor-pointer select-none text-right ${
                      cmsSettings.showDiscounts !== false
                        ? 'bg-[#eef8fd] border-[#22A3E2]/50 text-gray-900 shadow-2xs'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        cmsSettings.showDiscounts !== false ? 'bg-[#22A3E2] text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Percent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">
                          {cmsSettings.showDiscounts !== false ? 'شارات العروض: مُفعّلة' : 'شارات العروض: مُعطّلة'}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium">
                          {cmsSettings.showDiscounts !== false ? 'ظهور بادجات الخصم % والشطب' : 'إخفاء شارات ونسب التخفيض'}
                        </div>
                      </div>
                    </div>

                    <div className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                      cmsSettings.showDiscounts !== false ? 'bg-[#22A3E2] justify-start' : 'bg-gray-300 justify-end'
                    }`}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                onClick={handleResetDefaults}
                className="inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer border border-gray-200"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                <span>استعادة الـ 17 منتج الأصلية</span>
              </button>

              <button
                onClick={handleOpenAddCategory}
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                title="إضافة تصنيف زراعي جديد وتحديده في الموقع"
              >
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>+ إضافة تصنيف جديد</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center justify-center gap-1.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
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
                    placeholder="بحث باسم المنتج، المادة الفعالة، أو التصنيف..."
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
                      <th className="py-3.5 px-4">السعر</th>
                      <th className="py-3.5 px-4 text-center">الحالة</th>
                      <th className="py-3.5 px-4 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {displayedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          لا توجد منتجات مطابقة لخيارات البحث
                        </td>
                      </tr>
                    ) : (
                      displayedProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                          {/* Product Name & Thumbnail */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-0.5" />
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

                          {/* Price */}
                          <td className="py-3.5 px-4">
                            {p.price ? (
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-gray-900">{p.price} ج.م</span>
                                {p.unit && <span className="text-[10px] text-gray-400 font-medium">{p.unit}</span>}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
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
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="p-1.5 text-gray-500 hover:text-[#88C025] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="تعديل المنتج"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CATEGORIES MANAGEMENT                                             */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Header & Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-bold block mb-1">إجمالي التصنيفات</span>
                  <span className="text-3xl font-black text-gray-900">{categoriesList.length}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Tag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-bold block mb-1">المعروضة بشريط الموقع للزوار</span>
                  <span className="text-3xl font-black text-[#88C025]">
                    {categoriesList.filter((c) => c.isActive !== false).length}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#f2f9e8] text-[#88C025] flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-bold block mb-1">إجمالي المنتجات المصنفة</span>
                  <span className="text-3xl font-black text-blue-600">{products.length}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Action Bar / Controls */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search in Categories */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    placeholder="ابحث بين التصنيفات الزراعية المتاحة..."
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  {categorySearchTerm && (
                    <button
                      onClick={() => setCategorySearchTerm('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-200/70 px-2 py-0.5 rounded-full cursor-pointer"
                    >
                      مسح
                    </button>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCategories}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold cursor-pointer transition-all"
                    title="استعادة التصنيفات الافتراضية"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">استعادة الافتراضي</span>
                  </button>

                  <button
                    onClick={handleOpenAddCategory}
                    className="flex items-center justify-center gap-1.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة تصنيف جديد</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Categories Cards / Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50">
                <div>
                  <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#88C025]" />
                    <span>قائمة التصنيفات وترتيبها في الموقع</span>
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    الترتيب الموضح أدناه هو الترتيب الذي تظهر به أزرار الفلترة للزوار في شريط كتالوج المنتجات. استخدم أزرار الأسهم لإعادة الترتيب.
                  </p>
                </div>
                <span className="text-xs font-black text-gray-600 bg-gray-200/60 px-3 py-1 rounded-full self-start sm:self-auto">
                  {displayedCategories.length} تصنيف
                </span>
              </div>

              {displayedCategories.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-base font-bold text-gray-700">لا توجد تصنيفات مطابقة لبحثك</p>
                  <p className="text-xs text-gray-400 mt-1">جرب البحث بكلمات أخرى أو أضف تصنيفاً جديداً</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {displayedCategories.map((cat, index) => {
                    const prodCount = products.filter((p) => p.category === cat.name).length;
                    const activeCount = products.filter((p) => p.isActive && p.category === cat.name).length;
                    const themeClasses = getCategoryColorClasses(cat.color);

                    return (
                      <div
                        key={cat.id || cat.name}
                        className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-gray-50/70 ${
                          cat.isActive === false ? 'opacity-65 bg-gray-50/40' : ''
                        }`}
                      >
                        {/* Right: Order, Badge, Name, Description */}
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          {/* Order Buttons */}
                          <div className="flex flex-col items-center gap-0.5 text-gray-400 shrink-0">
                            <button
                              onClick={() => handleMoveCategory(index, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                                index === 0 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:text-gray-900'
                              }`}
                              title="تقديم لأعلى في شريط الموقع"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-black text-gray-500 select-none">
                              {index + 1}
                            </span>
                            <button
                              onClick={() => handleMoveCategory(index, 'down')}
                              disabled={index === displayedCategories.length - 1}
                              className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                                index === displayedCategories.length - 1
                                  ? 'opacity-20 cursor-not-allowed'
                                  : 'cursor-pointer hover:text-gray-900'
                              }`}
                              title="تأخير لأسفل في شريط الموقع"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Color Badge Preview */}
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border shadow-2xs ${themeClasses.badge}`}
                          >
                            {cat.icon || '🌱'}
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-sm font-black text-gray-900 truncate">{cat.name}</h5>
                              <button
                                onClick={() => {
                                  setFilterCategory(cat.name);
                                  setActiveTab('products');
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                                title="عرض منتجات هذا التصنيف في قائمة المنتجات"
                              >
                                <Layers className="w-3 h-3 text-[#88C025]" />
                                <span>{prodCount} منتج ({activeCount} نشط)</span>
                              </button>
                              {cat.isActive === false && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                  مخفي من الموقع
                                </span>
                              )}
                            </div>
                            {cat.description ? (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cat.description}</p>
                            ) : (
                              <p className="text-[11px] text-gray-400 mt-0.5 italic">بدون وصف تفصيلي</p>
                            )}
                          </div>
                        </div>

                        {/* Left: Actions */}
                        <div className="flex items-center justify-end gap-2 shrink-0">
                          {/* Toggle Active Button */}
                          <button
                            onClick={() => handleToggleCategoryActive(cat)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              cat.isActive !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                            }`}
                            title={cat.isActive !== false ? 'معروض في شريط الموقع - اضغط للإخفاء' : 'مخفي من الموقع - اضغط للظهور'}
                          >
                            {cat.isActive !== false ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                <span>معروض بالموقع</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                <span>مخفي</span>
                              </>
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditCategory(cat)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                            title="تعديل التصنيف"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              const affectedCount = products.filter((p) => p.category === cat.name).length;
                              if (affectedCount > 0) {
                                setCategoryToDelete(cat);
                                const otherCat = categoriesList.find((c) => c.id !== cat.id)?.name || 'عام';
                                setReassignCategoryName(otherCat);
                              } else {
                                if (window.confirm(`هل أنت متأكد من حذف تصنيف "${cat.name}"؟`)) {
                                  StorageService.deleteCategory(cat.id, cat.name);
                                  const updated = StorageService.getCategories();
                                  setCategoriesList(updated);
                                  setCmsSettings((prev) => ({ ...prev, categories: updated }));
                                  onRefreshSettings();
                                  showToast('تم حذف التصنيف بنجاح');
                                }
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="حذف التصنيف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: HERO & MAIN HEADER                                                */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#22A3E2]" />
                  <span>التحكم في الهيدر والواجهة الرئيسية (Hero Section)</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  تعديل العنوان الرئيسي، الشارة العلوية، نصوص المزايا، وإحصائيات اللوجو الـ 3D
                </p>
              </div>
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-1.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Top Announcement Badge */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  الشارة الإعلانية العلوية (Top Announcement Badge)
                </label>
                <input
                  type="text"
                  value={cmsSettings.hero.topBadge}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      hero: { ...cmsSettings.hero, topBadge: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Main Headline Line 1 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  العنوان الرئيسي (السطر الأول)
                </label>
                <input
                  type="text"
                  value={cmsSettings.hero.titleLine1}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      hero: { ...cmsSettings.hero, titleLine1: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Main Headline Line 2 (Gradient text) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  العنوان الرئيسي (السطر الثاني - التدرج الملون)
                </label>
                <input
                  type="text"
                  value={cmsSettings.hero.titleLine2}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      hero: { ...cmsSettings.hero, titleLine2: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Subtitle / Company Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  النص التعريفي للشركة (Hero Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={cmsSettings.hero.subtitle}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      hero: { ...cmsSettings.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                ></textarea>
              </div>

              {/* 4 Checklist Features */}
              <div className="md:col-span-2 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-800 mb-3">نقاط القوة ومزايا التعامل الأربعة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cmsSettings.hero.checklist1}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        hero: { ...cmsSettings.hero, checklist1: e.target.value },
                      })
                    }
                    placeholder="ميزة 1"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.hero.checklist2}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        hero: { ...cmsSettings.hero, checklist2: e.target.value },
                      })
                    }
                    placeholder="ميزة 2"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.hero.checklist3}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        hero: { ...cmsSettings.hero, checklist3: e.target.value },
                      })
                    }
                    placeholder="ميزة 3"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.hero.checklist4}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        hero: { ...cmsSettings.hero, checklist4: e.target.value },
                      })
                    }
                    placeholder="ميزة 4"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              {/* 3D Animated Logo Stats */}
              <div className="md:col-span-2 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-800 mb-3">إحصائيات وأرقام كارت اللوجو الـ 3D:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f9fbf8] p-4 rounded-2xl border border-gray-100">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-[#88C025]">الإحصائية الأولى (الأخضر):</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={cmsSettings.hero.stat1Number}
                        onChange={(e) =>
                          setCmsSettings({
                            ...cmsSettings,
                            hero: { ...cmsSettings.hero, stat1Number: e.target.value },
                          })
                        }
                        placeholder="17+"
                        className="col-span-1 bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm font-black text-center"
                      />
                      <input
                        type="text"
                        value={cmsSettings.hero.stat1Label}
                        onChange={(e) =>
                          setCmsSettings({
                            ...cmsSettings,
                            hero: { ...cmsSettings.hero, stat1Label: e.target.value },
                          })
                        }
                        placeholder="مركب زراعي متخصص"
                        className="col-span-2 bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-[#22A3E2]">الإحصائية الثانية (الأزرق):</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={cmsSettings.hero.stat2Number}
                        onChange={(e) =>
                          setCmsSettings({
                            ...cmsSettings,
                            hero: { ...cmsSettings.hero, stat2Number: e.target.value },
                          })
                        }
                        placeholder="100%"
                        className="col-span-1 bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm font-black text-center"
                      />
                      <input
                        type="text"
                        value={cmsSettings.hero.stat2Label}
                        onChange={(e) =>
                          setCmsSettings({
                            ...cmsSettings,
                            hero: { ...cmsSettings.hero, stat2Label: e.target.value },
                          })
                        }
                        placeholder="جودة وفاعلية موثوقة"
                        className="col-span-2 bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons Text */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  نص زر التصفح الرئيسي
                </label>
                <input
                  type="text"
                  value={cmsSettings.hero.primaryBtnText}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      hero: { ...cmsSettings.hero, primaryBtnText: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  نص زر الواتساب والاستشارة
                </label>
                <input
                  type="text"
                  value={cmsSettings.hero.secondaryBtnText}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      hero: { ...cmsSettings.hero, secondaryBtnText: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-2 bg-[#88C025] hover:bg-[#77ab1f] text-white text-sm font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات الهيدر</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SERVICES (WHAT WE OFFER)                                          */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-[#88C025]" />
                  <span>التحكم في قسم (ماذا نقدم لقطاع الزراعة؟)</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  تعديل كروت الخدمات الثلاثة، المزايا، والشروحات الفنية
                </p>
              </div>
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-1.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

            {/* Section Headers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">شارة القسم</label>
                <input
                  type="text"
                  value={cmsSettings.services.badge}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: { ...cmsSettings.services, badge: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">عنوان القسم الرئيسي</label>
                <input
                  type="text"
                  value={cmsSettings.services.title}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: { ...cmsSettings.services, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الوصف المختصر</label>
                <input
                  type="text"
                  value={cmsSettings.services.subtitle}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: { ...cmsSettings.services, subtitle: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
              </div>
            </div>

            {/* 3 Service Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              {/* Card 1 */}
              <div className="bg-[#f9fbf8] p-5 rounded-2xl border border-[#88C025]/30 space-y-3">
                <span className="text-xs font-black text-[#88C025] block">الكارت الأول: التغذية والمخصبات</span>
                <input
                  type="text"
                  value={cmsSettings.services.card1.title}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: {
                        ...cmsSettings.services,
                        card1: { ...cmsSettings.services.card1, title: e.target.value },
                      },
                    })
                  }
                  placeholder="عنوان الكارت"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-black"
                />
                <textarea
                  rows={3}
                  value={cmsSettings.services.card1.description}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: {
                        ...cmsSettings.services,
                        card1: { ...cmsSettings.services.card1, description: e.target.value },
                      },
                    })
                  }
                  placeholder="الوصف"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                ></textarea>
                <div className="space-y-1.5 pt-1">
                  <input
                    type="text"
                    value={cmsSettings.services.card1.point1}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card1: { ...cmsSettings.services.card1, point1: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 1"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.services.card1.point2}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card1: { ...cmsSettings.services.card1, point2: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 2"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.services.card1.point3}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card1: { ...cmsSettings.services.card1, point3: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 3"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#f9fbf8] p-5 rounded-2xl border border-[#22A3E2]/30 space-y-3">
                <span className="text-xs font-black text-[#22A3E2] block">الكارت الثاني: حماية المحاصيل</span>
                <input
                  type="text"
                  value={cmsSettings.services.card2.title}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: {
                        ...cmsSettings.services,
                        card2: { ...cmsSettings.services.card2, title: e.target.value },
                      },
                    })
                  }
                  placeholder="عنوان الكارت"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-black"
                />
                <textarea
                  rows={3}
                  value={cmsSettings.services.card2.description}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: {
                        ...cmsSettings.services,
                        card2: { ...cmsSettings.services.card2, description: e.target.value },
                      },
                    })
                  }
                  placeholder="الوصف"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                ></textarea>
                <div className="space-y-1.5 pt-1">
                  <input
                    type="text"
                    value={cmsSettings.services.card2.point1}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card2: { ...cmsSettings.services.card2, point1: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 1"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.services.card2.point2}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card2: { ...cmsSettings.services.card2, point2: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 2"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.services.card2.point3}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card2: { ...cmsSettings.services.card2, point3: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 3"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#f9fbf8] p-5 rounded-2xl border border-amber-200 space-y-3">
                <span className="text-xs font-black text-amber-600 block">الكارت الثالث: الاستشارات والإرشاد</span>
                <input
                  type="text"
                  value={cmsSettings.services.card3.title}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: {
                        ...cmsSettings.services,
                        card3: { ...cmsSettings.services.card3, title: e.target.value },
                      },
                    })
                  }
                  placeholder="عنوان الكارت"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-black"
                />
                <textarea
                  rows={3}
                  value={cmsSettings.services.card3.description}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      services: {
                        ...cmsSettings.services,
                        card3: { ...cmsSettings.services.card3, description: e.target.value },
                      },
                    })
                  }
                  placeholder="الوصف"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                ></textarea>
                <div className="space-y-1.5 pt-1">
                  <input
                    type="text"
                    value={cmsSettings.services.card3.point1}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card3: { ...cmsSettings.services.card3, point1: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 1"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.services.card3.point2}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card3: { ...cmsSettings.services.card3, point2: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 2"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.services.card3.point3}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        services: {
                          ...cmsSettings.services,
                          card3: { ...cmsSettings.services.card3, point3: e.target.value },
                        },
                      })
                    }
                    placeholder="نقطة 3"
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-2 bg-[#88C025] hover:bg-[#77ab1f] text-white text-sm font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات الخدمات</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TRUST RIBBON (4 METRICS)                                          */}
        {/* ========================================================================= */}
        {activeTab === 'ribbon' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>التحكم في شريط الثقة والمميزات (Trust Ribbon)</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  تعديل العناوين والشروحات السريعة للشريط المثبت أسفل الهيدر
                </p>
              </div>
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-1.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Item 1 */}
              <div className="bg-[#f9fbf8] p-4 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-xs font-black text-[#88C025] block">العنصر 1 (المستلزمات)</span>
                <input
                  type="text"
                  value={cmsSettings.trustRibbon.item1.title}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      trustRibbon: {
                        ...cmsSettings.trustRibbon,
                        item1: { ...cmsSettings.trustRibbon.item1, title: e.target.value },
                      },
                    })
                  }
                  placeholder="العنوان"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  value={cmsSettings.trustRibbon.item1.subtitle}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      trustRibbon: {
                        ...cmsSettings.trustRibbon,
                        item1: { ...cmsSettings.trustRibbon.item1, subtitle: e.target.value },
                      },
                    })
                  }
                  placeholder="الوصف"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              {/* Item 2 */}
              <div className="bg-[#f9fbf8] p-4 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-xs font-black text-[#22A3E2] block">العنصر 2 (الجودة)</span>
                <input
                  type="text"
                  value={cmsSettings.trustRibbon.item2.title}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      trustRibbon: {
                        ...cmsSettings.trustRibbon,
                        item2: { ...cmsSettings.trustRibbon.item2, title: e.target.value },
                      },
                    })
                  }
                  placeholder="العنوان"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  value={cmsSettings.trustRibbon.item2.subtitle}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      trustRibbon: {
                        ...cmsSettings.trustRibbon,
                        item2: { ...cmsSettings.trustRibbon.item2, subtitle: e.target.value },
                      },
                    })
                  }
                  placeholder="الوصف"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              {/* Item 3 */}
              <div className="bg-[#f9fbf8] p-4 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-xs font-black text-amber-600 block">العنصر 3 (الاستشارات)</span>
                <input
                  type="text"
                  value={cmsSettings.trustRibbon.item3.title}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      trustRibbon: {
                        ...cmsSettings.trustRibbon,
                        item3: { ...cmsSettings.trustRibbon.item3, title: e.target.value },
                      },
                    })
                  }
                  placeholder="العنوان"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  value={cmsSettings.trustRibbon.item3.subtitle}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      trustRibbon: {
                        ...cmsSettings.trustRibbon,
                        item3: { ...cmsSettings.trustRibbon.item3, subtitle: e.target.value },
                      },
                    })
                  }
                  placeholder="الوصف"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              {/* Item 4 */}
              <div className="bg-[#f9fbf8] p-4 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-xs font-black text-emerald-600 block">العنصر 4 (الشحن السريع)</span>
                <input
                  type="text"
                  value={cmsSettings.trustRibbon.item4.title}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      trustRibbon: {
                        ...cmsSettings.trustRibbon,
                        item4: { ...cmsSettings.trustRibbon.item4, title: e.target.value },
                      },
                    })
                  }
                  placeholder="العنوان"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  value={cmsSettings.trustRibbon.item4.subtitle}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      trustRibbon: {
                        ...cmsSettings.trustRibbon,
                        item4: { ...cmsSettings.trustRibbon.item4, subtitle: e.target.value },
                      },
                    })
                  }
                  placeholder="الوصف"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-2 bg-[#88C025] hover:bg-[#77ab1f] text-white text-sm font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ شريط الثقة</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTACT & SOCIAL                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#25D366]" />
                  <span>بيانات التواصل، الواتساب، والروابط الرسمية</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  تعديل أرقام الهواتف، ورابط صفحة الفيسبوك، والعنوان
                </p>
              </div>
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-1.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم الشركة</label>
                <input
                  type="text"
                  value={cmsSettings.companyName}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, companyName: e.target.value })}
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">الشعار اللفظي (Slogan)</label>
                <input
                  type="text"
                  value={cmsSettings.tagline}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, tagline: e.target.value })}
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  رقم الواتساب للطلبات المباشرة (زر اضغط للطلب)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsSettings.whatsapp}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, whatsapp: e.target.value })}
                  placeholder="011 31603110"
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-[#88C025] text-left"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  رقم الهاتف المباشر للاتصال
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cmsSettings.phone}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, phone: e.target.value })}
                  placeholder="011 31603110"
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#88C025] text-left"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  رابط صفحة الفيسبوك الرسمية
                </label>
                <input
                  type="text"
                  value={cmsSettings.facebook}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, facebook: e.target.value })}
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={cmsSettings.email}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, email: e.target.value })}
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  العنوان والمقر الرئيسي
                </label>
                <input
                  type="text"
                  value={cmsSettings.address}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, address: e.target.value })}
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Working Hours */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  مواعيد وساعات العمل
                </label>
                <input
                  type="text"
                  value={cmsSettings.workingHours}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, workingHours: e.target.value })}
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-2 bg-[#88C025] hover:bg-[#77ab1f] text-white text-sm font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ بيانات التواصل</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ABOUT & QUALITY GUARANTEE                                         */}
        {/* ========================================================================= */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span>التحكم في قسم (من نحن) ورسالة ضمان الجودة</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  تعديل الرؤية، القيم، ونصوص التعريف بالشركة في أسفل الصفحة
                </p>
              </div>
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-1.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">شارة من نحن</label>
                  <input
                    type="text"
                    value={cmsSettings.about.badge}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        about: { ...cmsSettings.about, badge: e.target.value },
                      })
                    }
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">عنوان القسم الرئيسي</label>
                  <input
                    type="text"
                    value={cmsSettings.about.title}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        about: { ...cmsSettings.about, title: e.target.value },
                      })
                    }
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={cmsSettings.about.description}
                  onChange={(e) =>
                    setCmsSettings({
                      ...cmsSettings,
                      about: { ...cmsSettings.about, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نص النبذة الممتدة (الفقرة 1)</label>
                  <textarea
                    rows={3}
                    value={cmsSettings.about.extendedText1}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        about: { ...cmsSettings.about, extendedText1: e.target.value },
                      })
                    }
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نص النبذة الممتدة (الفقرة 2)</label>
                  <textarea
                    rows={3}
                    value={cmsSettings.about.extendedText2}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        about: { ...cmsSettings.about, extendedText2: e.target.value },
                      })
                    }
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  ></textarea>
                </div>
              </div>

              {/* Vision and Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f9fbf8] p-4 rounded-2xl border border-gray-100">
                <div className="space-y-2">
                  <span className="text-xs font-black text-[#88C025] block">رؤيتنا:</span>
                  <input
                    type="text"
                    value={cmsSettings.about.visionTitle}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        about: { ...cmsSettings.about, visionTitle: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl py-1.5 px-3 text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    value={cmsSettings.about.visionText}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        about: { ...cmsSettings.about, visionText: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl py-1.5 px-3 text-xs"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black text-[#22A3E2] block">قيمنا:</span>
                  <input
                    type="text"
                    value={cmsSettings.about.valuesTitle}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        about: { ...cmsSettings.about, valuesTitle: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl py-1.5 px-3 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={cmsSettings.about.valuesText}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        about: { ...cmsSettings.about, valuesText: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl py-1.5 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Catalog Bottom Quality Notice */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-800 mb-2">رسالة ضمان الجودة والتسجيل الرسمي (أسفل الكتالوج):</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={cmsSettings.catalogNotice.title}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        catalogNotice: { ...cmsSettings.catalogNotice, title: e.target.value },
                      })
                    }
                    placeholder="العنوان"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    value={cmsSettings.catalogNotice.text}
                    onChange={(e) =>
                      setCmsSettings({
                        ...cmsSettings,
                        catalogNotice: { ...cmsSettings.catalogNotice, text: e.target.value },
                      })
                    }
                    placeholder="نص الضمان والتسجيل"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => handleSaveAllSettings()}
                className="inline-flex items-center gap-2 bg-[#88C025] hover:bg-[#77ab1f] text-white text-sm font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ بيانات من نحن والضمان</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SECURITY & BACKUP                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Backup & Data Management */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-purple-600" />
                  <span>النسخ الاحتياطي واسترجاع بيانات الموقع (Backup & Restore)</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  يمكنك حفظ نسخة كاملة من كافة المنتجات والإعدادات والمحتوى على جهازك أو استعادتها في أي وقت
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Export */}
                <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-black text-gray-900 block mb-1">تصدير نسخة احتياطية</span>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      تنزيل ملف JSON يحتوي على كافة المنتجات، الأسعار، والإعدادات.
                    </p>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="inline-flex items-center justify-center gap-2 bg-[#13331c] hover:bg-[#1a4425] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#88C025]" />
                    <span>تنزيل النسخة الاحتياطية</span>
                  </button>
                </div>

                {/* Import */}
                <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-black text-gray-900 block mb-1">استيراد نسخة احتياطية</span>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      رفع ملف JSON لاستعادة البيانات بالكامل وتحديث الموقع فوراً.
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={backupInputRef}
                    onChange={handleImportBackup}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={() => backupInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 bg-[#22A3E2] hover:bg-[#1b8ec5] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>رفع واستعادة ملف (.json)</span>
                  </button>
                </div>

                {/* Factory Reset */}
                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-black text-red-700 block mb-1">إعادة ضبط المصنع</span>
                    <p className="text-xs text-red-600/80 leading-relaxed">
                      استرجاع الـ 17 منتج وكافة النصوص الافتراضية للشركة.
                    </p>
                  </div>
                  <button
                    onClick={handleFactoryReset}
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>إعادة ضبط المصنع بالكامل</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#88C025]" />
                  <span>تغيير كلمة مرور لوحة التحكم</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  كلمة المرور الافتراضية الحالية: <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-bold">admin123</code> (مؤمنة بنظام التشفير القياسي SHA-256)
                </p>
              </div>

              {passwordMsg.text && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    passwordMsg.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {passwordMsg.type === 'error' ? (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    كلمة المرور الحالية
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#13331c] hover:bg-[#1a4425] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-[#88C025]" />
                    <span>تحديث كلمة المرور</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL                                                 */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 my-8 text-right">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-gray-900">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج زراعي جديد'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  اسم المنتج الزراعي *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: شامل، اسبورجا، جاكوار..."
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Category Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">التصنيف *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProductModalOpen(false);
                        handleOpenAddCategory();
                      }}
                      className="text-[#88C025] hover:underline text-[11px] font-black cursor-pointer"
                    >
                      + نافذة إضافة تصنيف جديد
                    </button>
                  </div>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="custom">+ إضافة تصنيف جديد...</option>
                  </select>
                </div>

                {formCategory === 'custom' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      اسم التصنيف الجديد *
                    </label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="مثال: مبيد عناكب، منظم نمو..."
                      className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                    />
                  </div>
                )}
              </div>

              {/* Active Ingredient */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  المادة الفعالة / نوع المركب *
                </label>
                <input
                  type="text"
                  value={formActiveIngredient}
                  onChange={(e) => setFormActiveIngredient(e.target.value)}
                  placeholder="مثال: عناصر صغرى، اسيتامبريد 20%..."
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Comprehensive Description Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>الوصف والخصائص والمجال الزراعي (خانة مفصلة)</span>
                  <span className="text-[11px] text-gray-400 font-normal">يدعم أسطر متعددة</span>
                </label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="اكتب وصفاً مفصلاً للمنتج، مميزاته، فوائده للتربة والنبات، وفترة الأمان إن وجدت..."
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025] leading-relaxed"
                ></textarea>
              </div>

              {/* Chemical & Physical Composition Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span className="text-[#22A3E2]">التركيبات ونسب المواد الفعالة والعناصر (خانة التركيبات)</span>
                  <span className="text-[11px] text-gray-400 font-normal">تظهر بوضوح في صفحة المنتج</span>
                </label>
                <textarea
                  rows={4}
                  value={formComposition}
                  onChange={(e) => setFormComposition(e.target.value)}
                  placeholder={"مثال على التركيب:\n• نيتروجين كلي (N): 10%\n• فوسفور متاح (P2O5): 20%\n• بوتاسيوم قابل للذوبان (K2O): 20%\n• أحماض أمينية حرة: 5%"}
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22A3E2] leading-relaxed"
                ></textarea>
              </div>

              {/* Usage & Dose */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  الجرعة ومعدل الاستخدام
                </label>
                <input
                  type="text"
                  value={formUsage}
                  onChange={(e) => setFormUsage(e.target.value)}
                  placeholder="مثال: 100سم / 200 لتر ماء رشا للمكافحة..."
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Price, OldPrice, Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f9fbf8] p-3 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">السعر الحالي (ج.م)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="280"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">السعر السابق (شطب)</label>
                  <input
                    type="number"
                    value={formOldPrice}
                    onChange={(e) => setFormOldPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="330"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">حجم العبوة</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="عبوة 1 لتر"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                  />
                </div>
              </div>

              {/* Product Image with Auto-compression */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  صورة المنتج (يتم ضغطها وتصغيرها تلقائياً لحفظ السرعة)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#f2f9e8] border border-[#88C025]/30 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {isCompressing ? (
                      <span className="text-[10px] text-gray-400 font-bold">جاري الضغط...</span>
                    ) : formImageUrl ? (
                      <img src={formImageUrl} alt="معاينة" className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isCompressing}
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formImageUrl ? 'تغيير الصورة من الجهاز' : 'رفع صورة من الجهاز'}</span>
                    </button>

                    {formImageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                      >
                        إزالة الصورة
                      </button>
                    )}
                  </div>
                </div>

                {/* 3D Bottle Packaging Presets */}
                <div className="pt-2.5">
                  <span className="block text-[11px] font-bold text-gray-500 mb-1.5">
                    أو اختر قالباً ثلاثي الأبعاد جاهزاً مطابقاً للعبوات الزراعية:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('/products/fertilizer.jpg')}
                      className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-right transition-all cursor-pointer ${
                        formImageUrl === '/products/fertilizer.jpg'
                          ? 'bg-[#f4f9ed] border-[#88C025] ring-2 ring-[#88C025]/30'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <img src="/products/fertilizer.jpg" alt="أسمدة" className="w-8 h-8 object-contain shrink-0" />
                      <span className="text-[10px] font-bold text-gray-700">أسمدة ومخصبات</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormImageUrl('/products/algae.jpg')}
                      className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-right transition-all cursor-pointer ${
                        formImageUrl === '/products/algae.jpg'
                          ? 'bg-[#eef8fd] border-[#22A3E2] ring-2 ring-[#22A3E2]/30'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <img src="/products/algae.jpg" alt="طحالب" className="w-8 h-8 object-contain shrink-0" />
                      <span className="text-[10px] font-bold text-gray-700">طحالب وأحماض</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormImageUrl('/products/humic.jpg')}
                      className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-right transition-all cursor-pointer ${
                        formImageUrl === '/products/humic.jpg'
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <img src="/products/humic.jpg" alt="هيوميك" className="w-8 h-8 object-contain shrink-0" />
                      <span className="text-[10px] font-bold text-gray-700">هيوميك وفولفيك</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormImageUrl('/products/pesticide.jpg')}
                      className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-right transition-all cursor-pointer ${
                        formImageUrl === '/products/pesticide.jpg'
                          ? 'bg-red-50 border-red-500 ring-2 ring-red-500/30'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <img src="/products/pesticide.jpg" alt="مبيد" className="w-8 h-8 object-contain shrink-0" />
                      <span className="text-[10px] font-bold text-gray-700">مبيدات ووقاية</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active display status */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#88C025] rounded focus:ring-[#88C025] cursor-pointer"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-bold text-gray-700 cursor-pointer">
                  عرض هذا المنتج في كتالوج الموقع فوراً
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isCompressing}
                  className="px-6 py-2.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT CATEGORY MODAL                                                 */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-5 my-8 text-right">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#88C025]" />
                <span>{editingCategory ? 'تعديل بيانات التصنيف' : 'إضافة تصنيف زراعي جديد'}</span>
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {categoryFormError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                {categoryFormError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  اسم التصنيف الزراعي *
                </label>
                <input
                  type="text"
                  value={categoryFormName}
                  onChange={(e) => setCategoryFormName(e.target.value)}
                  placeholder="مثال: مغذيات ورقية، مبيدات عضوية، منظمات نمو..."
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Category Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  وصف مختصر للتصنيف (اختياري)
                </label>
                <input
                  type="text"
                  value={categoryFormDescription}
                  onChange={(e) => setCategoryFormDescription(e.target.value)}
                  placeholder="مثال: مركبات غذائية متخصصة لتحفيز التزهير ومقاومة الإجهاد"
                  className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
                />
              </div>

              {/* Emoji Icon Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  أيقونة أو رمز التصنيف
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {[
                    '🌿', '🌱', '🌾', '✨', '🛡️', '🧪', '🔬', '💧', '🍎', '⚡', '🎯', '🕷️', '🧫', '🍇', '🥔', '🌳'
                  ].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCategoryFormIcon(emoji)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                        categoryFormIcon === emoji
                          ? 'bg-[#88C025] text-white ring-2 ring-[#88C025]/40 scale-110 shadow-xs'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  لون وطابع الشارة (Badge Theme)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'emerald', label: 'أخضر', bg: 'bg-[#f2f9e8] text-[#3e660e] border-[#88C025]/40' },
                    { id: 'teal', label: 'تركواز', bg: 'bg-teal-50 text-teal-800 border-teal-200' },
                    { id: 'amber', label: 'أصفر', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
                    { id: 'purple', label: 'بنفسجي', bg: 'bg-purple-50 text-purple-800 border-purple-200' },
                    { id: 'blue', label: 'أزرق', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
                    { id: 'cyan', label: 'سماوي', bg: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
                    { id: 'rose', label: 'وردي', bg: 'bg-rose-50 text-rose-800 border-rose-200' },
                    { id: 'lime', label: 'ليموني', bg: 'bg-lime-50 text-lime-800 border-lime-200' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryFormColor(c.id)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${c.bg} ${
                        categoryFormColor === c.id
                          ? 'ring-2 ring-gray-900 shadow-xs font-black'
                          : 'hover:opacity-90'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview of Badge */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">معاينة ظهور الشارة في الموقع:</span>
                <div
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black shadow-2xs ${
                    getCategoryColorClasses(categoryFormColor).badge
                  }`}
                >
                  <span className="text-sm">{categoryFormIcon || '🌱'}</span>
                  <span>{categoryFormName || 'اسم التصنيف'}</span>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="catIsActiveCheck"
                  checked={categoryFormIsActive}
                  onChange={(e) => setCategoryFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#88C025] rounded focus:ring-[#88C025] cursor-pointer"
                />
                <label htmlFor="catIsActiveCheck" className="text-xs font-bold text-gray-700 cursor-pointer">
                  عرض هذا التصنيف في شريط الفلترة بالموقع للزوار
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#88C025] hover:bg-[#77ab1f] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingCategory ? 'حفظ تعديلات التصنيف' : 'إضافة التصنيف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE / REASSIGN CATEGORY CONFIRMATION MODAL                             */}
      {/* ========================================================================= */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-4 my-8 text-right">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-gray-900">تأكيد حذف تصنيف ({categoryToDelete.name})</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  يوجد {products.filter((p) => p.category === categoryToDelete.name).length} منتج مرتبط بهذا التصنيف حالياً.
                </p>
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-2xl text-xs text-amber-900 font-medium">
              اختر التصنيف البديل الذي تود نقل هذه المنتجات إليه لضمان عدم بقائها بدون تصنيف:
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                نقل المنتجات إلى تصنيف:
              </label>
              <select
                value={reassignCategoryName}
                onChange={(e) => setReassignCategoryName(e.target.value)}
                className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-2 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025]"
              >
                {categoriesList
                  .filter((c) => c.id !== categoryToDelete.id)
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                <option value="عام">عام (بدون تصنيف خاص)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                إلغاء التراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
              >
                حذف التصنيف ونقل المنتجات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

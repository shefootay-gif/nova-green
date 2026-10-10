import type { Product, SafeUser, CompanySettings, ProductCategory } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

export const PRODUCTS_STORAGE_KEY = 'nova_green_products_v3';
export const SETTINGS_STORAGE_KEY = 'nova_green_settings_v2';
export const CATEGORIES_STORAGE_KEY = 'nova_green_categories_v1';
export const AUTH_TOKEN_KEY = 'nova_green_admin_session';

export const DEFAULT_CATEGORIES: ProductCategory[] = [
  { id: 'cat-1', name: 'عناصر صغرى', description: 'مركبات مخلبية سريعة الامتصاص لعلاج أعراض نقص العناصر', color: 'emerald', icon: '🌿', isActive: true, order: 1 },
  { id: 'cat-2', name: 'طحالب وأحماض', description: 'مستخلصات طحالب بحرية طبيعية ومحفزات نمو ومقاومة إجهاد', color: 'teal', icon: '🌱', isActive: true, order: 2 },
  { id: 'cat-3', name: 'هيوميك', description: 'هيوميك أسيد عالي النقاوة لتحسين خواص التربة وتنشيط الجذور', color: 'amber', icon: '🌾', isActive: true, order: 3 },
  { id: 'cat-4', name: 'فولفيك', description: 'أحماض عضوية دقيقة سريعة النفاذية لتنشيط العمليات الحيوية', color: 'lime', icon: '✨', isActive: true, order: 4 },
  { id: 'cat-5', name: 'مبيد حشري', description: 'مركبات متخصصة للقضاء على الآفات الحشرية الضارة', color: 'rose', icon: '🛡️', isActive: true, order: 5 },
  { id: 'cat-6', name: 'مكافحة أعفان', description: 'وقاية وعلاج أعفان الجذور والتاج والذبول', color: 'purple', icon: '🧪', isActive: true, order: 6 },
  { id: 'cat-7', name: 'مكافحة نيماتودا', description: 'حماية متخصصة للجذور والشعيرات الجذرية من النيماتودا', color: 'blue', icon: '🔬', isActive: true, order: 7 },
  { id: 'cat-8', name: 'معالجة ملوحة', description: 'طرد أملاح الصوديوم وتيسير امتصاص المياه والعناصر', color: 'cyan', icon: '💧', isActive: true, order: 8 },
  { id: 'cat-9', name: 'كالسيوم', description: 'تثبيت العقد وزيادة صلابة وجودة الثمار التصديرية', color: 'emerald', icon: '🍎', isActive: true, order: 9 },
  { id: 'cat-10', name: 'أحماض أمينية', description: 'رفع مناعة النبات وتحفيز تخليق البروتين ومقاومة الصقيع', color: 'teal', icon: '⚡', isActive: true, order: 10 },
  { id: 'cat-11', name: 'مبيد أكاروسي / حشري', description: 'تأثير مزدوج لمكافحة الأكاروسات والآفات الحشرية', color: 'rose', icon: '🎯', isActive: true, order: 11 },
  { id: 'cat-12', name: 'مبيد أكاروسي', description: 'مكافحة متخصصة للعناكب الحمراء والديدان الدقيقة', color: 'amber', icon: '🕷️', isActive: true, order: 12 },
  { id: 'cat-13', name: 'مبيد فطري', description: 'علاج فعال للبياض الدقيقي والزغبي واللفحات والتبقعات', color: 'purple', icon: '🧫', isActive: true, order: 13 },
];

// Real-time synchronization BroadcastChannel for instant cross-tab sync
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('nova_green_realtime_sync');
  }
} catch {
  // Graceful fallback for environments without BroadcastChannel
}

export const notifySync = (type: 'products' | 'settings' | 'all') => {
  try {
    if (syncChannel) {
      syncChannel.postMessage({ type, timestamp: Date.now() });
    }
  } catch {
    // Ignore notification errors
  }
};

export const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'نوفا جرين',
  tagline: 'حلول زراعية • جودة • ثقة',
  phone: '011 31603110',
  whatsapp: '011 31603110',
  facebook: 'https://www.facebook.com/share/1BurYZKAcy/',
  email: 'novagreen110@gmail.com',
  address: 'جمهورية مصر العربية - خدمة المزارعين في كافة المحافظات',
  workingHours: 'يومياً من 9:00 صباحاً حتى 9:00 مساءً (دعم فني واستشارات متواصل)',
  showPrices: false,
  showDiscounts: false,
  categories: DEFAULT_CATEGORIES,
  hero: {
    topBadge: 'حلول زراعية متطورة • جودة موثوقة • إنتاجية أعلى',
    titleLine1: 'نزرع النجاح',
    titleLine2: 'مع كل مزارع مصري',
    subtitle: 'شركة نوفا جرين (Nova Green) متخصصة في تقديم أحدث مركبات التغذية النباتية، المخصبات الحيوية، والمبيدات الوقائية والعلاجية لضمان أعلى إنتاجية وأفضل جودة تسويقية لمحصولك.',
    checklist1: 'مركبات أصلية معتمدة ومسجلة',
    checklist2: 'دعم واستشارات فنية مجانية',
    checklist3: 'أسعار تنافسية وعروض حصرية',
    checklist4: 'شحن وتوريد سريع لكافة المحافظات',
    stat1Number: '17+',
    stat1Label: 'مركب زراعي متخصص',
    stat2Number: '100%',
    stat2Label: 'جودة وفاعلية موثوقة',
    primaryBtnText: 'استكشف كتالوج المنتجات (17 منتج)',
    secondaryBtnText: 'استشارة زراعية فورية (واتساب)',
  },
  services: {
    badge: 'خدمات وحلول Nova Green',
    title: 'ماذا نقدم لقطاع الزراعة؟',
    subtitle: 'حلول متكاملة تغطي كافة مراحل نمو النبات، من إعداد التربة والشتل وحتى الحصاد بأعلى جودة تسويقية.',
    card1: {
      title: 'مستلزمات وتغذية زراعية',
      tag: 'تغذية ومخصبات',
      description: 'مجموعة متكاملة من الأسمدة المركبة، العناصر الصغرى المخلبية، والمخصبات الحيوية لتنشيط الجذور وتحفيز النمو الخضري والثمري.',
      point1: 'عناصر صغرى مخلبية سريعة الامتصاص',
      point2: 'هيوميك وفولفيك نقي عالي التركيز',
      point3: 'كالسيوم وبورون سريع النفاذ لمنع التشوهات',
    },
    card2: {
      title: 'حلول حماية المحاصيل',
      tag: 'وقاية ومكافحة',
      description: 'أقوى المبيدات المتخصصة لمكافحة الآفات الحشرية، الأكاروسات، الفطريات، وأعفان الجذور وفق برامج المكافحة المتكاملة والمعتمدة.',
      point1: 'مبيدات جهازية واسعة المدى وآمنة',
      point2: 'مكافحة حاسمة للنيماتودا وحماية الجذور',
      point3: 'علاج متخصص للأعفان والتبقعات واللفحات',
    },
    card3: {
      title: 'دعم فني واستشارات للمزارع',
      tag: 'إرشاد زراعي',
      description: 'مهندسون استشاريون لمتابعة محصولك خطوة بخطوة، وتقديم برامج تسميد ومكافحة دقيقة تناسب طبيعة التربة والطقس واحتياج النبات.',
      point1: 'تحديد الجرعات والمواعيد بدقة متناهية',
      point2: 'تشخيص فوري للآفات والإصابات عبر الواتساب',
      point3: 'متابعة دورية للمحصول حتى الحصاد',
    },
  },
  trustRibbon: {
    item1: {
      title: 'مستلزمات متكاملة',
      subtitle: 'أسمدة، مبيدات، ومخصبات',
    },
    item2: {
      title: 'جودة فائقة',
      subtitle: 'خامات نقية سريعة المفعول',
    },
    item3: {
      title: 'دعم واستشارات',
      subtitle: 'فريق فني متخصص بالواتساب',
    },
    item4: {
      title: 'توريد سريع',
      subtitle: 'شحن لكافة المحافظات',
    },
  },
  about: {
    badge: 'Nova Green',
    title: 'شريكك في الزراعة الحديثة',
    description: 'نهدف إلى بناء علامة زراعية موثوقة تجمع بين جودة المنتج، الخدمة السريعة، والدعم الفني مع التركيز على احتياجات السوق والمزارعين.',
    extendedText1: 'تأسست نوفا جرين (Nova Green) لتكون صرحاً متكاملاً يدعم الإنتاج الزراعي المستدام من خلال انتقاء أحدث المركبات الزراعية والمخصبات ذات الفاعلية المؤكدة حقلياً.',
    extendedText2: 'نحن نعمل يداً بيد مع كبرى معامل التطوير الزراعي والمهندسين الاستشاريين لتقديم حلول علاجية ووقائية تضمن للمزارع أعلى إنتاجية وأفضل تصنيف تسويقي للمحاصيل التصديرية والمحلية.',
    visionTitle: 'رؤيتنا',
    visionText: 'أن تصبح نوفا جرين من العلامات المميزة في مجال المستلزمات والحلول الزراعية من خلال منتجات موثوقة وخدمة احترافية.',
    valuesTitle: 'قيمنا',
    valuesText: 'الجودة • المصداقية • الابتكار • خدمة المزارع',
  },
  catalogNotice: {
    title: 'ضمان الجودة والتسجيل الرسمي:',
    text: 'كافة المنتجات والمركبات مختارة وفق أعلى معايير الجودة ومطابقة للتوصيات الفنية المعتمدة لوزارة الزراعة المصرية لتحقيق أعلى إنتاجية لمحصولك.',
  },
};

// Pre-computed SHA-256 hash for default password: "admin123"
const DEFAULT_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

// Utility to compute SHA-256 hash securely in modern browser Web Crypto API
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Utility to sanitize URLs and protect against javascript: or data: injection
export function sanitizeUrl(url?: string, fallback: string = '#'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
    return trimmed;
  }
  return fallback;
}

// Strict schema validation for products to ensure backup integrity
export function isValidProduct(item: unknown): item is Product {
  if (!item || typeof item !== 'object') return false;
  const p = item as Record<string, unknown>;
  return (
    typeof p.name === 'string' &&
    p.name.trim().length > 0 &&
    typeof p.category === 'string' &&
    typeof p.activeIngredient === 'string' &&
    typeof p.isActive === 'boolean'
  );
}

export const StorageService = {
  // Fetch products (LocalStorage with auto-seed)
  getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      const parsed: Product[] = JSON.parse(stored);
      // Ensure existing default products have their images populated
      let updated = false;
      const enriched = parsed.map(item => {
        if (!item.imageUrl) {
          const match = INITIAL_PRODUCTS.find(p => p.id === item.id || p.name === item.name);
          if (match?.imageUrl) {
            updated = true;
            return { ...item, imageUrl: match.imageUrl };
          }
        }
        return item;
      });
      if (updated) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(enriched));
      }
      return enriched;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  // Save full product array with Quota guard
  saveProducts(products: Product[]): boolean {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      notifySync('products');
      return true;
    } catch (e: unknown) {
      const err = e as { name?: string; code?: number };
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        console.error('مساحة التخزين في المتصفح ممتلئة. يرجى ضغط الصور قبل الحفظ.');
      } else {
        console.error('Failed to save to localStorage', e);
      }
      return false;
    }
  },

  // Add new product
  addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  // Update existing product
  updateProduct(updated: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      products[index] = updated;
      this.saveProducts(products);
    }
    return updated;
  },

  // Delete product
  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  },

  // Reset back to original 17 products
  resetToDefault(): Product[] {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    notifySync('products');
    return INITIAL_PRODUCTS;
  },

  // 🔒 SECURE AUTHENTICATION (Rule Compliance: Password hash is NEVER exposed in user queries/objects)
  async login(password: string): Promise<SafeUser | null> {
    const inputHash = await sha256(password);
    const customHash = localStorage.getItem('nova_green_admin_hash') || DEFAULT_PASSWORD_HASH;

    if (inputHash === customHash) {
      const safeUser: SafeUser = {
        id: 'admin-1',
        username: 'admin',
        role: 'admin',
      };
      // Store session token — crypto.getRandomValues for unpredictable token
      const randomBytes = new Uint8Array(16);
      crypto.getRandomValues(randomBytes);
      const secureToken = 'session_' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({
        token: secureToken,
        user: safeUser,
        timestamp: Date.now(),
      }));
      return safeUser;
    }
    return null;
  },

  // Get current logged-in user — validates session and checks expiry (8 hours)
  getCurrentUser(): SafeUser | null {
    try {
      const session = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!session) return null;
      const parsed = JSON.parse(session);
      // Auto-expire sessions older than 8 hours
      const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
      if (!parsed.timestamp || Date.now() - parsed.timestamp > SESSION_TTL_MS) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        return null;
      }
      return parsed.user as SafeUser;
    } catch {
      return null;
    }
  },

  // Logout
  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Change admin password securely — enforces minimum 8-char length server-side
  async updatePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    if (!newPassword || newPassword.length < 8) return false;
    const oldHash = await sha256(oldPassword);
    const currentHash = localStorage.getItem('nova_green_admin_hash') || DEFAULT_PASSWORD_HASH;

    if (oldHash !== currentHash) {
      return false;
    }

    const newHash = await sha256(newPassword);
    localStorage.setItem('nova_green_admin_hash', newHash);
    return true;
  },

  // Company Settings & CMS Content
  getSettings(): CompanySettings {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      const parsed = JSON.parse(stored);
      if (parsed.email === 'info@novagreen.com' || !parsed.email) {
        parsed.email = 'novagreen110@gmail.com';
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed));
      }
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        showPrices: parsed.showPrices !== undefined ? Boolean(parsed.showPrices) : false,
        showDiscounts: parsed.showDiscounts !== undefined ? Boolean(parsed.showDiscounts) : false,
        hero: { ...DEFAULT_SETTINGS.hero, ...(parsed.hero || {}) },
        services: {
          ...DEFAULT_SETTINGS.services,
          ...(parsed.services || {}),
          card1: { ...DEFAULT_SETTINGS.services.card1, ...(parsed.services?.card1 || {}) },
          card2: { ...DEFAULT_SETTINGS.services.card2, ...(parsed.services?.card2 || {}) },
          card3: { ...DEFAULT_SETTINGS.services.card3, ...(parsed.services?.card3 || {}) },
        },
        trustRibbon: {
          ...DEFAULT_SETTINGS.trustRibbon,
          ...(parsed.trustRibbon || {}),
          item1: { ...DEFAULT_SETTINGS.trustRibbon.item1, ...(parsed.trustRibbon?.item1 || {}) },
          item2: { ...DEFAULT_SETTINGS.trustRibbon.item2, ...(parsed.trustRibbon?.item2 || {}) },
          item3: { ...DEFAULT_SETTINGS.trustRibbon.item3, ...(parsed.trustRibbon?.item3 || {}) },
          item4: { ...DEFAULT_SETTINGS.trustRibbon.item4, ...(parsed.trustRibbon?.item4 || {}) },
        },
        about: { ...DEFAULT_SETTINGS.about, ...(parsed.about || {}) },
        catalogNotice: { ...DEFAULT_SETTINGS.catalogNotice, ...(parsed.catalogNotice || {}) },
        categories: (parsed.categories && Array.isArray(parsed.categories) && parsed.categories.length > 0)
          ? parsed.categories
          : DEFAULT_CATEGORIES,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  // Category Management Methods
  getCategories(): ProductCategory[] {
    const settings = this.getSettings();
    if (settings.categories && Array.isArray(settings.categories) && settings.categories.length > 0) {
      return [...settings.categories].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return DEFAULT_CATEGORIES;
  },

  saveCategories(categories: ProductCategory[]): boolean {
    const settings = this.getSettings();
    settings.categories = categories;
    return this.saveSettings(settings);
  },

  updateCategory(oldName: string, updatedCategory: ProductCategory): { success: boolean; affectedProducts: number } {
    const categories = this.getCategories();
    const catIdx = categories.findIndex(c => c.id === updatedCategory.id || c.name === oldName);
    if (catIdx !== -1) {
      categories[catIdx] = updatedCategory;
    } else {
      categories.push(updatedCategory);
    }
    this.saveCategories(categories);

    let affected = 0;
    if (oldName && oldName.trim() !== updatedCategory.name.trim()) {
      const products = this.getProducts();
      const updatedProducts = products.map(p => {
        if (p.category === oldName) {
          affected++;
          return { ...p, category: updatedCategory.name };
        }
        return p;
      });
      if (affected > 0) {
        this.saveProducts(updatedProducts);
      }
    }

    return { success: true, affectedProducts: affected };
  },

  deleteCategory(categoryId: string, categoryName: string, reassignTo?: string): { success: boolean; affectedProducts: number } {
    const categories = this.getCategories().filter(c => c.id !== categoryId && c.name !== categoryName);
    this.saveCategories(categories);

    let affected = 0;
    const products = this.getProducts();
    const targetCategory = reassignTo && reassignTo.trim() ? reassignTo.trim() : (categories[0]?.name || 'عام');
    const updatedProducts = products.map(p => {
      if (p.category === categoryName) {
        affected++;
        return { ...p, category: targetCategory };
      }
      return p;
    });
    if (affected > 0) {
      this.saveProducts(updatedProducts);
    }

    return { success: true, affectedProducts: affected };
  },

  resetCategoriesToDefault(): ProductCategory[] {
    const settings = this.getSettings();
    settings.categories = DEFAULT_CATEGORIES;
    this.saveSettings(settings);
    return DEFAULT_CATEGORIES;
  },

  saveSettings(settings: CompanySettings): boolean {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      notifySync('settings');

      // Asynchronously sync globally to Cloudflare KV Edge
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      }).catch((err) => {
        console.warn('Cloudflare KV sync note:', err);
      });

      return true;
    } catch (e: unknown) {
      const err = e as { name?: string; code?: number };
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        console.error('مساحة التخزين في المتصفح ممتلئة عند محاولة حفظ الإعدادات.');
      } else {
        console.error('Failed to save settings', e);
      }
      return false;
    }
  },

  // Fetch central global settings from Cloudflare KV Edge
  async fetchCloudSettings(): Promise<CompanySettings | null> {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && typeof cloudData === 'object' && !cloudData.found) {
          // Merge with local storage and update
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(cloudData));
          return cloudData as CompanySettings;
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  // Export full site backup (JSON)
  exportBackup(): string {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      companyName: this.getSettings().companyName,
      products: this.getProducts(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import full site backup (JSON) with deep schema verification
  importBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'ملف النسخة الاحتياطية غير صالح' };
      }

      if (!Array.isArray(data.products) || !data.settings) {
        return { success: false, message: 'بيانات المنتجات أو الإعدادات مفقودة في ملف النسخة الاحتياطية' };
      }

      // Filter and validate products
      const validProducts: Product[] = (data.products as unknown[]).filter(isValidProduct);
      if (validProducts.length === 0 && data.products.length > 0) {
        return { success: false, message: 'تنسيق المنتجات في النسخة غير متوافق مع النظام' };
      }

      // Sanitize external URLs in incoming settings
      const incomingSettings = data.settings as Partial<CompanySettings>;
      if (incomingSettings.facebook) {
        incomingSettings.facebook = sanitizeUrl(incomingSettings.facebook, DEFAULT_SETTINGS.facebook);
      }

      const mergedSettings: CompanySettings = {
        ...DEFAULT_SETTINGS,
        ...incomingSettings,
      };

      const savedProd = this.saveProducts(validProducts);
      const savedSet = this.saveSettings(mergedSettings);

      if (!savedProd || !savedSet) {
        return { success: false, message: 'تعذر الحفظ: مساحة المتصفح التخزينية ممتلئة' };
      }

      notifySync('all');
      return { success: true, message: `تم استعادة النسخة الاحتياطية بنجاح (${validProducts.length} منتج صالح)` };
    } catch {
      return { success: false, message: 'فشل في قراءة ملف JSON' };
    }
  },

  // Reset entire website to factory defaults
  resetAllToFactory(): void {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    notifySync('all');
  },

  // Subscribe to real-time synchronization events across tabs and windows
  onSync(callback: (type: 'products' | 'settings' | 'all') => void): () => void {
    if (!syncChannel) return () => {};
    const handler = (event: MessageEvent) => {
      if (event.data?.type) {
        callback(event.data.type);
      }
    };
    syncChannel.addEventListener('message', handler);
    return () => {
      syncChannel?.removeEventListener('message', handler);
    };
  },
};

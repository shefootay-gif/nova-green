import type { Product, SafeUser, CompanySettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_STORAGE_KEY = 'nova_green_products_v3';
const SETTINGS_STORAGE_KEY = 'nova_green_settings_v2';
const AUTH_TOKEN_KEY = 'nova_green_admin_session';

export const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'نوفا جرين',
  tagline: 'حلول زراعية • جودة • ثقة',
  phone: '011 31603110',
  whatsapp: '011 31603110',
  facebook: 'https://www.facebook.com/share/1BurYZKAcy/',
  email: 'info@novagreen.com',
  address: 'جمهورية مصر العربية - خدمة المزارعين في كافة المحافظات',
  workingHours: 'يومياً من 9:00 صباحاً حتى 9:00 مساءً (دعم فني واستشارات متواصل)',
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

  // Save full product array
  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
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
      // Store session token
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({
        token: 'session_' + Math.random().toString(36).substring(2),
        user: safeUser,
        timestamp: Date.now(),
      }));
      return safeUser;
    }
    return null;
  },

  // Get current logged-in user (strictly returns SafeUser without password)
  getCurrentUser(): SafeUser | null {
    try {
      const session = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!session) return null;
      const parsed = JSON.parse(session);
      return parsed.user as SafeUser;
    } catch {
      return null;
    }
  },

  // Logout
  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Change admin password securely
  async updatePassword(oldPassword: string, newPassword: string): Promise<boolean> {
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
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
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
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: CompanySettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
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

  // Import full site backup (JSON)
  importBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.products || !Array.isArray(data.products) || !data.settings) {
        return { success: false, message: 'ملف النسخة الاحتياطية غير صالح أو تالف' };
      }
      this.saveProducts(data.products);
      this.saveSettings(data.settings);
      return { success: true, message: `تم استعادة النسخة الاحتياطية بنجاح (${data.products.length} منتج)` };
    } catch {
      return { success: false, message: 'فشل في قراءة ملف JSON' };
    }
  },

  // Reset entire website to factory defaults
  resetAllToFactory(): void {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  },
};

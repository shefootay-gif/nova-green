import type { Product, SafeUser, CompanySettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_STORAGE_KEY = 'nova_green_products_v3';
const SETTINGS_STORAGE_KEY = 'nova_green_settings_v1';
const AUTH_TOKEN_KEY = 'nova_green_admin_session';

export const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'نوفا جرين',
  tagline: 'حلول زراعية • جودة • ثقة',
  phone: '011 31603110',
  whatsapp: '011 31603110',
  facebook: 'https://www.facebook.com/share/1BurYZKAcy/',
  email: 'info@novagreen.com',
  address: 'جمهورية مصر العربية - خدمة المزارعين في كافة المحافظات',
};

// Pre-computed SHA-256 hash for default password: "admin123"
// Generated via SHA-256 of "admin123"
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

  // Company Settings
  getSettings(): CompanySettings {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
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
  }
};

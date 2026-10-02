export interface Product {
  id: string;
  name: string;
  category: string;
  activeIngredient: string;
  description: string;
  price?: number;
  oldPrice?: number;
  unit?: string;
  usage?: string;
  imageUrl?: string;
  badge?: string;
  isActive: boolean;
  createdAt: string;
}

// User Entity without password (following User Entity Security Rule)
export interface SafeUser {
  id: string;
  username: string;
  role: 'admin';
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  email: string;
  address: string;
}

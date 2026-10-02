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

export interface HeroContent {
  topBadge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  checklist1: string;
  checklist2: string;
  checklist3: string;
  checklist4: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  primaryBtnText: string;
  secondaryBtnText: string;
}

export interface TrustRibbonItem {
  title: string;
  subtitle: string;
}

export interface TrustRibbonContent {
  item1: TrustRibbonItem;
  item2: TrustRibbonItem;
  item3: TrustRibbonItem;
  item4: TrustRibbonItem;
}

export interface ServiceCardItem {
  title: string;
  tag: string;
  description: string;
  point1: string;
  point2: string;
  point3: string;
}

export interface ServicesContent {
  badge: string;
  title: string;
  subtitle: string;
  card1: ServiceCardItem;
  card2: ServiceCardItem;
  card3: ServiceCardItem;
}

export interface AboutContent {
  badge: string;
  title: string;
  description: string;
  extendedText1: string;
  extendedText2: string;
  visionTitle: string;
  visionText: string;
  valuesTitle: string;
  valuesText: string;
}

export interface CatalogNoticeContent {
  title: string;
  text: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  email: string;
  address: string;
  workingHours: string;
  hero: HeroContent;
  services: ServicesContent;
  trustRibbon: TrustRibbonContent;
  about: AboutContent;
  catalogNotice: CatalogNoticeContent;
}

export type Language = 'en' | 'hi' | 'mr' | 'gu';

export type AppScreen =
  | 'splash'
  | 'language'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'wizard_step1_photo'
  | 'wizard_step2_voice'
  | 'wizard_step3_catalog'
  | 'wizard_step4_pricing'
  | 'wizard_preview'
  | 'my_products'
  | 'product_detail'
  | 'notifications'
  | 'settings'
  | 'market'
  | 'insights'
  | 'profile';

export type BottomTab = 'home' | 'my_products' | 'market' | 'insights' | 'profile';

export interface ArtisanProfile {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  experienceYears: number;
  totalProducts: number;
  activeListings: number;
  buyerEnquiries: number;
  monthlyEarnings: number;
  primaryCraft: 'Pottery' | 'Textiles' | 'Jewelry' | 'Woodcraft' | 'Metalcraft';
  phone?: string;
  bio?: string;
  verified?: boolean;
}

export interface ProductItem {
  id: string;
  title: string;
  hindiTitle?: string;
  price: number;
  category: string;
  tags: string[];
  materials: string;
  craftTechnique?: string;
  craftOrigin?: string;
  badges: Array<'Handmade' | 'Eco-friendly' | 'Verified Artisan' | 'Best Seller' | 'Sustainable'>;
  originalImage: string;
  enhancedImage: string;
  artisanName: string;
  artisanLocation: string;
  artisanAvatar: string;
  story: string;
  hindiStory?: string;
  hindiSpeechTranscript?: string;
  status: 'published' | 'draft' | 'under_review';
  costBreakdown?: {
    material: number;
    labor: number;
    other: number;
    totalBase: number;
  };
  inStock: boolean;
  viewsCount: number;
  likesCount: number;
  buyerRequestsCount: number;
}

export interface OrderRequest {
  id: string;
  buyerName: string;
  buyerCompany?: string;
  title: string;
  productImage: string;
  quantity: number;
  expectedDelivery: string;
  status: 'pending' | 'accepted' | 'declined';
  totalValue: number;
  messages: Array<{
    sender: 'buyer' | 'artisan';
    text: string;
    time: string;
  }>;
}

export interface WeeklyViewStat {
  day: string;
  views: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'buyer_request' | 'product_published' | 'price_updated' | 'verification' | 'order_dispatched';
  time: string;
  read: boolean;
  actionTarget?: AppScreen;
  relatedId?: string;
}

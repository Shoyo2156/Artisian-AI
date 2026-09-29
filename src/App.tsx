/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppScreen, BottomTab, Language, ProductItem, OrderRequest, ArtisanProfile, NotificationItem } from './types';
import { DEFAULT_ARTISAN, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_NOTIFICATIONS } from './data/mockData';
import {
  analyticsApi,
  authApi,
  buyerRequestsApi,
  marketplaceApi,
  notificationsApi,
  productsApi,
  profileApi,
  setToken,
} from './services/api';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SplashView } from './components/SplashView';
import { LanguageSelectView } from './components/LanguageSelectView';
import { LoginView } from './components/LoginView';
import { OnboardingView } from './components/OnboardingView';
import { DashboardView } from './components/DashboardView';
import { Step1PhotoEnhance } from './components/wizard/Step1PhotoEnhance';
import { Step2VoiceDescription } from './components/wizard/Step2VoiceDescription';
import { Step3AICatalogGenerator } from './components/wizard/Step3AICatalogGenerator';
import { Step3SmartPricing } from './components/wizard/Step3SmartPricing';
import { Step4ProductPreview } from './components/wizard/Step4ProductPreview';
import { MyProductsView } from './components/MyProductsView';
import { BuyerProductDetailView } from './components/BuyerProductDetailView';
import { MarketplaceView } from './components/MarketplaceView';
import { InsightsView } from './components/InsightsView';
import { ProfileView } from './components/ProfileView';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { OrderChatModal } from './components/OrderChatModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { LayoutGrid, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [currentTab, setCurrentTab] = useState<BottomTab>('home');
  const [language, setLanguage] = useState<Language>('en');

  // Application Data States
  const [artisan, setArtisan] = useState<ArtisanProfile>(DEFAULT_ARTISAN);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [marketProducts, setMarketProducts] = useState<ProductItem[]>(
    INITIAL_PRODUCTS.filter((p) => p.status === 'published')
  );
  const [orders, setOrders] = useState<OrderRequest[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(products[0]);

  // Temporary Product Wizard State
  const [draftProduct, setDraftProduct] = useState<ProductItem>({
    id: `prod_${Date.now()}`,
    title: 'Handcrafted Terracotta Clay Water Pot',
    hindiTitle: 'पारंपरिक हस्तनिर्मित मिट्टी का मटका',
    price: 899,
    category: 'Pottery & Ceramics',
    tags: ['Pottery', 'Terracotta', 'Handmade', 'Eco-friendly'],
    materials: 'Natural River Clay, Organic Mineral Dyes',
    craftTechnique: 'Wheel Thrown & Hand-Carved',
    craftOrigin: 'Kutch Artisanal Cluster, Gujarat',
    badges: ['Handmade', 'Eco-friendly', 'Verified Artisan'],
    originalImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    enhancedImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    artisanName: 'Meera Devi',
    artisanLocation: 'Bhuj, Gujarat',
    artisanAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    story: `Hand-thrown on traditional wooden wheels using fine riverbed clay sourced sustainably from local riverbeds. Kiln-fired with natural organic glazes for authentic earth-cooling properties.

Every curve is sculpted with generational knowledge passed down through five generations of master artisans.`,
    hindiSpeechTranscript: "यह एक हस्तशिल्प मिट्टी का मटका है, जिसे मैंने अपने हाथों से बनाया है। इसकी खास बात यह है कि यह पानी को प्राकृतिक रूप से ठंडा रखता है।",
    costBreakdown: {
      material: 350,
      labor: 250,
      other: 50,
      totalBase: 650,
    },
    inStock: true,
    status: 'published',
    viewsCount: 142,
    likesCount: 38,
    buyerRequestsCount: 8,
  });

  // Modal States
  const [activeChatOrder, setActiveChatOrder] = useState<OrderRequest | null>(null);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [showScreenSwitcher, setShowScreenSwitcher] = useState(false);

  const refreshFromApi = async () => {
    const [profile, myProducts, market, requests, notifs, overview] = await Promise.all([
      profileApi.get(),
      productsApi.list(),
      marketplaceApi.list(),
      buyerRequestsApi.list(),
      notificationsApi.list(),
      analyticsApi.overview(),
    ]);
    if (profile) setArtisan(profile);
    if (Array.isArray(myProducts)) setProducts(myProducts);
    if (Array.isArray(market)) setMarketProducts(market);
    if (Array.isArray(requests)) setOrders(requests);
    if (Array.isArray(notifs)) setNotifications(notifs);
    if (overview) setAnalytics(overview);
  };

  const toProductPayload = (item: ProductItem) => ({
    title: item.title,
    hindiTitle: item.hindiTitle,
    price: item.price,
    category: item.category,
    tags: item.tags,
    materials: item.materials,
    craftTechnique: item.craftTechnique,
    craftOrigin: item.craftOrigin,
    badges: item.badges,
    originalImage: item.originalImage,
    enhancedImage: item.enhancedImage,
    story: item.story,
    hindiStory: item.hindiStory,
    hindiSpeechTranscript: item.hindiSpeechTranscript,
    costBreakdown: item.costBreakdown,
    inStock: item.inStock,
    status: item.status,
  });

  // Tab Selection
  const handleSelectTab = (tab: BottomTab) => {
    setCurrentTab(tab);
    if (tab === 'home') setCurrentScreen('dashboard');
    else if (tab === 'my_products') setCurrentScreen('my_products');
    else if (tab === 'market') setCurrentScreen('market');
    else if (tab === 'insights') setCurrentScreen('insights');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  // Wizard transitions
  const handleStartWizard = () => {
    setCurrentScreen('wizard_step1_photo');
  };

  // Step 1: AI Image Studio complete -> Step 2
  const handleStep1Complete = (origImg: string, enhImg: string) => {
    setDraftProduct((prev) => ({
      ...prev,
      originalImage: origImg,
      enhancedImage: enhImg,
    }));
    setCurrentScreen('wizard_step2_voice');
  };

  // Step 2: Voice Description complete -> Step 3 (AI Catalog Generator)
  const handleStep2Complete = (transcript: string, englishStory: string) => {
    setDraftProduct((prev) => ({
      ...prev,
      hindiSpeechTranscript: transcript,
      story: englishStory || prev.story,
    }));
    setCurrentScreen('wizard_step3_catalog');
  };

  // Step 3: AI Catalog Generator complete -> Step 4 (Smart Pricing)
  const handleStep3CatalogComplete = (catalogData: {
    title: string;
    hindiTitle?: string;
    story: string;
    hindiStory?: string;
    category: string;
    tags: string[];
    materials?: string;
    craftTechnique?: string;
    craftOrigin?: string;
  }) => {
    setDraftProduct((prev) => ({
      ...prev,
      title: catalogData.title,
      hindiTitle: catalogData.hindiTitle,
      story: catalogData.story,
      hindiStory: catalogData.hindiStory,
      category: catalogData.category,
      tags: catalogData.tags,
      materials: catalogData.materials || prev.materials,
      craftTechnique: catalogData.craftTechnique || prev.craftTechnique,
      craftOrigin: catalogData.craftOrigin || prev.craftOrigin,
    }));
    setCurrentScreen('wizard_step4_pricing');
  };

  // Step 4: Smart Pricing complete -> Step 5 (Final Product Preview)
  const handleStep4PricingComplete = (pricing: {
    material: number;
    labor: number;
    other: number;
    totalBase: number;
    finalPrice: number;
  }) => {
    setDraftProduct((prev) => ({
      ...prev,
      price: pricing.finalPrice,
      costBreakdown: {
        material: pricing.material,
        labor: pricing.labor,
        other: pricing.other,
        totalBase: pricing.totalBase,
      },
    }));
    setCurrentScreen('wizard_preview');
  };

  // Final Publish -> Add to list -> My Products view
  const handlePublishListing = async (newProduct: ProductItem) => {
    const localItem: ProductItem = {
      ...newProduct,
      id: `prod_${Date.now()}`,
      artisanName: artisan.name,
      artisanLocation: artisan.location,
      artisanAvatar: artisan.avatar,
      status: 'published',
      viewsCount: 1,
      likesCount: 1,
      buyerRequestsCount: 0,
    };

    try {
      const created = await productsApi.create({
        ...toProductPayload(newProduct),
        status: 'draft',
      });
      const published = created?.id ? await productsApi.publish(created.id) : created;
      const finalItem = { ...localItem, ...published, status: 'published' as const };
      setProducts((prev) => [finalItem, ...prev.filter((p) => p.id !== finalItem.id)]);
      setMarketProducts((prev) => [finalItem, ...prev.filter((p) => p.id !== finalItem.id)]);
      setSelectedProduct(finalItem);
      try {
        const notifs = await notificationsApi.list();
        if (Array.isArray(notifs)) setNotifications(notifs);
      } catch {
        /* keep local notification below if list fails */
      }
    } catch {
      setProducts((prev) => [localItem, ...prev]);
      setMarketProducts((prev) => [localItem, ...prev]);
      setSelectedProduct(localItem);
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: 'Craft Published Successfully! 🎉',
        message: `"${localItem.title}" is now live on Artisan AI Marketplace with Verified Artisan badge.`,
        time: 'Just now',
        read: false,
        type: 'product_published',
        actionTarget: 'my_products',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    setCurrentTab('my_products');
    setCurrentScreen('my_products');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'accepted' | 'declined') => {
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
    try {
      await buyerRequestsApi.updateStatus(orderId, status === 'declined' ? 'rejected' : status);
    } catch {
      /* local status already applied */
    }
  };

  const handleSendMessage = (orderId: string, text: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            messages: [
              ...ord.messages,
              { sender: 'artisan', text, time: 'Just now' },
            ],
          };
        }
        return ord;
      })
    );
    if (activeChatOrder && activeChatOrder.id === orderId) {
      setActiveChatOrder((prev) =>
        prev
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                { sender: 'artisan', text, time: 'Just now' },
              ],
            }
          : null
      );
    }
    buyerRequestsApi.addMessage(orderId, text).catch(() => {});
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notificationsApi.markAllRead().catch(() => {});
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const allScreensList: Array<{ id: AppScreen; label: string; number: number }> = [
    { id: 'splash', label: '1. Splash Screen', number: 1 },
    { id: 'language', label: '2. Language Select', number: 2 },
    { id: 'login', label: '3. Artisan Login', number: 3 },
    { id: 'register', label: '4. Onboarding / Register', number: 4 },
    { id: 'dashboard', label: '5. Artisan Dashboard', number: 5 },
    { id: 'wizard_step1_photo', label: '6. Step 1/4 Photo Studio', number: 6 },
    { id: 'wizard_step2_voice', label: '7. Step 2/4 Voice Description', number: 7 },
    { id: 'wizard_step3_catalog', label: '8. Step 3/4 AI Catalog Generator', number: 8 },
    { id: 'wizard_step4_pricing', label: '9. Step 4/4 Smart Pricing', number: 9 },
    { id: 'wizard_preview', label: '10. Product Preview & Story', number: 10 },
    { id: 'my_products', label: '11. My Products Catalog', number: 11 },
    { id: 'product_detail', label: '12. Buyer Product Detail & Bulk Quote', number: 12 },
    { id: 'market', label: '13. Live Marketplace', number: 13 },
    { id: 'insights', label: '14. Analytics & Orders', number: 14 },
    { id: 'profile', label: '15. Artisan Profile & Voice Chat', number: 15 },
    { id: 'notifications', label: '16. Notifications Center', number: 16 },
    { id: 'settings', label: '17. Account & App Settings', number: 17 },
  ];

  // Screen header conditions
  const isTabScreen = ['dashboard', 'my_products', 'market', 'insights', 'profile'].includes(currentScreen);
  const isWizardScreen = [
    'wizard_step1_photo',
    'wizard_step2_voice',
    'wizard_step3_catalog',
    'wizard_step4_pricing',
    'wizard_preview',
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#f3ede7] text-[#1d1b18] flex flex-col items-center justify-center sm:py-6">
      {/* Top Floating Screen Switcher for Quick Review */}
      <aside aria-label="Screen Navigation" className="w-full max-w-lg mb-3 px-3 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-1.5 font-bold text-[#94442e]">
          <Sparkles className="w-4 h-4 text-[#ffab69]" />
          <span>Artisan AI Design System</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowScreenSwitcher(!showScreenSwitcher)}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#dbc1ba] shadow-xs font-semibold text-[#55433e] flex items-center gap-1.5 hover:border-[#94442e] transition-all cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#94442e]" />
            <span>Screen Jump ({allScreensList.find((s) => s.id === currentScreen)?.number || 1}/{allScreensList.length})</span>
          </button>

          {showScreenSwitcher && (
            <div className="absolute right-0 top-9 w-72 bg-white rounded-2xl shadow-2xl border border-[#dbc1ba] p-2 z-50 animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#88705e] border-b border-[#ebdcd3] mb-1">
                All Application Screens
              </div>
              {allScreensList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentScreen(s.id);
                    if (s.id === 'dashboard') setCurrentTab('home');
                    if (s.id === 'my_products') setCurrentTab('my_products');
                    if (s.id === 'market') setCurrentTab('market');
                    if (s.id === 'insights') setCurrentTab('insights');
                    if (s.id === 'profile') setCurrentTab('profile');
                    setShowScreenSwitcher(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    currentScreen === s.id
                      ? 'bg-[#ffdbd1] text-[#94442e] font-bold'
                      : 'text-[#55433e] hover:bg-[#f8f3ed]'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Mobile App Shell Frame */}
      <div className="w-full max-w-md bg-[#fef8f2] min-h-screen sm:min-h-[844px] sm:max-h-[890px] sm:rounded-[36px] shadow-[0_12px_40px_rgba(74,55,40,0.12)] border border-[#ebdcd3] flex flex-col overflow-hidden relative">
        {/* Render Screen Header if needed */}
        {isTabScreen && (
          <Header
            lang={language}
            onLanguageChange={setLanguage}
            artisan={artisan}
            showArtisanAvatar={currentTab === 'home' || currentTab === 'insights'}
            onOpenNotifications={() => setCurrentScreen('notifications')}
            unreadNotificationsCount={unreadNotificationsCount}
          />
        )}

        {isWizardScreen && (
          <Header
            title={
              currentScreen === 'wizard_preview'
                ? 'Product Preview'
                : currentScreen === 'wizard_step4_pricing'
                ? 'Smart Pricing'
                : currentScreen === 'wizard_step3_catalog'
                ? 'AI Catalog Generator'
                : currentScreen === 'wizard_step2_voice'
                ? 'Artisan AI Voice'
                : 'AI Photo Studio'
            }
            showBack={true}
            onBack={() => {
              if (currentScreen === 'wizard_step1_photo') setCurrentScreen('dashboard');
              else if (currentScreen === 'wizard_step2_voice') setCurrentScreen('wizard_step1_photo');
              else if (currentScreen === 'wizard_step3_catalog') setCurrentScreen('wizard_step2_voice');
              else if (currentScreen === 'wizard_step4_pricing') setCurrentScreen('wizard_step3_catalog');
              else if (currentScreen === 'wizard_preview') setCurrentScreen('wizard_step4_pricing');
            }}
            lang={language}
            onLanguageChange={setLanguage}
          />
        )}

        {/* Dynamic Screen View Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {currentScreen === 'splash' && (
            <SplashView
              onContinue={() => setCurrentScreen('language')}
              lang={language}
            />
          )}

          {currentScreen === 'language' && (
            <LanguageSelectView
              currentLang={language}
              onSelectLanguage={(l) => setLanguage(l)}
              onContinue={() => setCurrentScreen('login')}
            />
          )}

          {currentScreen === 'login' && (
            <LoginView
              onLoginSuccess={async (mobile, password) => {
                try {
                  const result = await authApi.login(mobile, password);
                  setToken(result.access_token);
                  if (result.user) setArtisan(result.user);
                  await refreshFromApi();
                } catch {
                  /* keep demo mock data so login still works offline */
                }
                setCurrentScreen('dashboard');
                setCurrentTab('home');
              }}
              onCreateAccount={() => setCurrentScreen('register')}
              lang={language}
            />
          )}

          {currentScreen === 'register' && (
            <OnboardingView
              onComplete={async (data) => {
                setArtisan((prev) => ({ ...prev, ...data }));
                try {
                  const result = await authApi.register({
                    name: data.name || artisan.name,
                    mobile: artisan.phone?.replace(/\D/g, '').slice(-10) || '9876543210',
                    password: 'artisan123',
                    location: data.location || artisan.location,
                    craft_type: data.primaryCraft || artisan.primaryCraft,
                    business_type: data.role || artisan.role,
                  });
                  setToken(result.access_token);
                  if (result.user) setArtisan((prev) => ({ ...prev, ...result.user, ...data }));
                  await refreshFromApi();
                } catch {
                  try {
                    const result = await authApi.login(
                      artisan.phone?.replace(/\D/g, '').slice(-10) || '9876543210',
                      'artisan123'
                    );
                    setToken(result.access_token);
                    await refreshFromApi();
                    setArtisan((prev) => ({ ...prev, ...data }));
                  } catch {
                    /* stay on local demo profile */
                  }
                }
                setCurrentScreen('dashboard');
                setCurrentTab('home');
              }}
              onBack={() => setCurrentScreen('login')}
              lang={language}
            />
          )}

          {currentScreen === 'dashboard' && (
            <DashboardView
              artisan={artisan}
              products={products}
              onAddNewProduct={handleStartWizard}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setCurrentScreen('product_detail');
              }}
              onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
              onNavigateTab={handleSelectTab}
              lang={language}
            />
          )}

          {/* Step 1 of 4: AI Image Studio */}
          {currentScreen === 'wizard_step1_photo' && (
            <Step1PhotoEnhance
              onContinue={handleStep1Complete}
              onBack={() => setCurrentScreen('dashboard')}
              lang={language}
            />
          )}

          {/* Step 2 of 4: Voice Description */}
          {currentScreen === 'wizard_step2_voice' && (
            <Step2VoiceDescription
              onContinue={handleStep2Complete}
              onSkip={() => setCurrentScreen('wizard_step3_catalog')}
              lang={language}
            />
          )}

          {/* Step 3 of 4: AI Catalog Generator */}
          {currentScreen === 'wizard_step3_catalog' && (
            <Step3AICatalogGenerator
              initialMetadata={{
                title: draftProduct.title,
                hindiTitle: draftProduct.hindiTitle || '',
                story: draftProduct.story,
                hindiStory: draftProduct.hindiStory || '',
                category: draftProduct.category,
                materials: draftProduct.materials,
                craftTechnique: draftProduct.craftTechnique || '',
                craftOrigin: draftProduct.craftOrigin || '',
                tags: draftProduct.tags,
              }}
              enhancedImage={draftProduct.enhancedImage}
              onContinue={handleStep3CatalogComplete}
              onBack={() => setCurrentScreen('wizard_step2_voice')}
              lang={language}
            />
          )}

          {/* Step 4 of 4: Smart Pricing */}
          {currentScreen === 'wizard_step4_pricing' && (
            <Step3SmartPricing
              onContinue={handleStep4PricingComplete}
              onBack={() => setCurrentScreen('wizard_step3_catalog')}
              lang={language}
            />
          )}

          {/* Final Product Preview */}
          {currentScreen === 'wizard_preview' && (
            <Step4ProductPreview
              product={draftProduct}
              onPublish={handlePublishListing}
              onEdit={() => setCurrentScreen('wizard_step3_catalog')}
              onBack={() => setCurrentScreen('wizard_step4_pricing')}
              lang={language}
            />
          )}

          {/* My Products Tab View */}
          {currentScreen === 'my_products' && (
            <MyProductsView
              products={products}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setCurrentScreen('product_detail');
              }}
              onAddNewProduct={handleStartWizard}
              onEditProduct={(p) => {
                setDraftProduct(p);
                setCurrentScreen('wizard_step3_catalog');
              }}
              lang={language}
            />
          )}

          {/* Buyer Product Detail View */}
          {currentScreen === 'product_detail' && (
            <BuyerProductDetailView
              product={selectedProduct}
              artisan={artisan}
              onBack={() => {
                if (currentTab === 'my_products') setCurrentScreen('my_products');
                else if (currentTab === 'market') setCurrentScreen('market');
                else setCurrentScreen('dashboard');
              }}
              onContactArtisan={() => {
                if (orders.length > 0) {
                  setActiveChatOrder(orders[0]);
                }
              }}
              onSubmitBulkOrder={async ({ productId, quantity, offeredPrice, message }) => {
                try {
                  const created = await buyerRequestsApi.create({
                    product_id: productId,
                    artisan_id: artisan.id,
                    buyer_name: 'Marketplace Buyer',
                    quantity,
                    offered_price: offeredPrice,
                    message,
                    title: `Bulk enquiry for ${quantity} ${selectedProduct.title}`,
                    product_image: selectedProduct.enhancedImage,
                  });
                  if (created) setOrders((prev) => [created, ...prev]);
                } catch {
                  /* enquiry still shown as submitted in the UI */
                }
              }}
              lang={language}
            />
          )}

          {/* Marketplace View */}
          {currentScreen === 'market' && (
            <MarketplaceView
              products={marketProducts}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setCurrentScreen('product_detail');
              }}
              lang={language}
            />
          )}

          {/* Insights & Orders View */}
          {currentScreen === 'insights' && (
            <InsightsView
              orders={orders}
              onOpenOrderChat={(ord) => setActiveChatOrder(ord)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              lang={language}
              analytics={analytics}
            />
          )}

          {/* Profile & Assistant View */}
          {currentScreen === 'profile' && (
            <ProfileView
              artisan={artisan}
              onAddNewProduct={handleStartWizard}
              onViewEarnings={() => handleSelectTab('insights')}
              onViewMessages={() => {
                handleSelectTab('insights');
                if (orders.length > 0) setActiveChatOrder(orders[0]);
              }}
              lang={language}
            />
          )}

          {/* Notifications Center View */}
          {currentScreen === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onNavigateScreen={(screen) => {
                setCurrentScreen(screen);
                if (screen === 'my_products') setCurrentTab('my_products');
                if (screen === 'insights') setCurrentTab('insights');
                if (screen === 'market') setCurrentTab('market');
              }}
              onBack={() => {
                if (currentTab === 'home') setCurrentScreen('dashboard');
                else if (currentTab === 'my_products') setCurrentScreen('my_products');
                else if (currentTab === 'market') setCurrentScreen('market');
                else if (currentTab === 'insights') setCurrentScreen('insights');
                else if (currentTab === 'profile') setCurrentScreen('profile');
              }}
              lang={language}
            />
          )}

          {/* Settings View */}
          {currentScreen === 'settings' && (
            <SettingsView
              artisan={artisan}
              lang={language}
              onLanguageChange={setLanguage}
              onUpdateProfile={async (updated) => {
                setArtisan((prev) => ({ ...prev, ...updated }));
                try {
                  const saved = await profileApi.update(updated);
                  if (saved) setArtisan(saved);
                } catch {
                  /* local profile already updated */
                }
              }}
              onLogout={() => {
                setToken(null);
                setCurrentScreen('login');
              }}
              onBack={() => {
                setCurrentTab('profile');
                setCurrentScreen('profile');
              }}
            />
          )}
        </main>

        {/* Bottom Tab Navigation Bar for Main Tabs */}
        {isTabScreen && (
          <Navigation
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            lang={language}
            unreadCount={orders.filter((o) => o.status === 'pending').length}
          />
        )}

        {/* Modals */}
        <OrderChatModal
          order={activeChatOrder}
          onClose={() => setActiveChatOrder(null)}
          onSendMessage={handleSendMessage}
          lang={language}
        />

        <VoiceAssistantModal
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          onActionTrigger={(action) => {
            if (action === 'add_product') handleStartWizard();
            else if (action === 'my_products') handleSelectTab('my_products');
            else if (action === 'insights') handleSelectTab('insights');
            else if (action === 'market') handleSelectTab('market');
          }}
          lang={language}
        />
      </div>
    </div>
  );
}

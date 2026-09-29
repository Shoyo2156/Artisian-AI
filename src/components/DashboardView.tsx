import React from 'react';
import { Camera, Package, MessageSquare, IndianRupee, Mic, Sparkles, Plus, ArrowRight, Eye } from 'lucide-react';
import { ArtisanProfile, ProductItem, Language, BottomTab } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface DashboardViewProps {
  artisan: ArtisanProfile;
  products: ProductItem[];
  onAddNewProduct: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onOpenVoiceAssistant: () => void;
  onNavigateTab: (tab: BottomTab) => void;
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  artisan,
  products,
  onAddNewProduct,
  onSelectProduct,
  onOpenVoiceAssistant,
  onNavigateTab,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="flex-1 px-4 sm:px-5 py-4 pb-24 space-y-5 max-w-md mx-auto w-full">
      {/* Big Hero Banner: Add New Product */}
      <div className="w-full">
        <button
          onClick={onAddNewProduct}
          className="w-full bg-[#94442e] hover:bg-[#b35c44] text-white rounded-[26px] p-6 flex flex-col items-center justify-center text-center shadow-[0_8px_24px_rgba(148,68,46,0.22)] active:scale-[0.98] transition-all group relative overflow-hidden"
        >
          {/* Subtle background glow highlight */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 backdrop-blur-2xs">
            <div className="relative">
              <Camera className="w-7 h-7 text-white stroke-[2]" />
              <div className="absolute -top-1 -right-1 bg-[#ffab69] rounded-full p-0.5">
                <Plus className="w-2.5 h-2.5 text-[#783d01] stroke-[3]" />
              </div>
            </div>
          </div>

          <h2 className="font-literata text-xl sm:text-2xl font-bold tracking-tight text-white mb-0.5">
            {t.addNewProduct}
          </h2>
          <span className="text-xs text-[#ffdbd1] font-medium flex items-center gap-1 mt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#ffb780]" />
            AI Background & Voice Cataloging
          </span>
        </button>
      </div>

      {/* Top 2 Stats: Active Listings & Buyer Enquiries */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Active Listings Card */}
        <button
          onClick={() => onNavigateTab('my_products')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ebdcd3] shadow-xs text-left hover:border-[#94442e]/40 transition-all active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f8f3ed] flex items-center justify-center text-[#8e4e14] mb-3">
            <Package className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#55433e] tracking-tight mb-1">
            {t.activeListings}
          </p>
          <p className="font-literata text-2xl sm:text-3xl font-bold text-[#1d1b18]">
            {products.length || artisan.activeListings}
          </p>
        </button>

        {/* Buyer Enquiries Card */}
        <button
          onClick={() => onNavigateTab('insights')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ebdcd3] shadow-xs text-left hover:border-[#94442e]/40 transition-all active:scale-[0.98] relative"
        >
          <div className="w-8 h-8 rounded-lg bg-[#ffdcc4]/60 flex items-center justify-center text-[#8e4e14] mb-3">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffab69] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8e4e14]"></span>
          </span>
          <p className="text-xs font-bold text-[#55433e] tracking-tight mb-1">
            {t.buyerEnquiries}
          </p>
          <p className="font-literata text-2xl sm:text-3xl font-bold text-[#1d1b18]">
            {artisan.buyerEnquiries}
          </p>
        </button>
      </div>

      {/* Monthly Earnings Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#ebdcd3] shadow-xs flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2 text-[#88705e]">
          <IndianRupee className="w-4 h-4 text-[#8e4e14]" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#55433e]">
            {t.earningsThisMonth}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="font-literata text-3xl sm:text-4xl font-bold text-[#1d1b18]">
            ₹{artisan.monthlyEarnings.toLocaleString('en-IN')}
          </p>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            +24% vs last month
          </span>
        </div>
      </div>

      {/* Recent Products Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-literata text-xl font-bold text-[#1d1b18]">
            {t.recentProducts}
          </h3>
          <button
            onClick={() => onNavigateTab('my_products')}
            className="text-xs font-bold text-[#8e4e14] hover:text-[#94442e] flex items-center gap-0.5"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Product Card */}
        {products.length > 0 && (
          <div
            onClick={() => onSelectProduct(products[0])}
            className="bg-white rounded-3xl p-3 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] cursor-pointer group hover:border-[#94442e]/50 transition-all overflow-hidden"
          >
            <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#f8f3ed]">
              <img
                src={products[0].enhancedImage || products[0].originalImage}
                alt={products[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges on product image */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                <span className="bg-[#ffdcc4] text-[#783d01] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1">
                  <span>✋</span>
                  <span>{t.handmade}</span>
                </span>
                {products[0].badges.includes('Eco-friendly') && (
                  <span className="bg-[#e9f5ee] text-[#2d6a4f] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs">
                    🌿 Eco-friendly
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 pt-3.5 flex items-center justify-between">
              <div>
                <h4 className="font-literata text-base font-bold text-[#1d1b18] group-hover:text-[#94442e] transition-colors">
                  {products[0].title}
                </h4>
                <p className="text-xs text-[#88705e]">{products[0].materials}</p>
              </div>
              <div className="text-right">
                <p className="font-literata text-lg font-bold text-[#94442e]">
                  ₹{products[0].price}
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">In Stock</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Voice Assistant Button (Matches image microphone orb) */}
      <div className="fixed bottom-20 right-6 sm:right-[max(1.5rem,calc(50%-13rem))] z-40">
        <button
          onClick={onOpenVoiceAssistant}
          className="w-14 h-14 rounded-full bg-[#ffab69] hover:bg-[#ffb780] text-[#55433e] flex items-center justify-center shadow-[0_6px_20px_rgba(255,171,105,0.6)] border-2 border-white active:scale-90 transition-all"
          aria-label="Artisan Voice Assistant"
        >
          <Mic className="w-6 h-6 text-[#783d01] stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};

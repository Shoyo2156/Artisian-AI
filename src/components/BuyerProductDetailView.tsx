import React, { useState } from 'react';
import { Heart, Share2, ShieldCheck, Leaf, Sparkles, MessageCircle, ShoppingBag, Send, CheckCircle2, ChevronLeft, MapPin, Award } from 'lucide-react';
import { ProductItem, Language, ArtisanProfile } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface BuyerProductDetailViewProps {
  product: ProductItem;
  artisan?: ArtisanProfile;
  onBack: () => void;
  onContactArtisan: (product: ProductItem) => void;
  lang: Language;
  onSubmitBulkOrder?: (payload: {
    productId: string;
    quantity: number;
    offeredPrice: number;
    message: string;
  }) => void;
}

export const BuyerProductDetailView: React.FC<BuyerProductDetailViewProps> = ({
  product,
  artisan,
  onBack,
  onContactArtisan,
  lang,
  onSubmitBulkOrder,
}) => {
  const t = TRANSLATIONS[lang];
  const [isSaved, setIsSaved] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(25);
  const [customNotes, setCustomNotes] = useState('');
  const [bulkSubmitted, setBulkSubmitted] = useState(false);

  const estimatedBulkPrice = Math.round(product.price * bulkQuantity * 0.85); // 15% bulk discount

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitBulkOrder?.({
      productId: product.id,
      quantity: bulkQuantity,
      offeredPrice: estimatedBulkPrice,
      message: customNotes,
    });
    setBulkSubmitted(true);
    setTimeout(() => {
      setBulkSubmitted(false);
      setShowBulkModal(false);
    }, 1800);
  };

  return (
    <div className="flex-1 px-4 sm:px-5 py-4 pb-28 space-y-4 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Top back & action bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#dbc1ba]/60 flex items-center justify-center text-[#55433e] hover:bg-[#f8f3ed] active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-[#94442e]" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#dbc1ba]/60 flex items-center justify-center text-[#94442e] hover:bg-[#f8f3ed] active:scale-95 transition-all cursor-pointer"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#94442e] text-[#94442e]' : 'text-[#94442e]'}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.title, url: window.location.href }).catch(() => {});
              }
            }}
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#dbc1ba]/60 flex items-center justify-center text-[#55433e] hover:bg-[#f8f3ed] active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-[#55433e]" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="bg-white rounded-3xl p-3 border border-[#ebdcd3] shadow-[0_8px_24px_rgba(74,55,40,0.06)] relative overflow-hidden">
        <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#f8f3ed]">
          <img
            src={product.enhancedImage || product.originalImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />

          {/* AI Verified Badge */}
          <div className="absolute bottom-3.5 left-3.5 flex flex-wrap gap-1.5">
            <span className="bg-[#ffdcc4]/90 backdrop-blur-xs text-[#783d01] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <span>✋</span>
              <span>{t.handmade}</span>
            </span>
            <span className="bg-emerald-800/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Verified Craft</span>
            </span>
          </div>
        </div>
      </div>

      {/* Product Title & Pricing */}
      <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.05)] space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e4e14]">
              {product.category || 'Handcrafted Collection'}
            </span>
            <h1 className="font-literata text-xl sm:text-2xl font-bold text-[#1d1b18] mt-0.5">
              {product.title}
            </h1>
            {product.hindiTitle && (
              <p className="text-xs text-[#88705e] font-hindi-body mt-0.5">
                {product.hindiTitle}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#88705e] uppercase tracking-wider block">Artisan Direct</span>
            <p className="font-literata text-2xl font-extrabold text-[#94442e]">
              ₹{product.price}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.tags.map((tg) => (
            <span
              key={tg}
              className="px-2.5 py-1 rounded-lg bg-[#f8f3ed] text-[#55433e] text-[11px] font-medium border border-[#dbc1ba]/50"
            >
              #{tg}
            </span>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-xs space-y-3">
        <h3 className="font-literata text-sm font-bold text-[#1d1b18] uppercase tracking-wide">
          Craft & Material Details
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#fef8f2] border border-[#ebdcd3]">
            <span className="text-[10px] font-bold uppercase text-[#88705e] block">Materials</span>
            <p className="font-semibold text-[#1d1b18] mt-0.5">{product.materials}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#fef8f2] border border-[#ebdcd3]">
            <span className="text-[10px] font-bold uppercase text-[#88705e] block">Technique</span>
            <p className="font-semibold text-[#1d1b18] mt-0.5">{product.craftTechnique || 'Traditional Handcraft'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#fef8f2] border border-[#ebdcd3] col-span-2">
            <span className="text-[10px] font-bold uppercase text-[#88705e] block">Craft Heritage</span>
            <p className="font-semibold text-[#1d1b18] mt-0.5">{product.craftOrigin || 'Gujarat Artisanal Cluster'}</p>
          </div>
        </div>
      </div>

      {/* Story Behind the Craft */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ebdcd3] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#94442e]">
          <Sparkles className="w-5 h-5 text-[#ffab69]" />
          <h3 className="font-literata text-base font-bold text-[#1d1b18]">
            {t.storyBehind}
          </h3>
        </div>
        <p className="font-literata text-sm text-[#55433e] leading-relaxed whitespace-pre-line">
          {product.story}
        </p>
      </div>

      {/* Artisan Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-xs space-y-3.5">
        <div className="flex items-center gap-3.5">
          <img
            src={product.artisanAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
            alt={product.artisanName}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#ffab69] shadow-xs"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-literata text-base font-bold text-[#1d1b18]">
                {product.artisanName}
              </h4>
              <Award className="w-4 h-4 text-[#8e4e14]" />
            </div>
            <p className="text-xs text-[#88705e] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#94442e]" />
              <span>{product.artisanLocation || 'Bhuj, Gujarat'}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-[#55433e] leading-relaxed">
          {artisan?.bio || 'Master craftsman with over 25 years of heritage artistry preserving ancestral techniques.'}
        </p>
      </div>

      {/* Floating Bottom Buyer Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#fef8f2]/95 backdrop-blur-md border-t border-[#ebdcd3] z-40 flex items-center gap-3">
        <button
          onClick={() => onContactArtisan(product)}
          className="flex-1 min-h-[50px] bg-white border-2 border-[#94442e] text-[#94442e] rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-[#ffdbd1]/30 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-[#94442e]" />
          <span>Contact Artisan</span>
        </button>

        <button
          onClick={() => setShowBulkModal(true)}
          className="flex-[1.4] min-h-[50px] bg-[#94442e] hover:bg-[#b35c44] text-white rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[0_4px_16px_rgba(148,68,46,0.25)] cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#ffdcc4]" />
          <span>Request Bulk Order</span>
        </button>
      </div>

      {/* Bulk Order Inquiry Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#fef8f2] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border border-[#ebdcd3] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd3]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#94442e]" />
                <h3 className="font-literata text-lg font-bold text-[#1d1b18]">
                  Bulk Order Quotation
                </h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-8 h-8 rounded-full bg-[#f8f3ed] flex items-center justify-center text-[#55433e] hover:bg-[#ebdcd3] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {bulkSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-literata text-xl font-bold text-[#1d1b18]">
                  Enquiry Sent to {product.artisanName}!
                </h4>
                <p className="text-xs text-[#55433e] max-w-xs mx-auto">
                  The artisan will review your custom batch timeline and reply via direct chat.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBulkSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#55433e] uppercase tracking-wider block mb-1">
                    Select Quantity (Pieces)
                  </label>
                  <div className="flex items-center gap-2">
                    {[10, 25, 50, 100].map((qty) => (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => setBulkQuantity(qty)}
                        className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                          bulkQuantity === qty
                            ? 'bg-[#94442e] text-white shadow-2xs'
                            : 'bg-white border border-[#dbc1ba] text-[#55433e]'
                        }`}
                      >
                        {qty} pcs
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#ebdcd3] space-y-1.5">
                  <div className="flex justify-between text-[#55433e]">
                    <span>Unit Retail Price:</span>
                    <span className="font-bold">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Artisan AI Bulk Discount:</span>
                    <span className="font-bold">-15%</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1d1b18] pt-1.5 border-t border-[#ebdcd3]">
                    <span>Estimated Total:</span>
                    <span className="font-literata text-base text-[#94442e]">
                      ₹{estimatedBulkPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#55433e] uppercase tracking-wider block mb-1">
                    Custom Packaging or Timeline Notes
                  </label>
                  <textarea
                    rows={3}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="E.g., Need delivered by Diwali with custom gift packaging..."
                    className="w-full p-3 rounded-xl border border-[#dbc1ba] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#94442e]/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#94442e] hover:bg-[#b35c44] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Bulk Order Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

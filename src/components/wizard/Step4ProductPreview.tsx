import React, { useState } from 'react';
import { Heart, Sparkles, Edit3, ArrowUpRight, Check, Leaf, ShieldCheck, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductItem, Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockData';

interface Step4ProductPreviewProps {
  product: ProductItem;
  onPublish: (product: ProductItem) => void;
  onEdit: () => void;
  onBack: () => void;
  lang: Language;
}

export const Step4ProductPreview: React.FC<Step4ProductPreviewProps> = ({
  product,
  onPublish,
  onEdit,
  onBack,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [isLiked, setIsLiked] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublishClick = () => {
    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#94442e', '#ffab69', '#2d6a4f', '#ffdcc4'],
      });
    } catch (e) {
      console.log(e);
    }

    setIsPublished(true);
    setTimeout(() => {
      onPublish(product);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 sm:px-5 py-3 pb-24 max-w-md mx-auto w-full bg-[#fef8f2] space-y-4">
      {/* Product Image Card */}
      <div className="bg-white rounded-3xl p-3 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] relative overflow-hidden">
        <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#f8f3ed]">
          <img
            src={product.enhancedImage || product.originalImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />

          {/* Top Right Heart Favorite Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3.5 right-3.5 w-11 h-11 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#94442e] shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Heart
              className={`w-6 h-6 ${isLiked ? 'fill-[#94442e] text-[#94442e]' : 'text-[#94442e]'}`}
            />
          </button>
        </div>
      </div>

      {/* Product Info & Tags Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] space-y-3">
        <div>
          <h2 className="font-literata text-xl font-bold text-[#1d1b18] mb-1">
            {product.title}
          </h2>
          <p className="font-literata text-2xl font-extrabold text-[#94442e]">
            ₹{product.price}
          </p>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="bg-[#ffdcc4]/70 text-[#783d01] text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <span className="text-[10px]">🏷️</span>
            <span>{product.category || 'Home Decor'}</span>
          </span>
          <span className="bg-[#f3ede7] text-[#55433e] text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <span>🖋️</span>
            <span>{product.materials || 'Terracotta, Natural Dyes'}</span>
          </span>
        </div>
      </div>

      {/* Badges Container */}
      <div className="space-y-2">
        <div className="bg-[#ffdcc4]/70 border border-[#ffab69]/60 rounded-2xl py-3 px-4 flex items-center gap-3">
          <span className="text-xl">✋</span>
          <span className="font-inter text-sm font-bold text-[#783d01]">
            {t.handmade}
          </span>
        </div>

        <div className="bg-[#e9f5ee] border border-emerald-200 rounded-2xl py-3 px-4 flex items-center gap-3">
          <Leaf className="w-5 h-5 text-[#2d6a4f]" />
          <span className="font-inter text-sm font-bold text-[#2d6a4f]">
            {t.ecoFriendly}
          </span>
        </div>

        <div className="bg-[#ffdbd1]/60 border border-[#94442e]/30 rounded-2xl py-3 px-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#94442e]" />
          <span className="font-inter text-sm font-bold text-[#94442e]">
            {t.verifiedArtisan}
          </span>
        </div>
      </div>

      {/* The Story Behind the Craft */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] space-y-4">
        <div className="flex items-center gap-2 text-[#94442e]">
          <Sparkles className="w-5 h-5 text-[#ffab69]" />
          <h3 className="font-literata text-base font-bold text-[#1d1b18]">
            {t.storyBehind}
          </h3>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <img
            src={product.artisanAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
            alt={product.artisanName}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#ffab69]"
          />
          <div>
            <span className="text-[11px] font-bold text-[#88705e] uppercase tracking-wider block">
              {t.craftedBy}
            </span>
            <p className="font-literata text-lg font-bold text-[#1d1b18]">
              {product.artisanName || 'Meera Devi'}
            </p>
          </div>
        </div>

        {/* Story Text */}
        <p className="font-literata text-sm text-[#55433e] leading-relaxed whitespace-pre-line">
          {product.story}
        </p>
      </div>

      {/* Bottom Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#fef8f2]/95 backdrop-blur-md border-t border-[#ebdcd3] z-40 flex items-center gap-3">
        <button
          onClick={onEdit}
          className="flex-1 min-h-[50px] bg-white border-2 border-[#dbc1ba] text-[#55433e] rounded-full font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-[#f8f3ed] active:scale-95 transition-all shadow-xs"
        >
          <Edit3 className="w-4 h-4 text-[#88705e]" />
          <span>{t.edit}</span>
        </button>

        <button
          onClick={handlePublishClick}
          disabled={isPublished}
          className="flex-[2] min-h-[50px] bg-[#94442e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-95 transition-all shadow-[0_4px_16px_rgba(148,68,46,0.25)]"
        >
          {isPublished ? (
            <>
              <Check className="w-5 h-5 text-[#ffab69]" />
              <span>Published Live!</span>
            </>
          ) : (
            <>
              <ArrowUpRight className="w-4 h-4 text-[#ffdcc4]" />
              <span>{t.publishMarketplace}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

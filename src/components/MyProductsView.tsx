import React, { useState } from 'react';
import { Plus, Eye, MessageSquare, Edit3, ExternalLink, Filter, Sparkles, CheckCircle2, Clock, FileText } from 'lucide-react';
import { ProductItem, Language } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface MyProductsViewProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onAddNewProduct: () => void;
  onEditProduct: (product: ProductItem) => void;
  lang: Language;
}

export const MyProductsView: React.FC<MyProductsViewProps> = ({
  products,
  onSelectProduct,
  onAddNewProduct,
  onEditProduct,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'published') return p.status === 'published';
    if (activeFilter === 'draft') return p.status === 'draft' || p.status === 'under_review';
    return true;
  });

  const publishedCount = products.filter((p) => p.status === 'published').length;
  const draftCount = products.filter((p) => p.status === 'draft' || p.status === 'under_review').length;

  return (
    <div className="flex-1 px-4 sm:px-5 py-4 pb-24 space-y-4 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Top Header & Add CTA */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-literata text-2xl font-bold text-[#1d1b18]">
            {t.myProductsTitle}
          </h1>
          <p className="text-xs text-[#88705e]">
            {products.length} Total Artisanal Creations
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="px-4 py-2.5 bg-[#94442e] hover:bg-[#b35c44] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Craft</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#f3ede7] p-1 rounded-2xl border border-[#dbc1ba]/60">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#94442e] text-white shadow-2xs'
              : 'text-[#55433e] hover:text-[#94442e]'
          }`}
        >
          {t.allTab} ({products.length})
        </button>
        <button
          onClick={() => setActiveFilter('published')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'published'
              ? 'bg-[#94442e] text-white shadow-2xs'
              : 'text-[#55433e] hover:text-[#94442e]'
          }`}
        >
          {t.publishedTab} ({publishedCount})
        </button>
        <button
          onClick={() => setActiveFilter('draft')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'draft'
              ? 'bg-[#94442e] text-white shadow-2xs'
              : 'text-[#55433e] hover:text-[#94442e]'
          }`}
        >
          {t.draftsTab} ({draftCount})
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-3.5 pt-1">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#ebdcd3] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f8f3ed] flex items-center justify-center text-[#8e4e14] mx-auto">
              <FileText className="w-6 h-6 text-[#94442e]" />
            </div>
            <h3 className="font-literata text-base font-bold text-[#1d1b18]">No crafts found in this section</h3>
            <p className="text-xs text-[#88705e] max-w-xs mx-auto">
              Create a new handcrafted piece using our AI Photo & Voice assistant.
            </p>
            <button
              onClick={onAddNewProduct}
              className="px-5 py-2.5 bg-[#94442e] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Now</span>
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isPub = product.status === 'published';
            const isDraft = product.status === 'draft';

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-3.5 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.05)] hover:border-[#94442e]/40 transition-all group"
              >
                <div className="flex gap-3.5">
                  {/* Thumbnail */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#f8f3ed] shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.enhancedImage || product.originalImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-1.5 left-1.5">
                      {isPub ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-bold shadow-2xs">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Live</span>
                        </span>
                      ) : isDraft ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-xs text-white text-[9px] font-bold shadow-2xs">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Draft</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-xs text-white text-[9px] font-bold shadow-2xs">
                          Review
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="font-literata text-sm sm:text-base font-bold text-[#1d1b18] hover:text-[#94442e] transition-colors line-clamp-1 cursor-pointer"
                        >
                          {product.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-[#88705e] truncate mt-0.5">
                        {product.materials || product.category}
                      </p>
                      <p className="font-literata text-base font-extrabold text-[#94442e] mt-1">
                        ₹{product.price}
                      </p>
                    </div>

                    {/* Metrics Row & Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#ebdcd3]/60 mt-1">
                      <div className="flex items-center gap-2.5 text-[11px] text-[#88705e]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-[#94442e]" />
                          <span className="font-bold text-[#1d1b18]">{product.viewsCount || 0}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#8e4e14]" />
                          <span className="font-bold text-[#1d1b18]">{product.buyerRequestsCount || 0}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 rounded-lg bg-[#f8f3ed] hover:bg-[#ebdcd3] text-[#55433e] transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#94442e]" />
                        </button>
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="px-2.5 py-1 rounded-lg bg-[#94442e] text-white text-[11px] font-bold hover:bg-[#b35c44] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>View</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

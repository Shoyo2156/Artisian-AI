import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Heart, MapPin, Sparkles, X, Check } from 'lucide-react';
import { ProductItem, Language } from '../types';
import { TRANSLATIONS } from '../data/mockData';
import { marketplaceApi } from '../services/api';

interface MarketplaceViewProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  lang: Language;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  onSelectProduct,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [cartItems, setCartItems] = useState<ProductItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [orderedSuccess, setOrderedSuccess] = useState<boolean>(false);
  const [apiProducts, setApiProducts] = useState<ProductItem[] | null>(null);

  const categories = ['All', 'Textiles', 'Pottery', 'Jewelry', 'Home Decor'];

  useEffect(() => {
    let cancelled = false;
    marketplaceApi
      .list({ search: searchQuery, category: selectedCategory })
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) setApiProducts(rows);
      })
      .catch(() => {
        if (!cancelled) setApiProducts(null);
      });
    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedCategory]);

  const sourceProducts = apiProducts ?? products;

  const filteredProducts = sourceProducts.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artisanLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartItems((prev) => [...prev, product]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="flex-1 px-4 sm:px-5 py-4 pb-24 space-y-4 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Top Marketplace Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#94442e] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-[#ffab69]" />
          </div>
          <h1 className="font-literata text-xl font-bold text-[#94442e]">
            Artisan AI Marketplace
          </h1>
        </div>

        {/* Cart Trigger */}
        <button
          onClick={() => setShowCart(true)}
          className="relative p-2.5 rounded-full bg-white border border-[#dbc1ba]/60 shadow-xs hover:border-[#94442e] text-[#55433e] cursor-pointer"
          aria-label="Shopping Cart"
        >
          <ShoppingBag className="w-5 h-5 text-[#94442e]" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#94442e] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Search Input Field */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-[#88705e] pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white border border-[#dbc1ba]/80 rounded-full py-3 pl-11 pr-4 text-xs sm:text-sm text-[#1d1b18] placeholder-[#88705e]/70 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#94442e]"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 text-[#88705e] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#94442e] text-white shadow-xs'
                  : 'bg-white text-[#55433e] border border-[#dbc1ba]/60 hover:bg-[#f8f3ed]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Cards Feed */}
      <div className="space-y-4 pt-1">
        {filteredProducts.map((item) => {
          const isFav = !!favorites[item.id];
          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="bg-white rounded-3xl p-3.5 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] cursor-pointer group hover:border-[#94442e]/40 transition-all overflow-hidden"
            >
              {/* Image Container with Badges */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#f8f3ed]">
                <img
                  src={item.enhancedImage || item.originalImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Handmade Badge */}
                <div className="absolute top-3 left-3 bg-[#ffdcc4]/90 backdrop-blur-2xs text-[#783d01] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1">
                  <span>✋</span>
                  <span>Handmade</span>
                </div>

                {/* Heart Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(item.id, e)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#94442e] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 ${isFav ? 'fill-[#94442e] text-[#94442e]' : 'text-[#94442e]'}`}
                  />
                </button>
              </div>

              {/* Product Metadata */}
              <div className="p-3 pt-3.5 space-y-1">
                <h3 className="font-literata text-lg font-bold text-[#1d1b18] group-hover:text-[#94442e] transition-colors leading-tight">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-[#88705e]">
                  <MapPin className="w-3.5 h-3.5 text-[#94442e]" />
                  <span>By {item.artisanName}, {item.artisanLocation}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#ebdcd3]/60 mt-2">
                  <span className="font-literata text-xl font-bold text-[#94442e]">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>

                  {/* Add to Cart icon button */}
                  <button
                    onClick={(e) => addToCart(item, e)}
                    className="w-10 h-10 rounded-full bg-[#94442e] hover:bg-[#b35c44] text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer / Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#fef8f2] rounded-t-[32px] sm:rounded-[32px] p-6 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-4 border-b border-[#ebdcd3]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#94442e]" />
                <h3 className="font-literata text-lg font-bold text-[#1d1b18]">
                  Artisan Basket ({cartItems.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCart(false);
                  setOrderedSuccess(false);
                }}
                className="w-8 h-8 rounded-full bg-white text-[#55433e] flex items-center justify-center shadow-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderedSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-literata text-xl font-bold text-[#1d1b18]">
                  Order Placed Directly with Artisan!
                </h4>
                <p className="text-xs text-[#55433e] max-w-xs mx-auto">
                  Funds held in escrow until authentic verification & dispatch.
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-12 text-center text-[#88705e] space-y-2">
                <p className="text-sm">Your basket is empty.</p>
                <p className="text-xs">Support rural heritage by adding authentic craft pieces!</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-2xl border border-[#ebdcd3] flex items-center gap-3"
                    >
                      <img
                        src={item.enhancedImage || item.originalImage}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-literata text-sm font-bold text-[#1d1b18] truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#88705e]">By {item.artisanName}</p>
                        <p className="font-literata text-sm font-bold text-[#94442e]">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#ebdcd3] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#55433e]">Direct Artisan Payout</span>
                    <span className="font-literata text-xl font-bold text-[#94442e]">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => setOrderedSuccess(true)}
                    className="w-full min-h-[52px] bg-[#94442e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b35c44] shadow-md transition-all cursor-pointer"
                  >
                    <span>Proceed to Direct Checkout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

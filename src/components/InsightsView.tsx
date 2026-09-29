import React, { useState } from 'react';
import { Bell, TrendingUp, Star, MessageSquare, Check, X, ArrowUpRight, Sparkles, BarChart2 } from 'lucide-react';
import { OrderRequest, WeeklyViewStat, Language } from '../types';
import { TRANSLATIONS, WEEKLY_STATS } from '../data/mockData';

interface InsightsViewProps {
  orders: OrderRequest[];
  onOpenOrderChat: (order: OrderRequest) => void;
  onUpdateOrderStatus: (orderId: string, status: 'accepted' | 'declined') => void;
  lang: Language;
  analytics?: {
    monthly_trend?: WeeklyViewStat[];
    best_product?: { title?: string; price?: number; image?: string; items_sold?: number; growth_percent?: number };
    demand_change_percent?: number;
    category_performance?: Array<{ category: string; score: number }>;
    estimated_revenue?: number;
    total_views?: number;
  } | null;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  orders,
  onOpenOrderChat,
  onUpdateOrderStatus,
  lang,
  analytics,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeDayHover, setActiveDayHover] = useState<WeeklyViewStat | null>(null);
  const weeklyStats = analytics?.monthly_trend?.length ? analytics.monthly_trend : WEEKLY_STATS;
  const maxViews = Math.max(...weeklyStats.map((s) => s.views), 1);
  const best = analytics?.best_product;
  const demand = analytics?.demand_change_percent ?? 18;
  const categoryPills = analytics?.category_performance?.length
    ? analytics.category_performance.slice(0, 4).map((c) => ({ cat: c.category, val: `${c.score}%` }))
    : [
        { cat: 'Diyas', val: '98%' },
        { cat: 'Pashmina', val: '86%' },
        { cat: 'Silk Zari', val: '92%' },
        { cat: 'Dhokra', val: '74%' },
      ];

  return (
    <div className="flex-1 px-4 sm:px-5 py-4 pb-24 space-y-6 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Active Requests Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Bell className="w-5 h-5 text-[#94442e]" />
          <h2 className="font-literata text-xl font-bold text-[#1d1b18]">
            {t.activeRequests}
          </h2>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] space-y-4 transition-all"
          >
            {/* Top order summary */}
            <div className="flex items-start gap-3.5">
              <img
                src={order.productImage}
                alt={order.title}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-[#ebdcd3]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-[#94442e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    NEW ORDER
                  </span>
                  {order.buyerCompany && (
                    <span className="text-xs font-bold text-[#8e4e14]">
                      {order.buyerCompany}
                    </span>
                  )}
                </div>
                <h3 className="font-literata text-sm sm:text-base font-bold text-[#1d1b18] leading-tight">
                  {order.title}
                </h3>
                <p className="text-xs text-[#88705e] mt-1">
                  Expected delivery: {order.expectedDelivery}
                </p>
              </div>
            </div>

            {/* Action Buttons: Chat, Decline, Accept */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => onOpenOrderChat(order)}
                className="py-2.5 px-3 rounded-full border border-[#dbc1ba] bg-white text-[#55433e] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#f8f3ed] active:scale-95 transition-all shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#88705e]" />
                <span>{t.chat}</span>
              </button>

              <button
                onClick={() => onUpdateOrderStatus(order.id, 'declined')}
                disabled={order.status === 'declined'}
                className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  order.status === 'declined'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-[#f3ede7] text-[#55433e] hover:bg-[#ebdcd3] active:scale-95'
                }`}
              >
                <span>{order.status === 'declined' ? 'Declined' : t.decline}</span>
              </button>

              <button
                onClick={() => onUpdateOrderStatus(order.id, 'accepted')}
                disabled={order.status === 'accepted'}
                className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center transition-all shadow-xs ${
                  order.status === 'accepted'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#94442e] text-white hover:bg-[#b35c44] active:scale-95'
                }`}
              >
                <span>{order.status === 'accepted' ? 'Accepted ✓' : t.accept}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Artisan AI Performance Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp className="w-5 h-5 text-[#94442e]" />
          <h2 className="font-literata text-xl font-bold text-[#1d1b18]">
            {t.performance}
          </h2>
        </div>

        {/* Product Views This Week Bar Chart Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] space-y-4">
          <div>
            <h3 className="font-literata text-base font-bold text-[#1d1b18]">
              {t.productViews}
            </h3>
            <p className="text-xs text-[#88705e]">{t.howManyPeople}</p>
          </div>

          {/* Interactive Bar Visualizer */}
          <div className="pt-4 pb-2">
            <div className="flex items-end justify-between h-36 gap-2 px-2">
              {weeklyStats.map((stat) => {
                const heightPct = Math.round((stat.views / maxViews) * 100);
                const isHovered = activeDayHover?.day === stat.day;
                return (
                  <div
                    key={stat.day}
                    onMouseEnter={() => setActiveDayHover(stat)}
                    onMouseLeave={() => setActiveDayHover(null)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="relative w-full flex items-end justify-center h-28">
                      {isHovered && (
                        <div className="absolute -top-7 bg-[#94442e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 animate-in fade-in">
                          {stat.views} views
                        </div>
                      )}
                      <div
                        className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                          stat.day === 'Sat' || stat.day === 'Sun'
                            ? 'bg-[#94442e]'
                            : 'bg-[#ffdcc4] group-hover:bg-[#ffab69]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-bold text-[#88705e]">{stat.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Performer Card */}
        <div className="bg-white rounded-3xl p-3.5 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#88705e] px-2 pt-1">
            <Star className="w-4 h-4 text-[#ffab69] fill-[#ffab69]" />
            <span className="font-literata text-sm font-bold text-[#1d1b18]">{t.topPerformer}</span>
          </div>

          <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#f8f3ed]">
            <img
              src={best?.image || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'}
              alt={best?.title || 'Indigo Handwoven Scarf'}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#ffab69] text-[#783d01] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs">
              🔥 Best Seller
            </div>
          </div>

          <div className="px-2 pb-2">
            <h4 className="font-literata text-base font-bold text-[#1d1b18]">
              {best?.title || 'Indigo Handwoven Scarf'}
            </h4>
            <p className="text-xs text-[#88705e] mb-2">{best?.items_sold ?? 24} {t.itemsSold}</p>
            <div className="flex items-center justify-between border-t border-[#ebdcd3]/70 pt-2">
              <span className="font-literata text-lg font-bold text-[#94442e]">
                ₹{(best?.price ?? 1250).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Buyer Requests Trend Card */}
        <div className="bg-[#fcf4ec] rounded-3xl p-5 border border-[#ffdbd1] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-literata text-base font-bold text-[#1d1b18]">
                {t.buyerDemandTrend}
              </h3>
              <p className="text-xs text-[#88705e]">{t.aiPredictedDemand}</p>
            </div>
            <div className="text-right">
              <span className="font-literata text-xl font-bold text-[#94442e] block">
                +{demand}%
              </span>
              <span className="text-[10px] font-bold tracking-wider text-[#8e4e14] uppercase">
                {t.highDemand}
              </span>
            </div>
          </div>

          {/* Forecast Pills */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {categoryPills.map((f) => (
              <div key={f.cat} className="bg-white/90 p-2 rounded-xl text-center border border-[#dbc1ba]/50">
                <span className="text-[10px] text-[#88705e] block truncate">{f.cat}</span>
                <span className="text-xs font-bold text-[#94442e]">{f.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

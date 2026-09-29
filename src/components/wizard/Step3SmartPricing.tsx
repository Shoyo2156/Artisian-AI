import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Calculator, Sparkles, Edit2, ChevronDown, ChevronUp, CheckCircle2, Info } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockData';
import { pricingApi } from '../../services/api';

interface Step3SmartPricingProps {
  onContinue: (pricingData: {
    material: number;
    labor: number;
    other: number;
    totalBase: number;
    finalPrice: number;
  }) => void;
  onBack: () => void;
  lang: Language;
}

export const Step3SmartPricing: React.FC<Step3SmartPricingProps> = ({
  onContinue,
  onBack,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Base cost states matching screenshot ₹350, ₹250, ₹50 -> ₹650
  const [materialCost, setMaterialCost] = useState<number>(350);
  const [laborCost, setLaborCost] = useState<number>(250);
  const [otherCost, setOtherCost] = useState<number>(50);

  const totalBaseCost = useMemo(() => {
    return (Number(materialCost) || 0) + (Number(laborCost) || 0) + (Number(otherCost) || 0);
  }, [materialCost, laborCost, otherCost]);

  const [userPrice, setUserPrice] = useState<number>(899);
  const [isEditingPrice, setIsEditingPrice] = useState<boolean>(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(true);
  const [apiMin, setApiMin] = useState<number | null>(null);
  const [apiMax, setApiMax] = useState<number | null>(null);
  const [apiExplanation, setApiExplanation] = useState<string | null>(null);

  const minFair = apiMin ?? Math.round(totalBaseCost * 1.15);
  const maxFair = apiMax ?? Math.round(totalBaseCost * 1.62);

  useEffect(() => {
    let cancelled = false;
    pricingApi
      .recommend(materialCost, laborCost, otherCost)
      .then((res) => {
        if (cancelled || !res) return;
        setApiMin(res.min_price);
        setApiMax(res.max_price);
        setApiExplanation(res.explanation);
        if (typeof res.recommended_price === 'number') {
          setUserPrice(res.recommended_price);
        }
      })
      .catch(() => {
        /* keep local demo formula */
      });
    return () => {
      cancelled = true;
    };
  }, [materialCost, laborCost, otherCost]);

  // Recalculate recommendation when base costs change
  const handleCostChange = (type: 'mat' | 'lab' | 'oth', val: number) => {
    let newMat = materialCost;
    let newLab = laborCost;
    let newOth = otherCost;

    if (type === 'mat') {
      newMat = val;
      setMaterialCost(val);
    } else if (type === 'lab') {
      newLab = val;
      setLaborCost(val);
    } else {
      newOth = val;
      setOtherCost(val);
    }

    const newTotal = newMat + newLab + newOth;
    // Suggest 38% markup ending in 99
    const suggested = Math.round((newTotal * 1.38) / 100) * 100 - 1;
    setUserPrice(Math.max(suggested, newTotal + 50));
  };

  const marginPercentage = useMemo(() => {
    if (totalBaseCost <= 0) return 0;
    return Math.round(((userPrice - totalBaseCost) / totalBaseCost) * 100);
  }, [userPrice, totalBaseCost]);

  return (
    <div className="flex-1 flex flex-col justify-between px-5 py-4 pb-8 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Header Info */}
      <div className="text-center pt-1 pb-3">
        <p className="text-[11px] font-bold tracking-widest text-[#8e4e14] uppercase mb-1">
          {t.step4Of4}
        </p>
        <h1 className="font-literata text-2xl sm:text-3xl font-bold text-[#1d1b18] mb-1">
          {t.smartPricing}
        </h1>
        <p className="text-xs sm:text-sm text-[#55433e] max-w-xs mx-auto">
          {t.smartPricingSub}
        </p>
      </div>

      <div className="space-y-4 my-2">
        {/* Cost Breakdown Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-[0_4px_16px_rgba(74,55,40,0.06)] space-y-3.5">
          <div className="flex items-center gap-2 text-[#55433e] pb-1 border-b border-[#ebdcd3]/70">
            <Calculator className="w-4 h-4 text-[#94442e]" />
            <h3 className="font-literata text-base font-bold text-[#1d1b18]">
              {t.costBreakdown}
            </h3>
          </div>

          {/* Material Cost */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-[#88705e] uppercase">
              {t.materialCost}
            </label>
            <div className="flex items-center bg-[#f8f3ed] border border-[#dbc1ba] rounded-xl px-3 py-2.5">
              <span className="text-sm font-bold text-[#55433e] mr-2">₹</span>
              <input
                type="number"
                value={materialCost}
                onChange={(e) => handleCostChange('mat', Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-[#1d1b18] focus:outline-none"
              />
            </div>
          </div>

          {/* Time & Labor */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-[#88705e] uppercase">
              {t.yourLabor}
            </label>
            <div className="flex items-center bg-[#f8f3ed] border border-[#dbc1ba] rounded-xl px-3 py-2.5">
              <span className="text-sm font-bold text-[#55433e] mr-2">₹</span>
              <input
                type="number"
                value={laborCost}
                onChange={(e) => handleCostChange('lab', Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-[#1d1b18] focus:outline-none"
              />
            </div>
          </div>

          {/* Packaging / Transport */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-[#88705e] uppercase">
              {t.otherCost}
            </label>
            <div className="flex items-center bg-[#f8f3ed] border border-[#dbc1ba] rounded-xl px-3 py-2.5">
              <span className="text-sm font-bold text-[#55433e] mr-2">₹</span>
              <input
                type="number"
                value={otherCost}
                onChange={(e) => handleCostChange('oth', Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-[#1d1b18] focus:outline-none"
              />
            </div>
          </div>

          {/* Total Base Cost */}
          <div className="pt-2 border-t border-[#ebdcd3] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#55433e]">{t.totalBaseCost}</span>
            <span className="font-literata text-xl font-bold text-[#1d1b18]">
              ₹{totalBaseCost}
            </span>
          </div>
        </div>

        {/* Artisan AI Recommendation Card */}
        <div className="bg-[#fcf4ec] rounded-3xl p-5 border border-[#ffdbd1] shadow-xs space-y-4">
          {/* Tag & header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#94442e] text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 text-[#ffdcc4]" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#94442e] uppercase">
                {t.fairProfitBadge}
              </p>
              <h4 className="font-literata text-sm font-bold text-[#1d1b18]">
                {t.aiRecommendation}
              </h4>
            </div>
          </div>

          {/* Big Price Display with Edit button */}
          <div className="text-center py-1">
            <span className="text-xs text-[#88705e] font-medium block mb-0.5">
              {t.recommendedPrice}
            </span>
            <div className="inline-flex items-center justify-center gap-2">
              {isEditingPrice ? (
                <div className="flex items-center justify-center bg-white px-4 py-1.5 rounded-full border border-[#94442e]">
                  <span className="font-literata text-2xl font-bold text-[#94442e] mr-1">₹</span>
                  <input
                    type="number"
                    value={userPrice}
                    onChange={(e) => setUserPrice(Number(e.target.value))}
                    onBlur={() => setIsEditingPrice(false)}
                    autoFocus
                    className="w-24 font-literata text-2xl font-bold text-[#94442e] focus:outline-none text-center"
                  />
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingPrice(true)}
                  className="cursor-pointer group flex items-center gap-2 hover:opacity-90"
                >
                  <span className="font-literata text-4xl font-extrabold text-[#94442e] tracking-tight">
                    ₹{userPrice}
                  </span>
                  <button className="p-1.5 rounded-full text-[#88705e] group-hover:text-[#94442e] group-hover:bg-white/80 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Fair Range Slider */}
          <div className="space-y-1.5 px-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#55433e]">
              <span>{t.fairRange}: ₹{minFair}</span>
              <span>₹{maxFair}</span>
            </div>

            <div className="relative pt-1 pb-2">
              <input
                type="range"
                min={minFair - 100}
                max={maxFair + 200}
                value={userPrice}
                onChange={(e) => setUserPrice(Number(e.target.value))}
                className="w-full h-2.5 bg-gradient-to-r from-[#ffdcc4] via-[#ffab69] to-[#94442e] rounded-lg appearance-none cursor-pointer accent-[#94442e]"
              />
              <div className="flex justify-center mt-1">
                <span className="text-[10px] font-bold tracking-wider text-[#94442e] uppercase bg-white/90 px-2.5 py-0.5 rounded-full border border-[#dbc1ba]/60 shadow-2xs">
                  {t.yourPrice}: ₹{userPrice} ({marginPercentage}% profit)
                </span>
              </div>
            </div>
          </div>

          {/* "Why this price?" Accordion */}
          <div className="bg-white rounded-2xl p-4 border border-[#ebdcd3] shadow-xs">
            <button
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full flex items-center justify-between text-left font-bold text-xs text-[#1d1b18]"
            >
              <div className="flex items-center gap-1.5 text-[#55433e]">
                <Info className="w-4 h-4 text-[#94442e]" />
                <span className="font-literata font-bold text-sm text-[#1d1b18]">{t.whyThisPrice}</span>
              </div>
              {isAccordionOpen ? (
                <ChevronUp className="w-4 h-4 text-[#88705e]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#88705e]" />
              )}
            </button>

            {isAccordionOpen && (
              <div className="mt-3 space-y-2.5 text-xs text-[#55433e] pt-2 border-t border-[#ebdcd3]/60 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#94442e] shrink-0 mt-0.5" />
                  <p className="leading-snug">{t.marketComparison}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#94442e] shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Fair Margin: Includes a {marginPercentage}% markup on your base costs (₹{totalBaseCost}), ensuring sustainable profit.
                    {apiExplanation ? ` ${apiExplanation}` : ''}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#94442e] shrink-0 mt-0.5" />
                  <p className="leading-snug">{t.buyerPsychology}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Listing Button */}
      <div className="pt-2">
        <button
          onClick={() =>
            onContinue({
              material: materialCost,
              labor: laborCost,
              other: otherCost,
              totalBase: totalBaseCost,
              finalPrice: userPrice,
            })
          }
          className="w-full min-h-[54px] bg-[#94442e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-95 transition-all shadow-[0_4px_16px_rgba(148,68,46,0.22)]"
        >
          <span>{t.reviewListing}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

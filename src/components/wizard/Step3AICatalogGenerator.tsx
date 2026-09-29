import React, { useState } from 'react';
import { Sparkles, Edit3, Check, RefreshCw, ArrowRight, ArrowLeft, Tag, Layers, FileText, Globe } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockData';
import { aiApi } from '../../services/api';

export interface CatalogMetadata {
  title: string;
  hindiTitle: string;
  story: string;
  hindiStory: string;
  category: string;
  materials: string;
  craftTechnique: string;
  craftOrigin: string;
  tags: string[];
}

interface Step3AICatalogGeneratorProps {
  initialMetadata?: Partial<CatalogMetadata>;
  enhancedImage?: string;
  onContinue: (metadata: CatalogMetadata) => void;
  onBack: () => void;
  lang: Language;
}

export const Step3AICatalogGenerator: React.FC<Step3AICatalogGeneratorProps> = ({
  initialMetadata,
  enhancedImage,
  onContinue,
  onBack,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'hi'>('en');
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Catalog State
  const [titleEn, setTitleEn] = useState(
    initialMetadata?.title || 'Terracotta Hand-Painted Heritage Vase'
  );
  const [titleHi, setTitleHi] = useState(
    initialMetadata?.hindiTitle || 'हस्तनिर्मित मिट्टी का चित्रित फूलदान'
  );
  const [storyEn, setStoryEn] = useState(
    initialMetadata?.story ||
      "In the heart of rural Gujarat, the rhythmic turning of the potter's wheel has been preserved across generations. This terracotta vase is shaped by hand using alluvial river silt, sun-dried for 48 hours, and decorated with freehand tribal motifs painted using fine bamboo brushes and rice paste."
  );
  const [storyHi, setStoryHi] = useState(
    initialMetadata?.hindiStory ||
      'गुजरात के ग्रामीण अंचल में, कुम्हार के चाक की निरंतर गति तीन पीढ़ियों से हमारे परिवार की धड़कन रही है। यह मटका प्राकृतिक नदी की मिट्टी से बना है और इसे धूप में पकाकर प्राकृतिक रंगों से सजाया गया है।'
  );
  const [category, setCategory] = useState(initialMetadata?.category || 'Pottery');
  const [materials, setMaterials] = useState(
    initialMetadata?.materials || 'Natural River Clay, Organic Rice Paste White Pigments'
  );
  const [craftTechnique, setCraftTechnique] = useState(
    initialMetadata?.craftTechnique || 'Wheel Throwing & Sun Curing'
  );
  const [craftOrigin, setCraftOrigin] = useState(
    initialMetadata?.craftOrigin || 'Kutch Heritage, Gujarat'
  );
  const [tags, setTags] = useState<string[]>(
    initialMetadata?.tags || ['Home Decor', 'Terracotta', 'Natural Dyes', 'Heritage Clay', 'Handmade']
  );

  // Regeneration variations
  const variations = [
    {
      titleEn: 'Kutch Artisanal Terracotta Painted Vase',
      titleHi: 'कच्छ हस्तनिर्मित मिट्टी का मांडणा फूलदान',
      storyEn:
        'Individually thrown on a traditional foot-spun potter wheel, this vessel honors time-tested artisan methods. The organic clay breathes naturally, decorated with auspicious tribal motifs using mineral clay pigments.',
      storyHi:
        'पारंपरिक पैर से चलने वाले चाक पर निर्मित यह फूलदान प्राचीन शिल्प परंपरा को सहेजता है। प्राकृतिक मिट्टी और खनिज रंगों का उपयोग कर इसे तैयार किया गया है।',
      category: 'Pottery',
      materials: 'Alluvial Terracotta Clay & Mineral White Pigments',
      craftTechnique: 'Foot-Spun Wheel & Wood Kiln Curing',
      craftOrigin: 'Bhuj, Kutch',
      tags: ['Pottery', 'Eco-friendly', 'Mandana Art', 'Handmade', 'Terracotta'],
    },
    {
      titleEn: 'Terracotta Hand-Painted Heritage Vase',
      titleHi: 'हस्तनिर्मित मिट्टी का चित्रित फूलदान',
      storyEn:
        "In the heart of rural Gujarat, the rhythmic turning of the potter's wheel has been preserved across generations. This terracotta vase is shaped by hand using alluvial river silt, sun-dried for 48 hours, and decorated with freehand tribal motifs painted using fine bamboo brushes and rice paste.",
      storyHi:
        'गुजरात के ग्रामीण अंचल में, कुम्हार के चाक की निरंतर गति तीन पीढ़ियों से हमारे परिवार की धड़कन रही है। यह मटका प्राकृतिक नदी की मिट्टी से बना है और इसे धूप में पकाकर प्राकृतिक रंगों से सजाया गया है।',
      category: 'Pottery',
      materials: 'Natural River Clay, Organic Rice Paste White Pigments',
      craftTechnique: 'Wheel Throwing & Sun Curing',
      craftOrigin: 'Kutch Heritage, Gujarat',
      tags: ['Home Decor', 'Terracotta', 'Natural Dyes', 'Heritage Clay', 'Handmade'],
    },
    {
      titleEn: 'Authentic Terracotta Earth Vase with Tribal Art',
      titleHi: 'पारंपरिक जनजातीय मांडणा मिट्टी का फूलदान',
      storyEn:
        'Formed with reverence for the earth, this artisan vase brings rustic warmth and Indian craft mastery to contemporary living spaces. Completely non-toxic, sustainable, and handmade.',
      storyHi:
        'धरती के प्रति कृतज्ञता से बना यह शिल्प आपके घर को पारंपरिक भारतीय कला की शोभा प्रदान करता है। पूर्णतः विषमुक्त और पर्यावरण-अनुकूल।',
      category: 'Pottery',
      materials: 'Kutch River Clay & Natural Earth Dyes',
      craftTechnique: 'Hand Throwing & Natural Sun Baking',
      craftOrigin: 'Kutch Craft Cluster',
      tags: ['Vase', 'Tribal Art', 'Sustainable', 'Artisan Made', 'Vessel'],
    },
  ];

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const next = await aiApi.catalog({ title: titleEn, category, transcript: storyEn });
      setTitleEn(next.title || titleEn);
      setTitleHi(next.hindiTitle || titleHi);
      setStoryEn(next.story || storyEn);
      setStoryHi(next.hindiStory || storyHi);
      setCategory(next.category || category);
      setMaterials(next.materials || materials);
      setCraftTechnique(next.craftTechnique || craftTechnique);
      setCraftOrigin(next.craftOrigin || craftOrigin);
      setTags(next.tags || tags);
    } catch {
      const next = variations[Math.floor(Math.random() * variations.length)];
      setTitleEn(next.titleEn);
      setTitleHi(next.titleHi);
      setStoryEn(next.storyEn);
      setStoryHi(next.storyHi);
      setCategory(next.category);
      setMaterials(next.materials);
      setCraftTechnique(next.craftTechnique);
      setCraftOrigin(next.craftOrigin);
      setTags(next.tags);
    }
    setIsRegenerating(false);
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAccept = () => {
    onContinue({
      title: titleEn,
      hindiTitle: titleHi,
      story: storyEn,
      hindiStory: storyHi,
      category,
      materials,
      craftTechnique,
      craftOrigin,
      tags,
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 sm:px-5 py-4 pb-24 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Header */}
      <div className="text-center pt-1 pb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbd1] text-[#94442e] text-[11px] font-bold tracking-widest uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#ffab69]" />
          <span>{t.step3Of4}</span>
        </div>
        <h1 className="font-literata text-2xl sm:text-3xl font-bold text-[#94442e] mb-1">
          {t.catalogTitle}
        </h1>
        <p className="text-xs text-[#55433e] leading-relaxed max-w-xs mx-auto">
          {t.catalogSub}
        </p>
      </div>

      {/* Main Catalog Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebdcd3] shadow-[0_8px_24px_rgba(74,55,40,0.06)] space-y-4 mb-4 relative">
        {/* Top bar with AI badge & Language Switcher */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#ebdcd3]/70">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdbd1]/60 text-[#94442e] text-[11px] font-bold">
            <Sparkles className={`w-3.5 h-3.5 text-[#8e4e14] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{t.aiGeneratedBadge}</span>
          </div>

          <div className="flex items-center bg-[#f8f3ed] p-1 rounded-full border border-[#dbc1ba]/60">
            <button
              onClick={() => setActiveLangTab('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'en'
                  ? 'bg-[#94442e] text-white shadow-2xs'
                  : 'text-[#55433e] hover:text-[#94442e]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLangTab('hi')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'hi'
                  ? 'bg-[#94442e] text-white shadow-2xs'
                  : 'text-[#55433e] hover:text-[#94442e]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Product Image Thumbnail Preview & Category */}
        {enhancedImage && (
          <div className="flex items-center gap-3 p-2 bg-[#f8f3ed] rounded-2xl border border-[#ebdcd3]">
            <img
              src={enhancedImage}
              alt="Enhanced Product"
              className="w-14 h-14 rounded-xl object-cover border border-[#dbc1ba]/60 shadow-2xs"
            />
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e4e14]">
                Detected Technique
              </span>
              <p className="text-xs font-bold text-[#1d1b18]">{craftTechnique}</p>
              <p className="text-[11px] text-[#88705e]">{craftOrigin}</p>
            </div>
          </div>
        )}

        {/* Field 1: Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#88705e] tracking-wider uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#94442e]" />
              <span>{t.productTitleLabel}</span>
            </label>
            <span className="text-[10px] text-[#8e4e14] font-semibold">
              {activeLangTab === 'en' ? 'English' : 'हिन्दी'}
            </span>
          </div>

          {isEditing ? (
            activeLangTab === 'en' ? (
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#94442e] bg-[#fffbf8] text-[#1d1b18] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#94442e]/30"
              />
            ) : (
              <input
                type="text"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#94442e] bg-[#fffbf8] text-[#1d1b18] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#94442e]/30 font-hindi-body"
              />
            )
          ) : (
            <div className="p-3 bg-[#fef8f2] rounded-xl border border-[#ebdcd3] font-literata text-base font-bold text-[#1d1b18]">
              {activeLangTab === 'en' ? titleEn : titleHi}
            </div>
          )}
        </div>

        {/* Field 2: Description / Story */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#88705e] tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#94442e]" />
              <span>{t.productStoryLabel}</span>
            </label>
          </div>

          {isEditing ? (
            activeLangTab === 'en' ? (
              <textarea
                rows={4}
                value={storyEn}
                onChange={(e) => setStoryEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#94442e] bg-[#fffbf8] text-[#1d1b18] text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#94442e]/30"
              />
            ) : (
              <textarea
                rows={4}
                value={storyHi}
                onChange={(e) => setStoryHi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#94442e] bg-[#fffbf8] text-[#1d1b18] text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#94442e]/30 font-hindi-body"
              />
            )
          ) : (
            <div className="p-3 bg-[#fef8f2] rounded-xl border border-[#ebdcd3] text-xs text-[#55433e] leading-relaxed">
              {activeLangTab === 'en' ? storyEn : storyHi}
            </div>
          )}
        </div>

        {/* Field 3: Category & Materials */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#88705e] tracking-wider uppercase flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#94442e]" />
              <span>{t.categoryLabel}</span>
            </label>
            {isEditing ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-[#94442e] bg-[#fffbf8] text-xs font-semibold text-[#1d1b18] focus:outline-none"
              >
                <option value="Pottery">Pottery (मिट्टी)</option>
                <option value="Textiles">Textiles (वस्त्र)</option>
                <option value="Jewelry">Jewelry (आभूषण)</option>
                <option value="Woodcraft">Woodcraft (काष्ठ)</option>
                <option value="Metalcraft">Metalcraft (धातु)</option>
              </select>
            ) : (
              <div className="p-2 bg-[#f8f3ed] rounded-xl border border-[#ebdcd3] text-xs font-bold text-[#1d1b18]">
                {category}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#88705e] tracking-wider uppercase flex items-center gap-1">
              <span>🌾</span>
              <span>{t.materialLabel}</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-[#94442e] bg-[#fffbf8] text-xs font-medium text-[#1d1b18] focus:outline-none"
              />
            ) : (
              <div className="p-2 bg-[#f8f3ed] rounded-xl border border-[#ebdcd3] text-xs text-[#55433e] truncate">
                {materials}
              </div>
            )}
          </div>
        </div>

        {/* Field 4: Tags */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#88705e] tracking-wider uppercase flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#94442e]" />
            <span>{t.tagsLabel}</span>
          </label>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tg) => (
              <span
                key={tg}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ffdcc4] text-[#783d01] text-[11px] font-bold shadow-2xs"
              >
                <span>#{tg}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveTag(tg)}
                    className="hover:text-red-700 ml-0.5 cursor-pointer text-xs"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add tag (e.g., Terracotta)"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#dbc1ba] bg-white"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[#94442e] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#b35c44]"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Action Controls Inside Card: Edit / Regenerate */}
        <div className="flex items-center justify-between pt-2 border-t border-[#ebdcd3]/70">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isEditing
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[#f8f3ed] text-[#55433e] hover:bg-[#ebdcd3]'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-[#94442e]" />
                <span>{t.edit}</span>
              </>
            )}
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-3.5 py-2 rounded-full bg-[#ffdbd1] text-[#94442e] hover:bg-[#ffcdbe] text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#94442e] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : t.regenerate}</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={onBack}
          className="flex-1 min-h-[52px] bg-transparent border-2 border-[#dbc1ba] text-[#55433e] rounded-full font-bold text-sm hover:bg-white active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <button
          onClick={handleAccept}
          className="flex-[2] min-h-[52px] bg-[#94442e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-95 transition-all shadow-[0_4px_16px_rgba(148,68,46,0.22)] cursor-pointer"
        >
          <span>{t.acceptAndContinue}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

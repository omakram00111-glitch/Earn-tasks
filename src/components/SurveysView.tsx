import React, { useState } from 'react';
import { Survey } from '../types';
import { 
  ClipboardCheck, 
  Clock, 
  Star, 
  ArrowRight, 
  Search, 
  Filter, 
  CheckCircle2, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface SurveysViewProps {
  surveys: Survey[];
  onOpenSurvey: (survey: Survey) => void;
  currencyMode: 'usd' | 'points';
}

export const SurveysView: React.FC<SurveysViewProps> = ({
  surveys,
  onOpenSurvey,
  currencyMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | 'quick' | 'standard'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'all',
    'Tech & AI',
    'Food & Beverage',
    'Consumer Goods',
    'Automotive',
    'Finance',
  ];

  const filteredSurveys = surveys.filter((srv) => {
    if (selectedCategory !== 'all' && srv.category !== selectedCategory) {
      return false;
    }
    if (durationFilter === 'quick' && srv.durationMin > 8) {
      return false;
    }
    if (durationFilter === 'standard' && srv.durationMin <= 8) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        srv.title.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatReward = (usd: number) => {
    return currencyMode === 'usd' ? `$${usd.toFixed(2)}` : `${Math.round(usd * 100).toLocaleString()} pts`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-emerald-400" />
            <span>High-Yield Paid Surveys</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Matched directly to your demographic profile. Instant crediting upon completion.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search surveys or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Categories (Functional segmented button tab bar) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { sound.playClick(); setSelectedCategory(cat); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Surveys' : cat}
            </button>
          ))}
        </div>

        {/* Duration filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 text-[11px]">Duration:</span>
          <button
            onClick={() => setDurationFilter('all')}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              durationFilter === 'all'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDurationFilter('quick')}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              durationFilter === 'quick'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            &lt; 8 min (Quick)
          </button>
          <button
            onClick={() => setDurationFilter('standard')}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              durationFilter === 'standard'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            8+ min (High Payout)
          </button>
        </div>
      </div>

      {/* Survey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurveys.map((survey) => (
          <div
            key={survey.id}
            className={`rounded-xl border transition-all p-5 flex flex-col justify-between ${
              survey.completed
                ? 'border-slate-800/60 bg-slate-900/40 opacity-75'
                : 'border-slate-800 bg-slate-900 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/20'
            }`}
          >
            <div className="space-y-3">
              {/* Unboxed metadata line with typographic separators (anti-slop rule) */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-emerald-400 font-semibold">{survey.provider}</span>
                  <span aria-hidden="true">·</span>
                  <span>{survey.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-0.5 text-amber-400 font-mono">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {survey.rating}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-emerald-400/90 font-medium">
                  {survey.matchScore}% Match
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-white leading-snug">
                {survey.title}
              </h2>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {survey.description}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-mono tabular-nums">{survey.durationMin} mins</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] text-slate-500">{survey.questions.length} questions</span>
                </div>
                <div className="text-lg font-extrabold font-mono text-emerald-400 tabular-nums">
                  +{formatReward(survey.rewardUsd)}
                </div>
              </div>

              {survey.completed ? (
                <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800/80 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Claimed</span>
                </div>
              ) : (
                <button
                  onClick={() => { sound.playClick(); onOpenSurvey(survey); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  <span>Start Survey</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="py-16 text-center rounded-xl border border-slate-800 bg-slate-900/40 p-8 space-y-3">
          <ClipboardCheck className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching surveys found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing a different category or clearing search filters to see all available market surveys.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setDurationFilter('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

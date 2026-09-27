import React, { useState } from 'react';
import { PremiseTask } from '../types';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  ArrowRight, 
  Camera, 
  Compass, 
  Layers, 
  Flame, 
  CheckCircle2, 
  Map as MapIcon, 
  List 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PremiseTasksViewProps {
  tasks: PremiseTask[];
  onOpenTask: (task: PremiseTask) => void;
  currencyMode: 'usd' | 'points';
}

export const PremiseTasksView: React.FC<PremiseTasksViewProps> = ({
  tasks,
  onOpenTask,
  currencyMode,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [distanceFilter, setDistanceFilter] = useState<number>(5); // miles
  const [activePinId, setActivePinId] = useState<string | null>(tasks[0]?.id || null);

  const categories = [
    'all',
    'Retail Shelf Audit',
    'Pharmacy & Health',
    'Infrastructure',
    'Price Check',
    'Billboard & Ads',
  ];

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (t.distanceMiles > distanceFilter) return false;
    return true;
  });

  const activeTask = tasks.find((t) => t.id === activePinId) || filteredTasks[0] || tasks[0];

  const formatReward = (usd: number) => {
    return currencyMode === 'usd' ? `$${usd.toFixed(2)}` : `${Math.round(usd * 100).toLocaleString()} pts`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Compass className="h-4 w-4" />
            <span>PREMISE LOCAL MARKET INTELLIGENCE</span>
            <span aria-hidden="true">·</span>
            <span>REAL-TIME FIELD NETWORK</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Neighborhood Micro-Tasks & Retail Audits
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Earn cash by photographing store shelves, checking retail prices, and verifying municipal infrastructure.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => { sound.playClick(); setViewMode('map'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'map' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Radar Map</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setViewMode('list'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { sound.playClick(); setSelectedCategory(cat); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === cat ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Missions' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">Radius:</span>
          {[0.5, 1.0, 3.0, 5.0].map((dist) => (
            <button
              key={dist}
              onClick={() => setDistanceFilter(dist)}
              className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                distanceFilter === dist
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              &lt; {dist} mi
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Mode */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Visual Radar Map Canvas */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden relative shadow-xl">
            {/* Simulated Dark City Map Canvas */}
            <div className="relative h-[480px] w-full bg-[#0a0f1d] overflow-hidden select-none">
              {/* Grid Lines */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              ></div>

              {/* Concentric radar range circles centered around user */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="h-44 w-44 rounded-full border border-emerald-500/15 animate-ping opacity-25"></div>
                <div className="absolute inset-0 h-64 w-64 -translate-x-10 -translate-y-10 rounded-full border border-emerald-500/20"></div>
                <div className="absolute inset-0 h-96 w-96 -translate-x-26 -translate-y-26 rounded-full border border-emerald-500/10"></div>
              </div>

              {/* User location pulse pin (San Francisco / Downtown mock center) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950 shadow-lg"></span>
                </div>
                <span className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-emerald-400 font-semibold shadow">
                  You are here
                </span>
              </div>

              {/* Task Location Pins */}
              {filteredTasks.map((t, idx) => {
                // Scatter positions pseudo-geographically relative to center
                const offsets = [
                  { top: '35%', left: '55%' },
                  { top: '65%', left: '42%' },
                  { top: '28%', left: '38%' },
                  { top: '72%', left: '60%' },
                  { top: '45%', left: '70%' },
                ];
                const pos = offsets[idx % offsets.length];
                const isSelected = activePinId === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => { sound.playClick(); setActivePinId(t.id); }}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 group ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-2 rounded-full border shadow-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-white ring-4 ring-emerald-500/30'
                            : 'bg-slate-900 text-emerald-400 border-slate-700 group-hover:border-emerald-400'
                        }`}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono font-bold text-white shadow-lg whitespace-nowrap">
                        {formatReward(t.rewardUsd)}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Map UI Overlay HUD */}
              <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Downtown Metro Cluster</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {filteredTasks.length} active micro-tasks detected within radius
                </div>
              </div>
            </div>
          </div>

          {/* Active Task Detail Card adjacent to Map */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-xl">
            {activeTask ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">{activeTask.category}</span>
                    <span className="font-mono text-slate-400">{activeTask.distanceMiles} mi away</span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">
                    {activeTask.title}
                  </h3>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="font-semibold text-white">{activeTask.locationName}</div>
                    <div className="text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{activeTask.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>Est. {activeTask.estimatedTimeMin} mins</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-mono">
                      <Flame className="h-3.5 w-3.5" />
                      <span>Expires in {activeTask.expiresInHours}h</span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <span className="font-semibold text-slate-200">Requirements:</span>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      <li>GPS proximity check-in</li>
                      <li>Clear daylight photo of shelf & price tag</li>
                      <li>In-stock status report</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-500">Reward</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                      +{formatReward(activeTask.rewardUsd)}
                    </span>
                  </div>

                  {activeTask.status === 'approved' ? (
                    <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approved</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => { sound.playClick(); onOpenTask(activeTask); }}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Accept & Execute</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Select a pin on the radar map to inspect task instructions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* List View Mode */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-emerald-400 font-semibold">{t.category}</span>
                  <span className="font-mono">{t.distanceMiles} mi away</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{t.title}</h3>

                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{t.locationName}</span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Est. {t.estimatedTimeMin} mins</span>
                  <span>·</span>
                  <span className="text-amber-400 font-mono">Expires in {t.expiresInHours}h</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  +{formatReward(t.rewardUsd)}
                </div>

                {t.status === 'approved' ? (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approved</span>
                  </div>
                ) : (
                  <button
                    onClick={() => { sound.playClick(); onOpenTask(t); }}
                    className="flex items-center gap-1 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                  >
                    <span>Execute</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

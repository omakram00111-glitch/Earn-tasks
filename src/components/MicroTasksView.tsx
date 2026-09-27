import React, { useState } from 'react';
import { DigitalMicroTask, MicroTaskType } from '../types';
import { 
  Layers, 
  FileText, 
  Tag, 
  Monitor, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Search 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MicroTasksViewProps {
  tasks: DigitalMicroTask[];
  onOpenTask: (task: DigitalMicroTask) => void;
  currencyMode: 'usd' | 'points';
}

export const MicroTasksView: React.FC<MicroTasksViewProps> = ({
  tasks,
  onOpenTask,
  currencyMode,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const typeTabs = [
    { id: 'all', label: 'All Digital Tasks' },
    { id: 'data_entry', label: 'Data Entry (Receipts/Forms)' },
    { id: 'image_tagging', label: 'Image Tagging & AI' },
    { id: 'usability_feedback', label: 'Usability Feedback' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (selectedType !== 'all' && t.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatReward = (usd: number) => {
    return currencyMode === 'usd' ? `$${usd.toFixed(2)}` : `${Math.round(usd * 100).toLocaleString()} pts`;
  };

  const getTaskIcon = (type: MicroTaskType) => {
    switch (type) {
      case 'data_entry':
        return <FileText className="h-4 w-4 text-emerald-400" />;
      case 'image_tagging':
        return <Tag className="h-4 w-4 text-sky-400" />;
      case 'usability_feedback':
        return <Monitor className="h-4 w-4 text-purple-400" />;
      default:
        return <Layers className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Layers className="h-4 w-4" />
            <span>ONLINE DIGITAL WORKFORCE</span>
            <span aria-hidden="true">·</span>
            <span>DATA & AI MICRO-TASKS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Data Entry, Tagging & Usability Feedback
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quick 2–5 minute digital tasks. Transcribe invoices, categorize vision datasets, and critique website prototypes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search micro-tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
        {typeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { sound.playClick(); setSelectedType(tab.id); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedType === tab.id
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/20 transition-all"
          >
            <div className="space-y-3">
              {/* Unboxed Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  {getTaskIcon(t.type)}
                  <span className="text-white font-medium">{t.categoryLabel}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {t.availableUnits} units available
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white leading-snug">
                {t.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {t.description}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-mono tabular-nums">{t.estimatedTimeMin} min</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] text-slate-500">{t.difficulty}</span>
                </div>
                <div className="text-lg font-extrabold font-mono text-emerald-400 tabular-nums">
                  +{formatReward(t.rewardUsd)}
                </div>
              </div>

              <button
                onClick={() => { sound.playClick(); onOpenTask(t); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                <span>Start Task</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="py-16 text-center rounded-xl border border-slate-800 bg-slate-900/40 p-8 space-y-3">
          <Layers className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No tasks in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try switching filters to view data entry, tagging, or feedback sessions.
          </p>
          <button
            onClick={() => { setSelectedType('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 transition-colors"
          >
            Show All Tasks
          </button>
        </div>
      )}
    </div>
  );
};

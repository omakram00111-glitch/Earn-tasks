import React from 'react';
import { EarningTab, UserProfile } from '../types';
import { 
  ClipboardCheck, 
  MapPin, 
  Layers, 
  Flame, 
  Wallet, 
  Users, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  currentTab: EarningTab;
  onSelectTab: (tab: EarningTab) => void;
  user: UserProfile;
  onToggleCurrency: () => void;
  onToggleSound: () => void;
  onOpenProfile: () => void;
  onOpenDailyPoll: () => void;
  dailyPollDone: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onToggleCurrency,
  onToggleSound,
  onOpenProfile,
  onOpenDailyPoll,
  dailyPollDone,
}) => {
  const displayBalance = user.currencyMode === 'usd' 
    ? `$${user.balanceUsd.toFixed(2)}` 
    : `${Math.round(user.balanceUsd * 100).toLocaleString()} pts`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelectTab('surveys')} 
            className="text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            PremisePulse
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean typography) */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectTab('surveys')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'surveys'
                ? 'bg-slate-800/80 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            Surveys
          </button>

          <button
            onClick={() => onSelectTab('premise')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'premise'
                ? 'bg-slate-800/80 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Field Tasks
          </button>

          <button
            onClick={() => onSelectTab('microtasks')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'microtasks'
                ? 'bg-slate-800/80 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            Digital Tasks
          </button>

          <button
            onClick={() => onSelectTab('offers')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'offers'
                ? 'bg-slate-800/80 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Offerwall
          </button>

          <button
            onClick={() => onSelectTab('referrals')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'referrals'
                ? 'bg-slate-800/80 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            Refer & Earn
            <span className="text-[10px] text-emerald-400 font-mono font-semibold ml-1">15%</span>
          </button>

          <button
            onClick={() => onSelectTab('wallet')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'wallet'
                ? 'bg-slate-800/80 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Wallet className="h-4 w-4" />
            Cashout
          </button>

          <button
            onClick={() => onSelectTab('leaderboard')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'leaderboard'
                ? 'bg-slate-800/80 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trophy className="h-4 w-4" />
            Leaders
          </button>
        </nav>

        {/* Zone 3: Actions & Balances */}
        <div className="flex items-center gap-3">
          {/* Daily Streak */}
          <button
            onClick={onOpenDailyPoll}
            title={dailyPollDone ? 'Daily Poll Completed (+Streak active)' : 'Take Daily Poll for Streak Bonus'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors text-xs font-medium"
          >
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="font-mono tabular-nums">{user.streakDays}d Streak</span>
            {!dailyPollDone && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={user.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
          >
            {user.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Balance Widget with Currency Switch */}
          <button
            onClick={onToggleCurrency}
            title="Click to toggle between USD and Points"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors text-emerald-400 text-sm font-semibold"
          >
            <span className="font-mono tabular-nums tracking-tight">{displayBalance}</span>
            <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-900/60 px-1 py-0.5 rounded">
              {user.currencyMode}
            </span>
          </button>

          {/* User Profile Trigger */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-800 hover:border-slate-700 bg-slate-900 transition-colors"
          >
            <span className="text-xs font-medium text-slate-300 hidden sm:inline">{user.name.split(' ')[0]}</span>
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full object-cover border border-slate-700"
            />
          </button>
        </div>
      </div>

      {/* Mobile Secondary Tab Navigation */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/80 px-4 py-2 gap-1 scrollbar-none bg-slate-950">
        <button
          onClick={() => { sound.playClick(); onSelectTab('surveys'); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'surveys' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Surveys
        </button>
        <button
          onClick={() => { sound.playClick(); onSelectTab('premise'); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'premise' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Field Tasks
        </button>
        <button
          onClick={() => { sound.playClick(); onSelectTab('microtasks'); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'microtasks' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Digital Tasks
        </button>
        <button
          onClick={() => { sound.playClick(); onSelectTab('offers'); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'offers' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Offerwall
        </button>
        <button
          onClick={() => { sound.playClick(); onSelectTab('referrals'); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'referrals' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Refer & Earn (15%)
        </button>
        <button
          onClick={() => { sound.playClick(); onSelectTab('wallet'); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'wallet' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Cashout
        </button>
        <button
          onClick={() => { sound.playClick(); onSelectTab('leaderboard'); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'leaderboard' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Leaders
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { UserProfile, DailyPoll } from '../types';
import { 
  ArrowUpRight, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Vote, 
  Gift 
} from 'lucide-react';

interface StatsBannerProps {
  user: UserProfile;
  todayEarnings: number;
  dailyPoll: DailyPoll;
  onOpenDailyPoll: () => void;
  onOpenCashout: () => void;
  onOpenReferrals: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  user,
  todayEarnings,
  dailyPoll,
  onOpenDailyPoll,
  onOpenCashout,
  onOpenReferrals,
}) => {
  const displayAvailable = user.currencyMode === 'usd'
    ? `$${user.balanceUsd.toFixed(2)}`
    : `${Math.round(user.balanceUsd * 100).toLocaleString()} pts`;

  const displayPending = user.currencyMode === 'usd'
    ? `$${user.pendingUsd.toFixed(2)}`
    : `${Math.round(user.pendingUsd * 100).toLocaleString()} pts`;

  const displayToday = user.currencyMode === 'usd'
    ? `$${todayEarnings.toFixed(2)}`
    : `${Math.round(todayEarnings * 100).toLocaleString()} pts`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Balance & Quick Cashout Card */}
      <div className="md:col-span-4 rounded-xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Available Balance</span>
            <span className="text-[11px] text-emerald-400 font-mono">Ready to cash out</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
              {displayAvailable}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-500">Pending Verification</span>
              <span className="font-mono text-slate-300 font-semibold">{displayPending}</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <span className="block text-[10px] text-slate-500">Earned Today</span>
              <span className="font-mono text-emerald-400 font-semibold">+{displayToday}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={onOpenCashout}
            className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Instant Cashout</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onOpenReferrals}
            className="py-2 px-3 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
          >
            <Gift className="h-3.5 w-3.5 text-emerald-400" />
            <span>Invite +15%</span>
          </button>
        </div>
      </div>

      {/* Daily Poll & Streak Action Widget */}
      <div className="md:col-span-8 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span>DAILY STREAK BONUS · DAY {user.streakDays}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-normal">+$0.25 Fast Poll</span>
          </div>

          <h3 className="text-sm md:text-base font-bold text-white">
            {dailyPoll.question}
          </h3>

          <p className="text-xs text-slate-400">
            {dailyPoll.userVotedOptionId 
              ? '✓ You voted today! Your streak multiplier is active.' 
              : 'Answer in 1 click to keep your 7-day streak active and earn instant credit.'}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
          {dailyPoll.userVotedOptionId ? (
            <button
              onClick={onOpenDailyPoll}
              className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-750 transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>View Results ({dailyPoll.totalVotes.toLocaleString()} votes)</span>
            </button>
          ) : (
            <button
              onClick={onOpenDailyPoll}
              className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Vote className="h-4 w-4" />
              <span>Vote Now (+${dailyPoll.rewardUsd.toFixed(2)})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

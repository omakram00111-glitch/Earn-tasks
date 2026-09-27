import React, { useState } from 'react';
import { DailyPoll } from '../types';
import { 
  X, 
  Flame, 
  CheckCircle2, 
  Vote, 
  Sparkles, 
  Users 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface DailyPollModalProps {
  poll: DailyPoll;
  onClose: () => void;
  onVote: (optionId: string) => void;
}

export const DailyPollModal: React.FC<DailyPollModalProps> = ({
  poll,
  onClose,
  onVote,
}) => {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(poll.userVotedOptionId || null);
  const hasVoted = Boolean(poll.userVotedOptionId);

  const handleSelectOption = (optId: string) => {
    if (hasVoted) return;
    sound.playCashout();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
    setSelectedOptId(optId);
    onVote(optId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span>DAILY RESEARCH POLL · +${poll.rewardUsd.toFixed(2)} CASH</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider block mb-1">
              Category: {poll.category}
            </span>
            <h3 className="text-base font-bold text-white leading-snug">
              {poll.question}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Vote to maintain your consecutive daily streak and earn immediate wallet credit.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {poll.options.map((opt) => {
              const isSelected = selectedOptId === opt.id;
              const percent = Math.round((opt.votes / Math.max(1, poll.totalVotes)) * 100);

              return (
                <button
                  key={opt.id}
                  disabled={hasVoted}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full relative overflow-hidden rounded-xl border p-3.5 text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  {/* Progress background bar when voted */}
                  {hasVoted && (
                    <div
                      className={`absolute top-0 bottom-0 left-0 opacity-20 pointer-events-none transition-all duration-500 ${
                        isSelected ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  )}

                  <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                    <span className={`font-medium ${isSelected ? 'text-emerald-300 font-bold' : 'text-slate-200'}`}>
                      {opt.text}
                    </span>

                    {hasVoted ? (
                      <span className="font-mono text-xs font-bold text-slate-300 shrink-0">
                        {percent}%
                      </span>
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-slate-600 shrink-0"></span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {hasVoted && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Streak Day 5 Recorded! (+$0.25 credited)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {poll.totalVotes.toLocaleString()} participants
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

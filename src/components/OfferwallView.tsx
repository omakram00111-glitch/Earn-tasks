import React from 'react';
import { OfferwallItem } from '../types';
import { 
  Sparkles, 
  Star, 
  Gamepad2, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface OfferwallViewProps {
  offers: OfferwallItem[];
  onClaimStep: (offerId: string, stepNumber: number, rewardUsd: number) => void;
  currencyMode: 'usd' | 'points';
}

export const OfferwallView: React.FC<OfferwallViewProps> = ({
  offers,
  onClaimStep,
  currencyMode,
}) => {
  const formatReward = (usd: number) => {
    return currencyMode === 'usd' ? `$${usd.toFixed(2)}` : `${Math.round(usd * 100).toLocaleString()} pts`;
  };

  const handleClaim = (offerId: string, stepNumber: number, rewardUsd: number) => {
    sound.playCashout();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    onClaimStep(offerId, stepNumber, rewardUsd);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Sparkles className="h-4 w-4" />
          <span>FREECASH & SWAGBUCKS PARTNER OFFERWALL</span>
          <span aria-hidden="true">·</span>
          <span>TIERED MILESTONE EARNINGS</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Product Testing & Promotional Offers
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Download mobile games, test fintech cards, and claim cash at every milestone achieved.
        </p>
      </div>

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Card Banner Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-md text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  {offer.badgeText}
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-slate-300 font-medium block">
                      {offer.category} · {offer.platform}
                    </span>
                    <h3 className="text-lg font-bold text-white drop-shadow">
                      {offer.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Reward</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-400 tabular-nums">
                      +{formatReward(offer.totalRewardUsd)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {offer.description}
                </p>

                {/* Milestone Steps */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    Tiered Milestone Rewards:
                  </div>

                  <div className="space-y-2">
                    {offer.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                          step.completed
                            ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-300'
                            : step.inProgress
                            ? 'border-amber-500/40 bg-amber-500/5 text-white'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              step.completed
                                ? 'bg-emerald-500 text-slate-950'
                                : step.inProgress
                                ? 'bg-amber-500 text-slate-950 animate-pulse'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {step.completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.stepNumber}
                          </span>
                          <span className="font-medium">{step.title}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-emerald-400 font-bold tabular-nums">
                            +{formatReward(step.rewardUsd)}
                          </span>

                          {step.completed ? (
                            <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                              Claimed
                            </span>
                          ) : step.inProgress ? (
                            <button
                              onClick={() => handleClaim(offer.id, step.stepNumber, step.rewardUsd)}
                              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-colors shadow"
                            >
                              Claim Now
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-mono">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0">
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Freecash Tracking Protocol Active
                </span>
                <span className="text-amber-400 font-mono">★ {offer.rating} rating</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

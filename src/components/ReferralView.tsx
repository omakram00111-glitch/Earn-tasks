import React, { useState } from 'react';
import { ReferralProgramState, UserProfile } from '../types';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Clock, 
  Sparkles, 
  DollarSign, 
  Gift, 
  QrCode, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  MessageCircle,
  Twitter,
  Send,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface ReferralViewProps {
  referralData: ReferralProgramState;
  user: UserProfile;
  onSimulateReferralEarning: () => void;
  onClaimWelcomeBonus: (code: string) => { success: boolean; message: string };
}

export const ReferralView: React.FC<ReferralViewProps> = ({
  referralData,
  user,
  onSimulateReferralEarning,
  onClaimWelcomeBonus,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [bonusStatusMessage, setBonusStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    setCopiedLink(true);
    sound.playClick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopiedCode(true);
    sound.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredCode.trim()) return;

    const res = onClaimWelcomeBonus(enteredCode.trim().toUpperCase());
    if (res.success) {
      sound.playCashout();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setBonusStatusMessage({ text: res.message, isError: false });
      setEnteredCode('');
    } else {
      setBonusStatusMessage({ text: res.message, isError: true });
    }
  };

  const shareText = `Join me on PremisePulse! Sign up with my link to get an instant $2.00 cash bonus and earn from paid surveys & local tasks.`;

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralData.referralLink)}`;
    window.open(url, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + referralData.referralLink)}`;
    window.open(url, '_blank');
  };

  const shareOnTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralData.referralLink)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Claim your $2.00 signup bonus on PremisePulse');
    const body = encodeURIComponent(`Hey! Check out PremisePulse to earn real cash for taking surveys and quick market research tasks.\n\nUse my referral link to get an instant $2.00 welcome bonus:\n${referralData.referralLink}\n\nReferral Code: ${referralData.referralCode}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 md:p-8">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span>COMMUNITY REVENUE SHARE PROGRAM</span>
              <span aria-hidden="true">·</span>
              <span>15% PASSIVE LIFETIME TIERS</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Give <span className="text-emerald-400 font-mono">${referralData.newUserSignupBonusUsd.toFixed(2)}</span>, Earn{' '}
              <span className="text-emerald-400 font-mono">{referralData.commissionPercentage}%</span> on Every Task
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
              When friends sign up using your link or code, they immediately receive a <strong>${referralData.newUserSignupBonusUsd.toFixed(2)} Welcome Cash Bonus</strong>. 
              In return, you earn <strong>{referralData.commissionPercentage}% of everything they earn</strong> for their first <strong>{referralData.commissionWindowDays} days</strong> on the platform.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Zero deduction from friend earnings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Instant automated wallet credits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Valid on surveys, offers & premise audits</span>
              </div>
            </div>
          </div>

          {/* Quick Copy Link & Code Box */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">
                Your Exclusive Referral Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralData.referralLink}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shrink-0"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Referral Code
                </label>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                  <span className="font-mono font-bold text-sm text-white tracking-wider">
                    {referralData.referralCode}
                  </span>
                  <button 
                    onClick={handleCopyCode} 
                    title="Copy code" 
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  QR Code
                </label>
                <button
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 transition-colors"
                >
                  <QrCode className="h-4 w-4 text-emerald-400" />
                  <span>{showQrCode ? 'Hide QR' : 'Show QR'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Triggers */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-2">
                One-Click Share:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={shareOnWhatsApp}
                  title="Share to WhatsApp"
                  className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex-1 flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={shareOnTwitter}
                  title="Share on X / Twitter"
                  className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition-colors flex-1 flex items-center justify-center"
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  onClick={shareOnTelegram}
                  title="Share on Telegram"
                  className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors flex-1 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  onClick={shareViaEmail}
                  title="Share via Email"
                  className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors flex-1 flex items-center justify-center"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showQrCode && (
              <div className="pt-3 border-t border-slate-800 text-center space-y-2">
                <div className="inline-block p-2 bg-white rounded-lg shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(referralData.referralLink)}`}
                    alt="Referral QR Code"
                    className="h-32 w-32"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Scan to register on mobile with {referralData.referralCode}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Referral Program Stats Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Referrals</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {referralData.totalReferralsCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Friends joined</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Earners</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {referralData.activeEarnersCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Completed tasks this week</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Commission Earned</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            ${referralData.totalCommissionEarnedUsd.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-1">15% passive payouts</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Commission Window</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {referralData.commissionWindowDays} Days
          </p>
          <p className="text-xs text-slate-500 mt-1">Per invited participant</p>
        </div>
      </div>

      {/* Simulator & Welcome Bonus Claim Section */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Simulator Box */}
        <div className="md:col-span-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Interactive Commission Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate a friend completing a survey or Premise audit to see your 15% revenue cut in real time.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span>Example Event:</span>
              <span className="font-mono text-white font-medium">Retail Shelf Audit ($4.80)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Your Cut (15%):</span>
              <span className="font-mono text-emerald-400 font-semibold">+$0.72 Instant Deposit</span>
            </div>
          </div>

          <button
            onClick={onSimulateReferralEarning}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Simulate Referred Friend Earning (+15% Cut)</span>
          </button>
        </div>

        {/* Enter Code / Welcome Bonus Claim */}
        <div className="md:col-span-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Gift className="h-4 w-4 text-amber-400" />
              Claim Your $2.00 Welcome Sign-Up Bonus
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Were you referred by a friend or research partner? Enter their referral code below.
            </p>
          </div>

          {referralData.hasClaimedWelcomeBonus ? (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>$2.00 Welcome Bonus Claimed</span>
              </div>
              <p className="text-slate-400">
                You successfully applied code <strong className="font-mono text-white">{referralData.claimedReferralCode}</strong>. The welcome funds are already in your wallet!
              </p>
            </div>
          ) : (
            <form onSubmit={handleRedeemCode} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SURVEYPRO or ALEX2026"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Claim $2.00
                </button>
              </div>

              {bonusStatusMessage && (
                <p className={`text-xs ${bonusStatusMessage.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {bonusStatusMessage.text}
                </p>
              )}

              <p className="text-[11px] text-slate-500">
                Tip: Enter code <span className="font-mono text-slate-400">WELCOME2026</span> or <span className="font-mono text-slate-400">FREECASH</span> to test the sign-up bonus.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Referred Friends Activity Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Your Referred Friends & Commission Ledger</h2>
            <p className="text-xs text-slate-400">
              Track friends actively taking surveys and micro-tasks, with days remaining in their 90-day commission window.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {referralData.referredFriends.length} Friends Registered
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-medium">Friend</th>
                  <th className="py-3 px-4 font-medium">Registered</th>
                  <th className="py-3 px-4 font-medium">Commission Window</th>
                  <th className="py-3 px-4 font-medium">Recent Activity</th>
                  <th className="py-3 px-4 font-medium text-right">Friend Earned</th>
                  <th className="py-3 px-4 font-medium text-right">Your 15% Cut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {referralData.referredFriends.map((friend) => (
                  <tr key={friend.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={friend.avatar}
                          alt={friend.username}
                          referrerPolicy="no-referrer"
                          className="h-7 w-7 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white font-mono">{friend.username}</div>
                          <span className="text-[10px] text-slate-500">
                            {friend.status === 'active' ? 'Active Contributor' : 'Signed up · Pending Task'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {friend.joinedDate}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-slate-200">{friend.commissionDaysRemaining} days left</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                      {friend.lastActivity}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                      ${friend.totalEarnedByFriendUsd.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                      +${friend.commissionEarnedUsd.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

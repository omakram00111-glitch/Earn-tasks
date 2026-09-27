import React, { useState } from 'react';
import { CashoutMethod, Transaction, UserProfile } from '../types';
import { 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  Gift, 
  Building, 
  Coins, 
  Copy, 
  Check, 
  Filter 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface CashoutViewProps {
  methods: CashoutMethod[];
  transactions: Transaction[];
  user: UserProfile;
  onSelectMethod: (method: CashoutMethod) => void;
}

export const CashoutView: React.FC<CashoutViewProps> = ({
  methods,
  transactions,
  user,
  onSelectMethod,
}) => {
  const [activeLedgerFilter, setActiveLedgerFilter] = useState<string>('all');
  const [copiedTxCodeId, setCopiedTxCodeId] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    if (activeLedgerFilter === 'all') return true;
    if (activeLedgerFilter === 'earnings') return tx.amountUsd > 0;
    if (activeLedgerFilter === 'cashout') return tx.type === 'cashout';
    if (activeLedgerFilter === 'referrals') return tx.type === 'referral_commission' || tx.type === 'welcome_bonus';
    return true;
  });

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'paypal':
        return <span className="font-extrabold text-sky-400 font-sans tracking-tight">PayPal</span>;
      case 'bank':
        return <Building className="h-5 w-5 text-emerald-400" />;
      case 'amazon':
        return <Gift className="h-5 w-5 text-amber-400" />;
      case 'crypto':
        return <Coins className="h-5 w-5 text-indigo-400" />;
      default:
        return <CreditCard className="h-5 w-5 text-slate-300" />;
    }
  };

  const handleCopyClaimCode = (txId: string, code: string) => {
    navigator.clipboard.writeText(code);
    sound.playClick();
    setCopiedTxCodeId(txId);
    setTimeout(() => setCopiedTxCodeId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Wallet Balance Hero Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Verified Earning Balance
            </span>
            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                ${user.balanceUsd.toFixed(2)}
              </h1>
              <span className="text-sm text-slate-400 font-mono">
                ({Math.round(user.balanceUsd * 100).toLocaleString()} points)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Low $5.00 cashout threshold. Instant processing with zero transaction deductions.
            </p>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Lifetime Cash Redeemed</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                ${user.lifetimeUsd.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Pending Verification</span>
              <span className="text-xl font-bold font-mono text-slate-300 tabular-nums">
                ${user.pendingUsd.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption Channels Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">Choose Cashout Method</h2>
          <p className="text-xs text-slate-400">
            Redeem points directly to PayPal, US checking accounts (ACH), or digital gift cards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {methods.map((method) => {
            const canRedeem = user.balanceUsd >= method.minAmount;

            return (
              <div
                key={method.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getMethodIcon(method.type)}
                    </div>
                    {method.badge && (
                      <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {method.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{method.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {method.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    <div className="flex justify-between">
                      <span>Minimum:</span>
                      <span className="font-mono text-slate-300 font-semibold">${method.minAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="font-mono text-emerald-400">{method.processingTime}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => { sound.playClick(); onSelectMethod(method); }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      canRedeem
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    <span>{canRedeem ? 'Redeem Cash' : `Needs $${method.minAmount.toFixed(2)}`}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction & Redemption Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Earnings & Cashout Ledger</h2>
            <p className="text-xs text-slate-400">
              Audit log of all surveys, local tasks, referral royalties, and gift card claim codes.
            </p>
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            {['all', 'earnings', 'referrals', 'cashout'].map((flt) => (
              <button
                key={flt}
                onClick={() => setActiveLedgerFilter(flt)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors capitalize ${
                  activeLedgerFilter === flt
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {flt === 'all' ? 'All Activity' : flt}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-medium">Activity</th>
                  <th className="py-3 px-4 font-medium">Date & Time</th>
                  <th className="py-3 px-4 font-medium">Details / Voucher Code</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredTransactions.map((tx) => {
                  const isPositive = tx.amountUsd > 0;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{tx.title}</div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {tx.date}
                      </td>

                      <td className="py-3 px-4">
                        {tx.claimCode ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-emerald-400 font-semibold">
                              {tx.claimCode}
                            </span>
                            <button
                              onClick={() => handleCopyClaimCode(tx.id, tx.claimCode!)}
                              title="Copy code"
                              className="text-slate-400 hover:text-white p-1 rounded"
                            >
                              {copiedTxCodeId === tx.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">{tx.details || 'Direct account credit'}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Completed</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        <span className={isPositive ? 'text-emerald-400' : 'text-slate-300'}>
                          {isPositive ? `+$${tx.amountUsd.toFixed(2)}` : `-$${Math.abs(tx.amountUsd).toFixed(2)}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

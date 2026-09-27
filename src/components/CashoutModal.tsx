import React, { useState } from 'react';
import { CashoutMethod, UserProfile } from '../types';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download,
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface CashoutModalProps {
  method: CashoutMethod;
  user: UserProfile;
  onClose: () => void;
  onSuccessPayout: (amountUsd: number, methodTitle: string, details: string, claimCode?: string) => void;
}

export const CashoutModal: React.FC<CashoutModalProps> = ({
  method,
  user,
  onClose,
  onSuccessPayout,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(method.denominations[0] || 5);
  const [destinationInput, setDestinationInput] = useState<string>(
    method.type === 'paypal' ? user.email : method.type === 'bank' ? '•••• •••• 4192 (Chase Checking)' : ''
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutResult, setPayoutResult] = useState<{
    claimCode?: string;
    txId: string;
    amount: number;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canAfford = user.balanceUsd >= selectedAmount;

  const handleExecutePayout = () => {
    if (!destinationInput.trim()) {
      setErrorMsg('Please enter your recipient email or account destination.');
      return;
    }
    if (!canAfford) {
      setErrorMsg(`Insufficient balance. You need $${selectedAmount.toFixed(2)} to redeem this amount.`);
      return;
    }

    sound.playClick();
    setIsProcessing(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsProcessing(false);
      sound.playCashout();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Generate random claim code for gift cards
      let code: string | undefined = undefined;
      if (['amazon', 'apple', 'google_play', 'steam', 'starbucks'].includes(method.type)) {
        const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
        code = `${method.type.substring(0, 4).toUpperCase()}-${rand()}-${rand()}-${rand()}`;
      }

      const txId = `TX-${Date.now().toString().slice(-6)}`;
      setPayoutResult({
        claimCode: code,
        txId,
        amount: selectedAmount,
      });

      const detailStr = code ? `Claim Code: ${code}` : `Sent to ${destinationInput}`;
      onSuccessPayout(selectedAmount, method.name, detailStr, code);
    }, 1500);
  };

  const handleCopyCode = () => {
    if (payoutResult?.claimCode) {
      navigator.clipboard.writeText(payoutResult.claimCode);
      setCopiedCode(true);
      sound.playClick();
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">{method.name}</span>
              <span aria-hidden="true">·</span>
              <span>{method.processingTime}</span>
            </div>
            <h2 className="text-base font-semibold text-white mt-0.5">
              Redeem Earnings
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {payoutResult ? (
            <div className="py-6 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-12 w-12" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Payout Successful!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Transaction #{payoutResult.txId} · Redeemed ${payoutResult.amount.toFixed(2)}
                </p>
              </div>

              {payoutResult.claimCode ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Your Digital Gift Card Voucher Code:
                  </span>
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg p-3">
                    <span className="font-mono text-base font-bold text-emerald-400 tracking-wider">
                      {payoutResult.claimCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-md transition-colors"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    A copy has also been sent to your verified email and logged in your wallet receipt history.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1">
                  <span className="text-xs text-slate-400">Transfer Destination:</span>
                  <div className="font-mono text-white text-sm font-semibold">{destinationInput}</div>
                  <p className="text-[11px] text-emerald-400 font-medium pt-1">
                    Funds will reflect in your account within the stated processing window.
                  </p>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Description */}
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                {method.description}
              </div>

              {/* Denomination Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-300">Select Denomination ($ USD)</label>
                  <span className="font-mono text-slate-400">
                    Balance: <strong className="text-emerald-400">${user.balanceUsd.toFixed(2)}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {method.denominations.map((amount) => {
                    const isSelected = selectedAmount === amount;
                    const affordable = user.balanceUsd >= amount;
                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => { sound.playClick(); setSelectedAmount(amount); }}
                        className={`py-3 rounded-xl border font-mono text-sm font-bold transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-md'
                            : affordable
                            ? 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                            : 'border-slate-800/40 bg-slate-950/40 text-slate-600'
                        }`}
                      >
                        ${amount}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Destination Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  {method.type === 'paypal'
                    ? 'PayPal Email Address'
                    : method.type === 'bank'
                    ? 'Bank Account & Routing (ACH)'
                    : method.type === 'crypto'
                    ? 'Litecoin / USDT Wallet Address'
                    : 'Recipient Delivery Email'}
                </label>
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  placeholder={
                    method.type === 'crypto'
                      ? 'e.g. ltc1q...'
                      : method.type === 'bank'
                      ? 'Routing & Account numbers'
                      : 'name@example.com'
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Fee and breakdown */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Redemption Amount:</span>
                  <span className="font-mono text-white font-semibold">${selectedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Processing Fee:</span>
                  <span className="font-mono text-emerald-400 font-semibold">$0.00 (Zero Fee)</span>
                </div>
                <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1.5 font-semibold text-white">
                  <span>Total Deducted:</span>
                  <span className="font-mono text-emerald-400">${selectedAmount.toFixed(2)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!payoutResult && (
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Secure 256-bit Encrypted
            </span>

            <button
              onClick={handleExecutePayout}
              disabled={isProcessing || !canAfford}
              className={`py-2 px-5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md ${
                canAfford && !isProcessing
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>{isProcessing ? 'Processing Payout...' : `Confirm $${selectedAmount.toFixed(2)} Payout`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

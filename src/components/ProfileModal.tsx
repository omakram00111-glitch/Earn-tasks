import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  Home, 
  Car, 
  Save 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface ProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdateDemographics: (newDemo: UserProfile['demographics']) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  onUpdateDemographics,
}) => {
  const [formData, setFormData] = useState(user.demographics);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCashout();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    onUpdateDemographics(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <h2 className="text-base font-bold text-white">{user.name}</h2>
              <span className="text-xs text-slate-400 font-mono">{user.email}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Demographic Match Score: <strong>96% Optimized</strong></span>
            </div>
            <span className="font-mono text-emerald-400">+50 pts active bonus</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Age Bracket
              </label>
              <select
                value={formData.ageRange}
                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="18-24">18-24 years</option>
                <option value="25-34">25-34 years</option>
                <option value="35-44">35-44 years</option>
                <option value="45-54">45-54 years</option>
                <option value="55+">55+ years</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Employment Status
              </label>
              <select
                value={formData.employment}
                onChange={(e) => setFormData({ ...formData, employment: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Full-time Employed">Full-time Employed</option>
                <option value="Part-time Employed">Part-time Employed</option>
                <option value="Self-Employed / Freelance">Self-Employed / Freelance</option>
                <option value="Student">Student</option>
                <option value="Homemaker">Homemaker</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Household Annual Income
              </label>
              <select
                value={formData.householdIncome}
                onChange={(e) => setFormData({ ...formData, householdIncome: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Under $35,000">Under $35,000</option>
                <option value="$35,000 - $74,999">$35,000 - $74,999</option>
                <option value="$75,000 - $99,999">$75,000 - $99,999</option>
                <option value="$100,000 - $149,999">$100,000 - $149,999</option>
                <option value="$150,000+">$150,000+</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Residence Area
                </label>
                <select
                  value={formData.residenceType}
                  onChange={(e) => setFormData({ ...formData, residenceType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Urban Apartment">Urban Apartment</option>
                  <option value="Suburban Home">Suburban Home</option>
                  <option value="Rural Residence">Rural Residence</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-6 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasCar}
                  onChange={(e) => setFormData({ ...formData, hasCar: e.target.checked })}
                  className="accent-emerald-500 h-4 w-4 rounded"
                />
                <span>Vehicle Owner</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasPets}
                  onChange={(e) => setFormData({ ...formData, hasPets: e.target.checked })}
                  className="accent-emerald-500 h-4 w-4 rounded"
                />
                <span>Pet Owner</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Encrypted Demographics
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              <Save className="h-4 w-4" />
              <span>{savedSuccess ? 'Saved!' : 'Save & Boost Match Rate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

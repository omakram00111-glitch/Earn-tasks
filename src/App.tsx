/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  EarningTab, 
  Survey, 
  PremiseTask, 
  DigitalMicroTask, 
  CashoutMethod, 
  Transaction, 
  UserProfile, 
  ReferralProgramState 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_SURVEYS, 
  INITIAL_PREMISE_TASKS, 
  INITIAL_DIGITAL_MICRO_TASKS, 
  INITIAL_OFFERS, 
  INITIAL_TRANSACTIONS, 
  CASHOUT_METHODS, 
  INITIAL_DAILY_POLL, 
  LEADERBOARD_USERS, 
  INITIAL_REFERRAL_DATA 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { SurveysView } from './components/SurveysView';
import { SurveyModal } from './components/SurveyModal';
import { PremiseTasksView } from './components/PremiseTasksView';
import { PremiseTaskModal } from './components/PremiseTaskModal';
import { MicroTasksView } from './components/MicroTasksView';
import { DigitalMicroTaskModal } from './components/DigitalMicroTaskModal';
import { OfferwallView } from './components/OfferwallView';
import { ReferralView } from './components/ReferralView';
import { CashoutView } from './components/CashoutView';
import { CashoutModal } from './components/CashoutModal';
import { LeaderboardView } from './components/LeaderboardView';
import { DailyPollModal } from './components/DailyPollModal';
import { ProfileModal } from './components/ProfileModal';
import { sound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<EarningTab>('surveys');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [surveys, setSurveys] = useState<Survey[]>(INITIAL_SURVEYS);
  const [premiseTasks, setPremiseTasks] = useState<PremiseTask[]>(INITIAL_PREMISE_TASKS);
  const [digitalTasks, setDigitalTasks] = useState<DigitalMicroTask[]>(INITIAL_DIGITAL_MICRO_TASKS);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [referralData, setReferralData] = useState<ReferralProgramState>(INITIAL_REFERRAL_DATA);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [dailyPoll, setDailyPoll] = useState(INITIAL_DAILY_POLL);
  const [leaderboardUsers, setLeaderboardUsers] = useState(LEADERBOARD_USERS);

  // Modals state
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [activePremiseTask, setActivePremiseTask] = useState<PremiseTask | null>(null);
  const [activeDigitalTask, setActiveDigitalTask] = useState<DigitalMicroTask | null>(null);
  const [selectedCashoutMethod, setSelectedCashoutMethod] = useState<CashoutMethod | null>(null);
  const [showDailyPoll, setShowDailyPoll] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Toggle currency USD vs Points
  const handleToggleCurrency = () => {
    sound.playClick();
    setUser((prev) => ({
      ...prev,
      currencyMode: prev.currencyMode === 'usd' ? 'points' : 'usd',
    }));
  };

  // Toggle sound effects
  const handleToggleSound = () => {
    sound.enabled = !sound.enabled;
    setUser((prev) => ({
      ...prev,
      soundEnabled: sound.enabled,
    }));
  };

  // Survey Complete
  const handleCompleteSurvey = (surveyId: string, rewardUsd: number) => {
    const srv = surveys.find((s) => s.id === surveyId);
    const title = srv?.title || 'Market Research Survey';

    setUser((prev) => ({
      ...prev,
      balanceUsd: prev.balanceUsd + rewardUsd,
      lifetimeUsd: prev.lifetimeUsd + rewardUsd,
    }));

    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, completed: true } : s))
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      type: 'survey',
      title,
      amountUsd: rewardUsd,
      status: 'completed',
      details: `${srv?.provider || 'Research'} Network verification passed`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setActiveSurvey(null);
  };

  // Premise Task Complete
  const handleSubmitPremiseTask = (taskId: string, rewardUsd: number) => {
    const task = premiseTasks.find((t) => t.id === taskId);
    const title = task?.title || 'Field Audit Task';

    setUser((prev) => ({
      ...prev,
      balanceUsd: prev.balanceUsd + rewardUsd,
      lifetimeUsd: prev.lifetimeUsd + rewardUsd,
    }));

    setPremiseTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'approved' } : t))
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      type: 'premise_task',
      title,
      amountUsd: rewardUsd,
      status: 'completed',
      details: `GPS & Photographic verification approved at ${task?.locationName}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setActivePremiseTask(null);
  };

  // Digital Micro-Task Complete
  const handleCompleteDigitalTask = (taskId: string, rewardUsd: number) => {
    const task = digitalTasks.find((t) => t.id === taskId);
    const title = task?.title || 'Digital Micro-Task';

    setUser((prev) => ({
      ...prev,
      balanceUsd: prev.balanceUsd + rewardUsd,
      lifetimeUsd: prev.lifetimeUsd + rewardUsd,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      type: 'premise_task', // or digital task
      title,
      amountUsd: rewardUsd,
      status: 'completed',
      details: `${task?.categoryLabel} · Quality validation score 100%`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setActiveDigitalTask(null);
  };

  // Offerwall Step Claim
  const handleClaimOfferStep = (offerId: string, stepNumber: number, rewardUsd: number) => {
    const off = offers.find((o) => o.id === offerId);
    setUser((prev) => ({
      ...prev,
      balanceUsd: prev.balanceUsd + rewardUsd,
      lifetimeUsd: prev.lifetimeUsd + rewardUsd,
    }));

    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        const updatedSteps = o.steps.map((st) => {
          if (st.stepNumber === stepNumber) {
            return { ...st, completed: true, inProgress: false };
          }
          if (st.stepNumber === stepNumber + 1) {
            return { ...st, inProgress: true };
          }
          return st;
        });
        return { ...o, steps: updatedSteps };
      })
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      type: 'offerwall',
      title: `${off?.title || 'Offer'} - Step ${stepNumber} Achieved`,
      amountUsd: rewardUsd,
      status: 'completed',
      details: 'Freecash Tracking Network instant milestone credit',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Daily Poll Vote
  const handleVoteDailyPoll = (optionId: string) => {
    if (dailyPoll.userVotedOptionId) return;

    const reward = dailyPoll.rewardUsd;
    setUser((prev) => ({
      ...prev,
      balanceUsd: prev.balanceUsd + reward,
      lifetimeUsd: prev.lifetimeUsd + reward,
      streakDays: prev.streakDays + 1,
    }));

    setDailyPoll((prev) => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      userVotedOptionId: optionId,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      type: 'daily_poll',
      title: 'Daily Poll + Consecutive Streak Reward',
      amountUsd: reward,
      status: 'completed',
      details: `Streak Day ${user.streakDays + 1} locked in`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Cashout Execution
  const handleSuccessPayout = (
    amountUsd: number,
    methodTitle: string,
    details: string,
    claimCode?: string
  ) => {
    setUser((prev) => ({
      ...prev,
      balanceUsd: Math.max(0, prev.balanceUsd - amountUsd),
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      type: 'cashout',
      title: `Redeemed ${methodTitle} ($${amountUsd.toFixed(2)})`,
      amountUsd: -amountUsd,
      status: 'completed',
      details,
      paymentMethod: methodTitle,
      claimCode,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Referral: Simulate a friend earning commission
  const handleSimulateReferralEarning = () => {
    sound.playCoin();
    const taskEarnings = 4.80; // friend earned
    const commission = Number((taskEarnings * (referralData.commissionPercentage / 100)).toFixed(2)); // $0.72

    setUser((prev) => ({
      ...prev,
      balanceUsd: prev.balanceUsd + commission,
      lifetimeUsd: prev.lifetimeUsd + commission,
    }));

    setReferralData((prev) => ({
      ...prev,
      totalCommissionEarnedUsd: prev.totalCommissionEarnedUsd + commission,
      referredFriends: prev.referredFriends.map((f, i) =>
        i === 0
          ? {
              ...f,
              totalEarnedByFriendUsd: f.totalEarnedByFriendUsd + taskEarnings,
              commissionEarnedUsd: f.commissionEarnedUsd + commission,
              lastActivity: `Completed Retail Shelf Audit ($${taskEarnings.toFixed(2)})`,
            }
          : f
      ),
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      type: 'referral_commission',
      title: `15% Referral Royalty (jordan_miles)`,
      amountUsd: commission,
      status: 'completed',
      details: `Friend completed $4.80 task · 72 days left in 90d window`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Referral: Claim Welcome Bonus with a code
  const handleClaimWelcomeBonus = (code: string) => {
    if (referralData.hasClaimedWelcomeBonus) {
      return { success: false, message: 'You have already claimed your welcome bonus.' };
    }

    const bonus = referralData.newUserSignupBonusUsd; // $2.00
    setUser((prev) => ({
      ...prev,
      balanceUsd: prev.balanceUsd + bonus,
      lifetimeUsd: prev.lifetimeUsd + bonus,
    }));

    setReferralData((prev) => ({
      ...prev,
      hasClaimedWelcomeBonus: true,
      claimedReferralCode: code,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      type: 'welcome_bonus',
      title: `Welcome Sign-Up Cash Bonus (${code})`,
      amountUsd: bonus,
      status: 'completed',
      details: `Referral invite code verified · +$${bonus.toFixed(2)} instant welcome credit`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Success! $${bonus.toFixed(2)} has been deposited into your wallet balance.`,
    };
  };

  // Today's total earnings
  const todayEarnings = transactions
    .filter((tx) => tx.date.includes('Today') || tx.date.includes('Just now'))
    .reduce((acc, tx) => (tx.amountUsd > 0 ? acc + tx.amountUsd : acc), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top 3-Zone Navigation Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onToggleCurrency={handleToggleCurrency}
        onToggleSound={handleToggleSound}
        onOpenProfile={() => setShowProfile(true)}
        onOpenDailyPoll={() => setShowDailyPoll(true)}
        dailyPollDone={Boolean(dailyPoll.userVotedOptionId)}
      />

      {/* Main Viewport Container (Desktop baseline 1440px max) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Summary Banner */}
        <StatsBanner
          user={user}
          todayEarnings={todayEarnings}
          dailyPoll={dailyPoll}
          onOpenDailyPoll={() => setShowDailyPoll(true)}
          onOpenCashout={() => setCurrentTab('wallet')}
          onOpenReferrals={() => setCurrentTab('referrals')}
        />

        {/* Tab View Routings */}
        {currentTab === 'surveys' && (
          <SurveysView
            surveys={surveys}
            onOpenSurvey={setActiveSurvey}
            currencyMode={user.currencyMode}
          />
        )}

        {currentTab === 'premise' && (
          <PremiseTasksView
            tasks={premiseTasks}
            onOpenTask={setActivePremiseTask}
            currencyMode={user.currencyMode}
          />
        )}

        {currentTab === 'microtasks' && (
          <MicroTasksView
            tasks={digitalTasks}
            onOpenTask={setActiveDigitalTask}
            currencyMode={user.currencyMode}
          />
        )}

        {currentTab === 'offers' && (
          <OfferwallView
            offers={offers}
            onClaimStep={handleClaimOfferStep}
            currencyMode={user.currencyMode}
          />
        )}

        {currentTab === 'referrals' && (
          <ReferralView
            referralData={referralData}
            user={user}
            onSimulateReferralEarning={handleSimulateReferralEarning}
            onClaimWelcomeBonus={handleClaimWelcomeBonus}
          />
        )}

        {currentTab === 'wallet' && (
          <CashoutView
            methods={CASHOUT_METHODS}
            transactions={transactions}
            user={user}
            onSelectMethod={setSelectedCashoutMethod}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView users={leaderboardUsers} />
        )}
      </main>

      {/* Footer (Anti-slop restraint: clean editorial footer without mechanical buzzwords) */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-400">PremisePulse</span>
            <span aria-hidden="true">·</span>
            <span>Market Research & Field Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <span>PayPal, Bank ACH & Gift Card Partners</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">15% Referral Commission (90-Day Window)</span>
          </div>
        </div>
      </footer>

      {/* Active Modals */}
      {activeSurvey && (
        <SurveyModal
          survey={activeSurvey}
          onClose={() => setActiveSurvey(null)}
          onComplete={handleCompleteSurvey}
        />
      )}

      {activePremiseTask && (
        <PremiseTaskModal
          task={activePremiseTask}
          onClose={() => setActivePremiseTask(null)}
          onSubmitTask={handleSubmitPremiseTask}
        />
      )}

      {activeDigitalTask && (
        <DigitalMicroTaskModal
          task={activeDigitalTask}
          onClose={() => setActiveDigitalTask(null)}
          onComplete={handleCompleteDigitalTask}
        />
      )}

      {selectedCashoutMethod && (
        <CashoutModal
          method={selectedCashoutMethod}
          user={user}
          onClose={() => setSelectedCashoutMethod(null)}
          onSuccessPayout={handleSuccessPayout}
        />
      )}

      {showDailyPoll && (
        <DailyPollModal
          poll={dailyPoll}
          onClose={() => setShowDailyPoll(false)}
          onVote={handleVoteDailyPoll}
        />
      )}

      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdateDemographics={(newDemo) =>
            setUser((prev) => ({ ...prev, demographics: newDemo }))
          }
        />
      )}
    </div>
  );
}

export type EarningTab = 'surveys' | 'premise' | 'microtasks' | 'offers' | 'wallet' | 'referrals' | 'leaderboard';

export type MicroTaskType = 'data_entry' | 'image_tagging' | 'usability_feedback';

export interface DataEntryTask {
  documentType: 'Receipt' | 'Business Card' | 'Medical Superbill' | 'Store Shelf Tag';
  documentImageUrl: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    expectedType: 'text' | 'number' | 'date';
    hint?: string;
  }[];
}

export interface ImageTaggingItem {
  id: string;
  imageUrl: string;
  targetCategory: string;
  options: string[];
  description?: string;
}

export interface ImageTaggingTask {
  batchSize: number;
  guidelines: string;
  items: ImageTaggingItem[];
}

export interface UsabilityTask {
  targetUrlName: string;
  companyLogoName: string;
  deviceType: 'Desktop' | 'Mobile Web';
  mockPreviewUrl: string;
  testPrompt: string;
  steps: {
    instruction: string;
    question: string;
    type: 'rating' | 'choice' | 'text';
    options?: string[];
  }[];
}

export interface DigitalMicroTask {
  id: string;
  type: MicroTaskType;
  title: string;
  categoryLabel: string;
  rewardUsd: number;
  estimatedTimeMin: number;
  difficulty: 'Easy' | 'Medium';
  availableUnits: number;
  description: string;
  dataEntryData?: DataEntryTask;
  imageTaggingData?: ImageTaggingTask;
  usabilityData?: UsabilityTask;
}

export interface ReferredUser {
  id: string;
  username: string;
  avatar: string;
  joinedDate: string;
  commissionDaysRemaining: number;
  totalEarnedByFriendUsd: number;
  commissionEarnedUsd: number;
  status: 'active' | 'pending_first_task' | 'completed_window';
  lastActivity: string;
}

export interface ReferralProgramState {
  referralCode: string;
  referralLink: string;
  commissionPercentage: number; // e.g. 15%
  commissionWindowDays: number; // e.g. 90 days
  newUserSignupBonusUsd: number; // e.g. $2.00
  totalReferralsCount: number;
  activeEarnersCount: number;
  totalCommissionEarnedUsd: number;
  hasClaimedWelcomeBonus: boolean;
  claimedReferralCode?: string;
  referredFriends: ReferredUser[];
}

export interface SurveyQuestion {
  id: string;
  type: 'single' | 'multiple' | 'rating' | 'slider' | 'text' | 'screener';
  prompt: string;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  attentionCheck?: boolean;
  requiredAnswer?: string;
}

export interface Survey {
  id: string;
  title: string;
  provider: 'AttaPoll' | 'Dynata' | 'Cint' | 'Ipsos' | 'Prolific' | 'PureSpectrum';
  rewardUsd: number;
  durationMin: number;
  matchScore: number; // 1-100%
  rating: number; // e.g. 4.9
  category: 'Consumer Goods' | 'Tech & AI' | 'Automotive' | 'Food & Beverage' | 'Entertainment' | 'Finance';
  difficulty: 'Quick' | 'Standard' | 'In-Depth';
  description: string;
  totalParticipants: number;
  completed?: boolean;
  questions: SurveyQuestion[];
}

export interface PremiseTask {
  id: string;
  title: string;
  category: 'Retail Shelf Audit' | 'Pharmacy & Health' | 'Infrastructure' | 'Billboard & Ads' | 'Price Check';
  rewardUsd: number;
  locationName: string;
  address: string;
  distanceMiles: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  estimatedTimeMin: number;
  expiresInHours: number;
  urgency: 'high' | 'normal';
  instructions: string[];
  photoPrompt: string;
  priceCheckItem?: string;
  samplePhotoUrl: string;
  status: 'available' | 'in_progress' | 'submitted' | 'approved';
}

export interface OfferStep {
  stepNumber: number;
  title: string;
  rewardUsd: number;
  completed: boolean;
  inProgress?: boolean;
}

export interface OfferwallItem {
  id: string;
  title: string;
  appName: string;
  platform: 'iOS / Android' | 'Android' | 'Desktop / Web' | 'Multi-Platform';
  category: 'Mobile Gaming' | 'Fintech & Banking' | 'Subscription & Trial' | 'Product Testing';
  totalRewardUsd: number;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  badgeText: string;
  description: string;
  imageUrl: string;
  steps: OfferStep[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'survey' | 'premise_task' | 'offerwall' | 'daily_poll' | 'cashout' | 'streak_bonus' | 'referral_commission' | 'welcome_bonus';
  title: string;
  amountUsd: number;
  status: 'completed' | 'pending_review' | 'processing';
  details?: string;
  paymentMethod?: string;
  claimCode?: string;
}

export interface CashoutMethod {
  id: string;
  name: string;
  type: 'paypal' | 'bank' | 'amazon' | 'apple' | 'google_play' | 'steam' | 'starbucks' | 'crypto';
  minAmount: number;
  feePercent: number;
  processingTime: string;
  denominations: number[];
  description: string;
  badge?: string;
}

export interface DailyPoll {
  id: string;
  question: string;
  category: string;
  rewardUsd: number;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  country: string;
  earningsTodayUsd: number;
  tasksDone: number;
  isCurrentUser?: boolean;
}

export interface UserDemographics {
  ageRange: string;
  employment: string;
  householdIncome: string;
  residenceType: string;
  techSavvy: string;
  hasCar: boolean;
  hasPets: boolean;
  zipCode: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  balanceUsd: number;
  pendingUsd: number;
  lifetimeUsd: number;
  currencyMode: 'usd' | 'points'; // 1 USD = 100 points
  streakDays: number;
  lastActiveDate: string;
  soundEnabled: boolean;
  demographics: UserDemographics;
}

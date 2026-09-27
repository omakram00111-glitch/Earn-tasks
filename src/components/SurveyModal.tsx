import React, { useState } from 'react';
import { Survey } from '../types';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  Star, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface SurveyModalProps {
  survey: Survey;
  onClose: () => void;
  onComplete: (surveyId: string, rewardUsd: number) => void;
}

export const SurveyModal: React.FC<SurveyModalProps> = ({
  survey,
  onClose,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = survey.questions[currentStepIndex];
  const totalQuestions = survey.questions.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalQuestions) * 100);

  const handleSingleSelect = (val: string) => {
    sound.playClick();
    setAnswers({ ...answers, [currentQ.id]: val });
    setErrorNotice(null);
  };

  const handleMultipleToggle = (val: string) => {
    sound.playClick();
    const existing = (answers[currentQ.id] as string[]) || [];
    let updated: string[];
    if (existing.includes(val)) {
      updated = existing.filter((item) => item !== val);
    } else {
      updated = [...existing, val];
    }
    setAnswers({ ...answers, [currentQ.id]: updated });
    setErrorNotice(null);
  };

  const handleRatingSelect = (val: number) => {
    sound.playClick();
    setAnswers({ ...answers, [currentQ.id]: val });
    setErrorNotice(null);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [currentQ.id]: Number(e.target.value) });
    setErrorNotice(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [currentQ.id]: e.target.value });
    setErrorNotice(null);
  };

  const handleNext = () => {
    // Validate current step
    const currentVal = answers[currentQ.id];
    if (currentVal === undefined || currentVal === '' || (Array.isArray(currentVal) && currentVal.length === 0)) {
      setErrorNotice('Please provide an answer before continuing.');
      return;
    }

    // Attention check check
    if (currentQ.attentionCheck && currentQ.requiredAnswer) {
      if (currentVal !== currentQ.requiredAnswer) {
        setErrorNotice('Quality check failed: Please read questions attentively to maintain qualification.');
        return;
      }
    }

    if (currentStepIndex < totalQuestions - 1) {
      sound.playClick();
      setCurrentStepIndex(currentStepIndex + 1);
      setErrorNotice(null);
    } else {
      // Completed!
      sound.playCashout();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
      setIsFinished(true);
      setTimeout(() => {
        onComplete(survey.id, survey.rewardUsd);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      sound.playClick();
      setCurrentStepIndex(currentStepIndex - 1);
      setErrorNotice(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">{survey.provider} Partner</span>
              <span aria-hidden="true">·</span>
              <span>{survey.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-400 font-semibold">+${survey.rewardUsd.toFixed(2)}</span>
            </div>
            <h2 className="text-base font-semibold text-white truncate max-w-md mt-0.5">
              {survey.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isFinished ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-white">Survey Completed!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you for your market insights. Your response passed validation and{' '}
                <strong className="text-emerald-400 font-mono">+${survey.rewardUsd.toFixed(2)}</strong> has been credited to your balance.
              </p>
              <div className="text-xs text-slate-500 font-mono">
                Crediting wallet ledger...
              </div>
            </div>
          ) : (
            <>
              {/* Question Index Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">
                  Question {currentStepIndex + 1} of {totalQuestions}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Est. {Math.max(1, survey.durationMin - currentStepIndex)} min remaining</span>
                </span>
              </div>

              {/* Question Prompt */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white leading-snug">
                  {currentQ.prompt}
                </h3>
                {currentQ.description && (
                  <p className="text-xs text-slate-400">{currentQ.description}</p>
                )}
              </div>

              {/* Question Interactive Controls */}
              <div className="space-y-3 pt-2">
                {/* Single Choice or Screener */}
                {(currentQ.type === 'single' || currentQ.type === 'screener') && currentQ.options && (
                  <div className="space-y-2">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = answers[currentQ.id] === opt;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSingleSelect(opt)}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-medium'
                              : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60'
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-slate-950"></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Multiple Choice */}
                {currentQ.type === 'multiple' && currentQ.options && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 mb-1">Select all that apply:</p>
                    {currentQ.options.map((opt, idx) => {
                      const selectedList = (answers[currentQ.id] as string[]) || [];
                      const isSelected = selectedList.includes(opt);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleMultipleToggle(opt)}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-medium'
                              : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60'
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`h-4 w-4 rounded border flex items-center justify-center ${
                              isSelected ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Rating Scale (1-5) */}
                {currentQ.type === 'rating' && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const isSelected = answers[currentQ.id] === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleRatingSelect(val)}
                            className={`h-14 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-md'
                                : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-base font-mono">{val}</span>
                            <Star className={`h-3.5 w-3.5 ${isSelected ? 'fill-emerald-400 text-emerald-400' : 'text-slate-600'}`} />
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 px-1">
                      <span>{currentQ.minLabel || 'Lowest'}</span>
                      <span>{currentQ.maxLabel || 'Highest'}</span>
                    </div>
                  </div>
                )}

                {/* Slider */}
                {currentQ.type === 'slider' && (
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center text-sm font-mono text-emerald-400">
                      <span>Selected value:</span>
                      <span className="text-lg font-bold">
                        ${answers[currentQ.id] ?? Math.round(((currentQ.max || 50) + (currentQ.min || 5)) / 2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={currentQ.min || 5}
                      max={currentQ.max || 50}
                      step={1}
                      value={answers[currentQ.id] ?? Math.round(((currentQ.max || 50) + (currentQ.min || 5)) / 2)}
                      onChange={handleSliderChange}
                      className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>${currentQ.min || 5}</span>
                      <span>${currentQ.max || 50}</span>
                    </div>
                  </div>
                )}

                {/* Open Text Feedback */}
                {currentQ.type === 'text' && (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      placeholder="Type your authentic thoughts or suggestions here..."
                      value={answers[currentQ.id] || ''}
                      onChange={handleTextChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-slate-500">
                      Your candid feedback will be shared anonymously with the market research team.
                    </p>
                  </div>
                )}

                {/* Error Notice */}
                {errorNotice && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{errorNotice}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Actions */}
        {!isFinished && (
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentStepIndex === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 hidden sm:inline flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Guaranteed Qualification
              </span>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-md"
              >
                <span>{currentStepIndex === totalQuestions - 1 ? 'Submit & Claim Reward' : 'Continue'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

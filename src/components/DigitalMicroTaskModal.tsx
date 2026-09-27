import React, { useState } from 'react';
import { DigitalMicroTask } from '../types';
import { 
  X, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Tag, 
  Monitor, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  Star,
  ExternalLink,
  ZoomIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface DigitalMicroTaskModalProps {
  task: DigitalMicroTask;
  onClose: () => void;
  onComplete: (taskId: string, rewardUsd: number) => void;
}

export const DigitalMicroTaskModal: React.FC<DigitalMicroTaskModalProps> = ({
  task,
  onClose,
  onComplete,
}) => {
  // State for Data Entry
  const [dataEntryInputs, setDataEntryInputs] = useState<Record<string, string>>({
    merchant: 'Whole Foods Market',
    date: '2026-09-24',
    subtotal: '24.50',
    tax: '2.14',
    total: '26.64',
    fullName: 'Dr. Jordan Vance',
    company: 'Apex BioTech Solutions',
    jobTitle: 'Director of Clinical Operations',
    email: 'jordan.vance@apexbio.org',
    phone: '+1 (415) 555-8921',
  });

  // State for Image Tagging
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [taggedSelections, setTaggedSelections] = useState<Record<string, string>>({});

  // State for Usability Feedback
  const [activeUxStep, setActiveUxStep] = useState(0);
  const [uxAnswers, setUxAnswers] = useState<Record<number, any>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFinishTask = () => {
    sound.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      sound.playCashout();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onComplete(task.id, task.rewardUsd);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">{task.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>Est. {task.estimatedTimeMin} min</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-400 font-semibold">+${task.rewardUsd.toFixed(2)}</span>
            </div>
            <h2 className="text-base font-semibold text-white truncate max-w-lg mt-0.5">
              {task.title}
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isCompleted ? (
            <div className="py-12 text-center space-y-3">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Micro-Task Approved!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Your submission passed automated verification. <strong className="text-emerald-400 font-mono">+${task.rewardUsd.toFixed(2)}</strong> has been added to your wallet!
              </p>
            </div>
          ) : (
            <>
              {/* TYPE 1: DATA ENTRY */}
              {task.type === 'data_entry' && task.dataEntryData && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Scanned Document Preview */}
                  <div className="md:col-span-5 rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium text-slate-200">
                        Scanned {task.dataEntryData.documentType}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <ZoomIn className="h-3 w-3" />
                        High-Res Scan
                      </span>
                    </div>

                    <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-[3/4] flex items-center justify-center">
                      <img
                        src={task.dataEntryData.documentImageUrl}
                        alt="Scanned Document"
                        className="w-full h-full object-cover filter contrast-125"
                      />
                      <div className="absolute inset-x-2 bottom-2 bg-slate-950/80 backdrop-blur-sm p-2 rounded text-[10px] text-slate-300">
                        <strong>Quality Tip:</strong> Ensure totals match the slip including sales tax.
                      </div>
                    </div>
                  </div>

                  {/* Form Entry Fields */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        Transcription Input Form
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Verify and type the exact printed text from the document.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {task.dataEntryData.fields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                            <span>{field.label}</span>
                            {field.hint && (
                              <span className="text-[10px] text-slate-500">{field.hint}</span>
                            )}
                          </label>
                          <input
                            type={field.expectedType === 'number' ? 'text' : field.expectedType}
                            placeholder={field.placeholder}
                            value={dataEntryInputs[field.key] || ''}
                            onChange={(e) =>
                              setDataEntryInputs({
                                ...dataEntryInputs,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE 2: IMAGE TAGGING & CATEGORIZATION */}
              {task.type === 'image_tagging' && task.imageTaggingData && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Tag className="h-4 w-4" />
                      <span>Item {activeTagIndex + 1} of {task.imageTaggingData.items.length}</span>
                    </span>
                    <span>{task.imageTaggingData.guidelines}</span>
                  </div>

                  {(() => {
                    const currentItem = task.imageTaggingData.items[activeTagIndex];
                    if (!currentItem) return null;
                    const selectedTag = taggedSelections[currentItem.id];

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Target Image to tag */}
                        <div className="md:col-span-6 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden aspect-video relative">
                          <img
                            src={currentItem.imageUrl}
                            alt="Subject to categorize"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400">
                            Frame #{activeTagIndex + 1}
                          </div>
                        </div>

                        {/* Tag Selection Options */}
                        <div className="md:col-span-6 space-y-3">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white">
                              {currentItem.description || 'Select Primary Classification:'}
                            </h4>
                            <p className="text-xs text-slate-400">
                              Choose the single best category matching the image.
                            </p>
                          </div>

                          <div className="space-y-2">
                            {currentItem.options.map((opt) => {
                              const isChosen = selectedTag === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    sound.playClick();
                                    setTaggedSelections({
                                      ...taggedSelections,
                                      [currentItem.id]: opt,
                                    });
                                  }}
                                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                                    isChosen
                                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <span
                                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                      isChosen ? 'border-emerald-400 bg-emerald-400' : 'border-slate-700'
                                    }`}
                                  >
                                    {isChosen && <span className="h-1.5 w-1.5 rounded-full bg-slate-950"></span>}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Navigation between batch items */}
                          <div className="flex items-center justify-between pt-2">
                            <button
                              onClick={() => { sound.playClick(); setActiveTagIndex(Math.max(0, activeTagIndex - 1)); }}
                              disabled={activeTagIndex === 0}
                              className={`text-xs ${activeTagIndex === 0 ? 'text-slate-600' : 'text-slate-400 hover:text-white'}`}
                            >
                              &larr; Previous Frame
                            </button>
                            <span className="text-xs text-slate-500 font-mono">
                              {Object.keys(taggedSelections).length} / {task.imageTaggingData.items.length} tagged
                            </span>
                            <button
                              onClick={() => {
                                sound.playClick();
                                setActiveTagIndex(Math.min(task.imageTaggingData!.items.length - 1, activeTagIndex + 1));
                              }}
                              disabled={activeTagIndex === task.imageTaggingData.items.length - 1}
                              className={`text-xs ${
                                activeTagIndex === task.imageTaggingData.items.length - 1
                                  ? 'text-slate-600'
                                  : 'text-emerald-400 hover:text-emerald-300'
                              }`}
                            >
                              Next Frame &rarr;
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TYPE 3: USABILITY FEEDBACK & PROTOTYPE REVIEW */}
              {task.type === 'usability_feedback' && task.usabilityData && (
                <div className="space-y-5">
                  {/* Context Bar */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Testing Website:</span>{' '}
                      <span className="font-semibold text-white">{task.usabilityData.companyLogoName}</span>
                    </div>
                    <span className="font-mono text-emerald-400 flex items-center gap-1">
                      <Monitor className="h-3.5 w-3.5" />
                      <span>{task.usabilityData.deviceType} Mode</span>
                    </span>
                  </div>

                  {/* Simulated Prototype Frame */}
                  <div className="rounded-xl border border-slate-700 bg-slate-950 overflow-hidden shadow-md">
                    <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70"></span>
                        <span className="ml-2 font-mono text-slate-300">{task.usabilityData.targetUrlName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">Active Interactive Test</span>
                    </div>

                    <div className="relative aspect-[16/9] w-full bg-slate-950">
                      <img
                        src={task.usabilityData.mockPreviewUrl}
                        alt="Test Prototype"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-700 backdrop-blur-md max-w-lg">
                          <span className="text-[10px] text-amber-400 font-semibold block uppercase">
                            User Scenario Prompt:
                          </span>
                          <p className="text-xs text-slate-200 mt-0.5">
                            {task.usabilityData.testPrompt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UX Step Question */}
                  {(() => {
                    const step = task.usabilityData.steps[activeUxStep];
                    if (!step) return null;

                    return (
                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="text-emerald-400 font-semibold">
                            Evaluation Step {activeUxStep + 1} of {task.usabilityData.steps.length}
                          </span>
                          <span>{step.instruction}</span>
                        </div>

                        <h4 className="text-sm font-bold text-white">{step.question}</h4>

                        {/* Rating */}
                        {step.type === 'rating' && (
                          <div className="flex items-center gap-3 pt-2">
                            {[1, 2, 3, 4, 5].map((val) => {
                              const isPicked = uxAnswers[activeUxStep] === val;
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => {
                                    sound.playClick();
                                    setUxAnswers({ ...uxAnswers, [activeUxStep]: val });
                                  }}
                                  className={`h-11 w-11 rounded-lg border text-sm font-mono font-bold transition-all ${
                                    isPicked
                                      ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                            <span className="text-xs text-slate-400 ml-2">1 = Low / 5 = Very High</span>
                          </div>
                        )}

                        {/* Choice */}
                        {step.type === 'choice' && step.options && (
                          <div className="space-y-2 pt-1">
                            {step.options.map((opt) => {
                              const isPicked = uxAnswers[activeUxStep] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    sound.playClick();
                                    setUxAnswers({ ...uxAnswers, [activeUxStep]: opt });
                                  }}
                                  className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                                    isPicked
                                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-medium'
                                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Text */}
                        {step.type === 'text' && (
                          <textarea
                            rows={3}
                            placeholder="Provide your specific thoughts or feedback here..."
                            value={uxAnswers[activeUxStep] || ''}
                            onChange={(e) =>
                              setUxAnswers({ ...uxAnswers, [activeUxStep]: e.target.value })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <button
                            onClick={() => setActiveUxStep(Math.max(0, activeUxStep - 1))}
                            disabled={activeUxStep === 0}
                            className={`text-xs ${activeUxStep === 0 ? 'text-slate-600' : 'text-slate-400 hover:text-white'}`}
                          >
                            &larr; Previous Step
                          </button>
                          {activeUxStep < task.usabilityData.steps.length - 1 && (
                            <button
                              onClick={() => {
                                sound.playClick();
                                setActiveUxStep(activeUxStep + 1);
                              }}
                              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                            >
                              Next Step &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isCompleted && (
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Instant AI Quality Check</span>
            </div>

            <button
              onClick={handleFinishTask}
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>{isSubmitting ? 'Validating Entry...' : 'Submit & Claim Reward'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

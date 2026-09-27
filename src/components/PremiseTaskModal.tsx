import React, { useState, useRef } from 'react';
import { PremiseTask } from '../types';
import { 
  X, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  RefreshCw, 
  Eye, 
  Upload, 
  ShieldCheck, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface PremiseTaskModalProps {
  task: PremiseTask;
  onClose: () => void;
  onSubmitTask: (taskId: string, rewardUsd: number) => void;
}

export const PremiseTaskModal: React.FC<PremiseTaskModalProps> = ({
  task,
  onClose,
  onSubmitTask,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Photo state
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Form state
  const [stockStatus, setStockStatus] = useState<string>('in_stock');
  const [inputPrice, setInputPrice] = useState<string>('4.99');
  const [conditionNotes, setConditionNotes] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState(false);

  // GPS Simulation
  const handleVerifyGps = () => {
    sound.playClick();
    setGpsLoading(true);
    setTimeout(() => {
      setGpsLoading(false);
      setGpsVerified(true);
      sound.playSuccess();
    }, 1200);
  };

  // Camera start
  const handleStartCamera = async () => {
    try {
      setCameraActive(true);
      sound.playClick();
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch {
      // Fallback if camera unavailable or denied in iframe
      setCameraActive(false);
      setCapturedPhotoUrl(task.samplePhotoUrl);
    }
  };

  const handleCapturePhoto = () => {
    sound.playClick();
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setCapturedPhotoUrl(task.samplePhotoUrl);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
      sound.playSuccess();
    }, 400);
  };

  const handleUsePresetPhoto = () => {
    sound.playClick();
    setCapturedPhotoUrl(task.samplePhotoUrl);
    sound.playSuccess();
  };

  // Final verification pipeline
  const handleSubmitReview = () => {
    sound.playClick();
    setCurrentStep(4);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationPassed(true);
      sound.playCashout();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onSubmitTask(task.id, task.rewardUsd);
      }, 1600);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">{task.category}</span>
              <span aria-hidden="true">·</span>
              <span>{task.distanceMiles} mi away</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-400 font-semibold">+${task.rewardUsd.toFixed(2)}</span>
            </div>
            <h2 className="text-base font-semibold text-white truncate max-w-md mt-0.5">
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

        {/* Step Indicator */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950 text-xs font-medium text-slate-400">
          <div className={`py-2 px-3 text-center border-b-2 ${currentStep >= 1 ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-600'}`}>
            1. GPS Lock
          </div>
          <div className={`py-2 px-3 text-center border-b-2 ${currentStep >= 2 ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-600'}`}>
            2. Photo Capture
          </div>
          <div className={`py-2 px-3 text-center border-b-2 ${currentStep >= 3 ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-600'}`}>
            3. Price & Data
          </div>
          <div className={`py-2 px-3 text-center border-b-2 ${currentStep >= 4 ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-600'}`}>
            4. Verification
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: GPS Lock */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Target Venue</span>
                  <span className="text-xs font-mono text-emerald-400">{task.distanceMiles} miles from you</span>
                </div>
                <h3 className="text-base font-bold text-white">{task.locationName}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{task.address}</span>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Field Instructions:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {task.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Geolocation Verification Box */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-slate-800 text-emerald-400">
                  <Compass className={`h-8 w-8 ${gpsLoading ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {gpsVerified ? 'Location Verified Within 25m' : 'Verify Physical Location'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Premise tasks require on-site presence. Click below to confirm you are within range.
                  </p>
                </div>

                {gpsVerified ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>GPS Coordinates Confirmed</span>
                  </div>
                ) : (
                  <button
                    onClick={handleVerifyGps}
                    disabled={gpsLoading}
                    className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    {gpsLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    <span>Confirm On-Site Presence (Simulate GPS)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Photo Capture */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <strong>Photo Requirement:</strong> {task.photoPrompt}
              </div>

              {/* Viewfinder or Preview Box */}
              <div className="relative rounded-xl border border-slate-700 bg-black aspect-video overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder reticle overlay */}
                    <div className="absolute inset-8 border border-white/40 rounded-lg pointer-events-none flex items-center justify-center">
                      <span className="text-[10px] text-white/70 bg-black/60 px-2 py-0.5 rounded">
                        Align shelf tag & items inside frame
                      </span>
                    </div>
                  </div>
                ) : capturedPhotoUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={capturedPhotoUrl}
                      alt="Captured Audit"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/75 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>EXIF Geo-tag & Timestamp Locked</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Camera className="h-10 w-10 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">
                      Camera inactive. Click below to launch shutter or use high-resolution field audit sample.
                    </p>
                  </div>
                )}
              </div>

              {/* Camera Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {cameraActive ? (
                  <button
                    onClick={handleCapturePhoto}
                    disabled={isCapturing}
                    className="py-2.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                    <span>{isCapturing ? 'Capturing...' : 'Capture Photo Now'}</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleStartCamera}
                      className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <Camera className="h-4 w-4 text-emerald-400" />
                      <span>Open Device Camera</span>
                    </button>
                    <button
                      onClick={handleUsePresetPhoto}
                      className="py-2.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Use Authenticated Store Audit Photo</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Price & Data Entry */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Item Inventory & Stock Verification</span>
                  <span className="text-xs font-mono text-emerald-400">{task.priceCheckItem || 'General Audit'}</span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Availability Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setStockStatus('in_stock')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        stockStatus === 'in_stock'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      In Stock (Full)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockStatus('low_stock')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        stockStatus === 'low_stock'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      Low Stock (&lt;3 items)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockStatus('out_of_stock')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        stockStatus === 'out_of_stock'
                          ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      Out of Stock
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Displayed Shelf Tag Retail Price ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={inputPrice}
                      onChange={(e) => setInputPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Auditor Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Price tag was freshly printed, promotional discount advertised on shelf."
                    value={conditionNotes}
                    onChange={(e) => setConditionNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Verification in progress or approved */}
          {currentStep === 4 && (
            <div className="py-8 text-center space-y-4">
              {isVerifying ? (
                <div className="space-y-3">
                  <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <RefreshCw className="h-10 w-10 animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Running Automated Quality Review...</h3>
                  <div className="text-xs text-slate-400 max-w-sm mx-auto space-y-1">
                    <p>✓ Checking GPS proximity to {task.locationName}</p>
                    <p>✓ Validating image focus & shelf tag visibility</p>
                    <p>✓ Cross-referencing price report against regional benchmark</p>
                  </div>
                </div>
              ) : verificationPassed ? (
                <div className="space-y-3">
                  <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Field Audit Approved!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Outstanding job. High-precision intelligence has been verified and{' '}
                    <strong className="text-emerald-400 font-mono">+${task.rewardUsd.toFixed(2)}</strong> has been credited to your balance!
                  </p>
                  <span className="text-xs text-slate-500 font-mono">Writing to transaction ledger...</span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((currentStep - 1) as 1 | 2 | 3)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep === 1 && (
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!gpsVerified}
                className={`py-2 px-5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  gpsVerified
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>Continue to Photo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!capturedPhotoUrl}
                className={`py-2 px-5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  capturedPhotoUrl
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>Continue to Price Check</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                onClick={handleSubmitReview}
                className="py-2 px-5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>Submit & Run Verification</span>
                <ShieldCheck className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

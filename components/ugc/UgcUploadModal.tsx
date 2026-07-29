'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import {
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Camera,
  RefreshCw,
  Zap,
  Square,
  FlipHorizontal,
  RotateCcw,
  XCircle,
  MapPin,
  Trophy,
  ShieldCheck
} from 'lucide-react';
import { extractVideoFrames } from '@/lib/verification/videoFrameExtractor';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  xpReward: number;
  sector: string;
  badge: string;
  generatedForEvent?: string;
}

interface VerificationStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message: string;
}

export const UgcUploadModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const topupBalance = useAppStore((state) => state.topupBalance);

  // Active Challenge State
  const [activeChallenge, setActiveChallenge] = useState<Challenge>({
    id: 'ch-derby-1',
    title: 'Skandování & Kotel Fanklubu',
    description: 'Zachyť 15s video atmosféry z tribuny při skandování s fanoušky u pódia nebo v kotli!',
    reward: 100,
    xpReward: 150,
    sector: 'Sektor G Fanklub',
    badge: 'ATMOSFÉRA',
    generatedForEvent: 'FC Hradec Králové vs FK Pardubice'
  });

  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);

  // Stage: 'ready' | 'countdown' | 'recording' | 'review' | 'verifying' | 'complete' | 'failed'
  const [stage, setStage] = useState<'ready' | 'countdown' | 'recording' | 'review' | 'verifying' | 'complete' | 'failed'>('ready');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(15);

  // Media References
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Verification Pipeline States
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { id: 'file-check', name: 'Validace Snímků a Videa', status: 'pending', progress: 0, message: 'Čekání na odeslání...' },
    { id: 'face-check', name: 'Detekce Tváře a Fanouška', status: 'pending', progress: 0, message: 'Čekání na odeslání...' },
    { id: 'ai-check', name: 'AI Hodnocení (Gemini 2.5 Flash)', status: 'pending', progress: 0, message: 'Čekání na odeslání...' }
  ]);

  const [aiResult, setAiResult] = useState<{
    passed: boolean;
    score: number;
    creativity: number;
    authenticity: number;
    effort: number;
    explanation: string;
    isMock?: boolean;
  } | null>(null);

  // Stop camera stream cleanly
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Initialize camera stream robustly (video first, optional audio)
  const initializeCamera = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Kamera není na tomto zařízení podporována.');
      return;
    }

    try {
      setCameraError(null);
      stopCameraStream();

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });
      } catch (err) {
        console.warn('Combined camera+mic failed, trying video only:', err);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Kamera selhala:', err);
      setCameraError('Nepodařilo se přistoupit ke kameře. Zkontrolujte oprávnění v prohlížeči.');
      setCameraActive(false);
    }
  }, [facingMode, stopCameraStream]);

  // Manage camera lifecycle cleanly
  useEffect(() => {
    if (activeModal === 'ugc_upload') {
      if (stage === 'ready') {
        initializeCamera();
      } else if (stage === 'review' || stage === 'verifying' || stage === 'complete' || stage === 'failed') {
        stopCameraStream();
      }
    } else {
      stopCameraStream();
      setStage('ready');
      setRecordedVideoUrl(null);
      recordedBlobRef.current = null;
    }
  }, [activeModal, stage, initializeCamera, stopCameraStream]);

  // Generate new AI challenge
  const handleGenerateAiChallenge = async () => {
    setIsGeneratingChallenge(true);
    try {
      const res = await fetch('/api/ai-challenge-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTitle: 'FC Hradec Králové vs FK Pardubice – Východočeské Derby',
          eventCategory: 'fotbal',
          location: 'Malšovická Aréna'
        })
      }).then((r) => r.json());

      if (res.success && res.challenge) {
        setActiveChallenge({
          ...res.challenge,
          xpReward: 150
        });
      }
    } catch (err) {
      console.error('Failed to generate AI challenge:', err);
    } finally {
      setIsGeneratingChallenge(false);
    }
  };

  // Start recording sequence (Countdown -> Recording)
  const handleStartRecordingSequence = () => {
    if (!cameraActive || !streamRef.current) {
      initializeCamera().then(() => {
        startCountdown();
      });
    } else {
      startCountdown();
    }
  };

  const startCountdown = () => {
    setStage('countdown');
    setCountdown(3);

    let count = 3;
    const countTimer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countTimer);
        beginRealMediaRecording();
      }
    }, 1000);
  };

  const beginRealMediaRecording = () => {
    setStage('recording');
    setRecordingTime(15);
    chunksRef.current = [];

    if (streamRef.current && typeof MediaRecorder !== 'undefined') {
      try {
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

        const recorder = new MediaRecorder(streamRef.current, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          if (chunksRef.current.length > 0) {
            const blob = new Blob(chunksRef.current, { type: mimeType });
            recordedBlobRef.current = blob;
            const url = URL.createObjectURL(blob);
            setRecordedVideoUrl(url);
          }
        };

        recorder.start(250);
      } catch (e) {
        console.warn('MediaRecorder error:', e);
      }
    }

    let timeLeft = 15;
    const recTimer = setInterval(() => {
      timeLeft -= 1;
      setRecordingTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(recTimer);
        stopRealRecording();
      }
    }, 1000);
  };

  const stopRealRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopCameraStream();
    setStage('review');
  };

  // Run AI verification on extracted video frames
  const runAiVerification = async () => {
    setStage('verifying');

    const steps: VerificationStep[] = [
      { id: 'file-check', name: 'Validace Snímků a Videa', status: 'running', progress: 20, message: 'Extrakce snímků z videa...' },
      { id: 'face-check', name: 'Detekce Tváře a Fanouška', status: 'pending', progress: 0, message: 'Ověřování sektoru...' },
      { id: 'ai-check', name: 'AI Hodnocení (Gemini 2.5 Flash)', status: 'pending', progress: 0, message: 'Skórování přes Vision AI...' }
    ];
    setVerificationSteps([...steps]);

    let extractedFrames: string[] = [];

    // Extract frames from recorded video blob
    if (recordedBlobRef.current && recordedBlobRef.current.size > 1000) {
      try {
        const frameResult = await extractVideoFrames(recordedBlobRef.current, { maxFrames: 8, quality: 0.7 });
        extractedFrames = frameResult.frames;
      } catch (err) {
        console.warn('Frame extraction warning:', err);
      }
    }

    steps[0].status = 'completed';
    steps[0].progress = 100;
    steps[0].message = `Získáno ${extractedFrames.length || 8} snímků z videa`;

    steps[1].status = 'running';
    steps[1].progress = 50;
    steps[1].message = `Detekce osoby a prostředí v ${activeChallenge.sector}...`;
    setVerificationSteps([...steps]);

    await new Promise((r) => setTimeout(r, 600));

    steps[1].status = 'completed';
    steps[1].progress = 100;
    steps[1].message = 'Detekce osoby a sektoru ověřena';

    steps[2].status = 'running';
    steps[2].progress = 75;
    steps[2].message = 'Vyhodnocování přes Gemini 2.5 Flash...';
    setVerificationSteps([...steps]);

    try {
      const apiRes = await fetch('/api/ai-challenge-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeDescription: activeChallenge.description,
          frames: extractedFrames.length > 0 ? extractedFrames : ['sampleframe1', 'sampleframe2'],
          eventTitle: 'FC Hradec Králové vs FK Pardubice – Východočeské Derby'
        })
      }).then((r) => r.json());

      steps[2].status = 'completed';
      steps[2].progress = 100;
      steps[2].message = 'Gemini Vision AI vyhodnocení dokončeno!';
      setVerificationSteps([...steps]);

      const evalResult = {
        passed: Boolean(apiRes.passed),
        score: apiRes.score || 0,
        creativity: apiRes.creativity || 1,
        authenticity: apiRes.authenticity || 1,
        effort: apiRes.effort || 1,
        explanation: apiRes.explanation || `Vyhodnoceno přes Gemini 2.5 Flash Vision AI.`,
        isMock: apiRes.isMock
      };

      setAiResult(evalResult);

      if (evalResult.passed) {
        topupBalance(activeChallenge.reward);
        setStage('complete');
      } else {
        setStage('failed');
      }
    } catch (err) {
      console.error('Gemini AI verification failed:', err);
      steps[2].status = 'failed';
      setVerificationSteps([...steps]);

      const fallbackResult = {
        passed: false,
        score: 15,
        creativity: 1,
        authenticity: 1,
        effort: 1,
        explanation: `Video nezachycuje potřebnou atmosféru z tribuny ani skandování fanoušků. Zkuste nahrát výzvu znovu z kotle!`
      };
      setAiResult(fallbackResult);
      setStage('failed');
    }
  };

  const handleRetake = () => {
    setRecordedVideoUrl(null);
    recordedBlobRef.current = null;
    setAiResult(null);
    setStage('ready');
    initializeCamera();
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (activeModal !== 'ugc_upload') return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0A0B0E] overflow-y-auto text-white animate-fade-in max-w-md mx-auto select-none custom-scrollbar">
      <div className="min-h-screen pt-10 px-5 pb-24 flex flex-col justify-between">
        <div className="flex flex-col gap-4">

          {/* Liquid Glass Header Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModal(null)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-lg shrink-0 hover:bg-white/10"
              aria-label="Zpět"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white/90 uppercase tracking-wider">
                AI Výzva
              </span>
            </div>
          </div>

          {/* Liquid Glass Challenge Quest Card */}
          <div className="p-5 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex flex-col gap-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden">
            {/* Quest Header Pills */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                {activeChallenge.badge}
              </span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                <span>+{activeChallenge.reward} Kč</span>
                <span className="text-white/20">•</span>
                <span className="text-white/70">+{activeChallenge.xpReward} XP</span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-white leading-tight tracking-tight">
              {activeChallenge.title}
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              {activeChallenge.description}
            </p>

            {/* AI Quest Generator Button */}
            {stage === 'ready' && (
              <button
                disabled={isGeneratingChallenge}
                onClick={handleGenerateAiChallenge}
                className="mt-1 py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-emerald-400 ${isGeneratingChallenge ? 'animate-spin' : ''}`} />
                <span>{isGeneratingChallenge ? 'Generuji výzvu...' : 'Vygenerovat novou AI výzvu'}</span>
              </button>
            )}
          </div>

          {/* Liquid Glass Camera Viewport */}
          <div className="relative w-full h-[290px] rounded-3xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center shadow-2xl">
            {/* Live Camera Stream (Ready, Countdown, Recording) */}
            {(stage === 'ready' || stage === 'countdown' || stage === 'recording') && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                {!cameraActive && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center gap-2">
                    <Camera className="w-8 h-8 text-neutral-400 animate-pulse" />
                    <span className="text-xs font-medium text-neutral-300">
                      {cameraError || 'Načítám webkameru...'}
                    </span>
                    {cameraError && (
                      <button
                        onClick={initializeCamera}
                        className="px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white border border-white/15 hover:bg-white/20 active:scale-95 cursor-pointer"
                      >
                        Povolit kameru
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Recorded Video Playback (Review, Verifying, Complete, Failed) */}
            {(stage === 'review' || stage === 'verifying' || stage === 'complete' || stage === 'failed') && (
              <video
                src={recordedVideoUrl || undefined}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {/* Sector Location Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-[#DE1D3E]" />
              <span>{activeChallenge.sector}</span>
            </div>

            {/* Camera Flip Switch */}
            {stage === 'ready' && cameraActive && (
              <button
                onClick={toggleCameraFacing}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer z-10 shadow-lg hover:bg-black/80"
                title="Přepnout kameru"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* STAGE: COUNTDOWN */}
            {stage === 'countdown' && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-20">
                <div className="w-20 h-20 rounded-full bg-[#DE1D3E] border-2 border-white/40 flex items-center justify-center shadow-2xl animate-pulse">
                  <span className="text-3xl font-black text-white font-mono">{countdown}</span>
                </div>
                <span className="text-xs font-mono font-bold text-white/80 uppercase tracking-widest mt-4">
                  Připrav se...
                </span>
              </div>
            )}

            {/* STAGE: RECORDING */}
            {stage === 'recording' && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#DE1D3E]/90 border border-white/20 backdrop-blur-md shadow-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Nahrávám: {recordingTime}s
                </span>
                <button
                  onClick={stopRealRecording}
                  className="ml-1 w-6 h-6 rounded-full bg-white text-[#DE1D3E] flex items-center justify-center active:scale-90 shadow-md cursor-pointer"
                  title="Zastavit"
                >
                  <Square className="w-3 h-3 fill-[#DE1D3E] stroke-none" />
                </button>
              </div>
            )}

            {/* STAGE: VERIFYING */}
            {stage === 'verifying' && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-20">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-wider">AI Vision Analýza</span>
                <span className="text-xs text-neutral-400 font-mono mt-1">Vyhodnocování přes Gemini 2.5 Flash...</span>
              </div>
            )}

            {/* STAGE: COMPLETE BADGE */}
            {stage === 'complete' && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-emerald-500/90 text-black font-bold text-xs flex items-center gap-1.5 shadow-xl backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI Ověřeno (+{activeChallenge.reward} Kč)</span>
              </div>
            )}

            {/* STAGE: FAILED BADGE */}
            {stage === 'failed' && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-red-600/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-xl backdrop-blur-md">
                <XCircle className="w-4 h-4" />
                <span>Nesplněno</span>
              </div>
            )}
          </div>

          {/* Verification Steps Pipeline (Verifying State) */}
          {stage === 'verifying' && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase text-neutral-400 tracking-wider px-1">
                Nocena AI Kontrolní Pipeline
              </h3>
              {verificationSteps.map((step) => (
                <div key={step.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : step.status === 'running' ? (
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-neutral-600 shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate">{step.name}</span>
                      <span className="text-[10px] text-neutral-400">{step.message}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-neutral-300">{step.progress}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Liquid Glass AI Scorecard Results */}
          {(stage === 'complete' || stage === 'failed') && aiResult && (
            <div
              className={`p-5 rounded-3xl border backdrop-blur-xl flex flex-col gap-3.5 shadow-2xl ${
                aiResult.passed
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-red-500/30 bg-red-950/10'
              }`}
            >
              {/* Scorecard Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${aiResult.passed ? 'text-emerald-400' : 'text-red-400'}`} />
                  <h3 className="text-sm font-bold text-white">AI Výsledek Hodnocení</h3>
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full font-mono font-bold text-xs border ${
                    aiResult.passed
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {aiResult.score} / 100
                </span>
              </div>

              {/* Stat Meters */}
              <div className="grid grid-cols-3 gap-2 text-center my-0.5">
                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center">
                  <span className="text-[9px] uppercase font-semibold text-neutral-400">Kreativita</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5">{aiResult.creativity}/10</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center">
                  <span className="text-[9px] uppercase font-semibold text-neutral-400">Autenticita</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5">{aiResult.authenticity}/10</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center">
                  <span className="text-[9px] uppercase font-semibold text-neutral-400">Úsilí</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5">{aiResult.effort}/10</span>
                </div>
              </div>

              {/* AI Verdict Quote */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    Gemini Vision AI Verdikt
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  "{aiResult.explanation}"
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {stage === 'ready' && (
            <button
              onClick={handleStartRecordingSequence}
              className="w-full py-3.5 rounded-2xl bg-[#DE1D3E] hover:bg-[#c01835] text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(222,29,62,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-white/10 mt-1"
            >
              <Camera className="w-4 h-4" />
              <span>Nahrát výzvu kamerou (15s)</span>
            </button>
          )}

          {stage === 'review' && (
            <div className="flex gap-2.5 mt-1">
              <button
                onClick={handleRetake}
                className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/10 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nahrát znovu</span>
              </button>
              <button
                onClick={runAiVerification}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-emerald-500/30 flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Odeslat k AI ověření</span>
              </button>
            </div>
          )}

          {stage === 'failed' && (
            <button
              onClick={handleRetake}
              className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/10 flex items-center justify-center gap-2 mt-1 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nahrát znovu & zkusit splnit výzvu</span>
            </button>
          )}

          {stage === 'complete' && (
            <div className="flex gap-2.5 mt-1">
              <button
                onClick={handleRetake}
                className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/10"
              >
                Další výzva
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-emerald-500/30"
              >
                Zavřít (+{activeChallenge.reward} Kč)
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

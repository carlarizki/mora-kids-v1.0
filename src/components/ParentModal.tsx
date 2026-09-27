import React, { useState } from 'react';
import { X, ShieldCheck, Clock, RotateCcw, Check } from 'lucide-react';
import { UserProgress } from '../types/game';
import { MoraButton } from './ui/MoraPrimitives';
import { sound } from '../utils/audio';

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ParentModal: React.FC<ParentModalProps> = ({
  isOpen,
  onClose,
  progress,
  onResetProgress,
}) => {
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
      <div className="paper-card rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-play border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-secondary flex items-center justify-center text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <p className="font-hand font-bold text-primary text-xs uppercase tracking-wider">
                FAMILY CONTROLS
              </p>
              <h2 className="font-display text-2xl font-black text-foreground">
                Grown-ups Dashboard
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-full hover:bg-muted flex items-center justify-center text-ink-soft hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-4 bg-sun/15 rounded-2xl text-center border border-sun/20">
            <span className="text-xs font-bold text-sun-foreground">Stars Collected</span>
            <div className="font-display text-2xl font-black text-foreground mt-1 tabular-nums">
              {progress.totalStars}
            </div>
          </div>
          <div className="p-4 bg-sky-soft rounded-2xl text-center border border-sky/20">
            <span className="text-xs font-bold text-primary">Activities Done</span>
            <div className="font-display text-2xl font-black text-foreground mt-1 tabular-nums">
              {progress.gamesPlayed}
            </div>
          </div>
          <div className="p-4 bg-mint-soft rounded-2xl text-center border border-mint/20">
            <span className="text-xs font-bold text-mint">Daily Streak</span>
            <div className="font-display text-2xl font-black text-foreground mt-1 tabular-nums">
              {progress.dailyStreak} Days
            </div>
          </div>
          <div className="p-4 bg-coral-soft rounded-2xl text-center border border-coral/20">
            <span className="text-xs font-bold text-coral">Play Time</span>
            <div className="font-display text-2xl font-black text-foreground mt-1 tabular-nums">
              {progress.minutesSpent} min
            </div>
          </div>
        </div>

        {/* Core Subject Breakdown */}
        <div className="mb-6 space-y-2.5">
          <h3 className="font-hand font-bold text-xs uppercase tracking-wider text-muted-foreground">
            Curriculum Alignment
          </h3>
          <div className="p-3.5 bg-muted/60 rounded-xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-sun" />
              <span className="font-bold text-foreground">Math Kingdom</span>
            </div>
            <span className="text-xs text-ink-soft">Mental Math, Times Tables, Fractions</span>
          </div>
          <div className="p-3.5 bg-muted/60 rounded-xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-mint" />
              <span className="font-bold text-foreground">Science Lab</span>
            </div>
            <span className="text-xs text-ink-soft">Electric Sparks, Habitat Food Chains</span>
          </div>
          <div className="p-3.5 bg-muted/60 rounded-xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-primary" />
              <span className="font-bold text-foreground">Storyverse</span>
            </div>
            <span className="text-xs text-ink-soft">Phonics Safari, Auditory Speech Narration</span>
          </div>
          <div className="p-3.5 bg-muted/60 rounded-xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-coral" />
              <span className="font-bold text-foreground">Creative Studio &amp; Logic</span>
            </div>
            <span className="text-xs text-ink-soft">Rainbow Xylophone, Pattern Deduction</span>
          </div>
        </div>

        {/* Screen Time Reminders */}
        <div className="p-5 bg-secondary rounded-2xl border border-primary/10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Recommended Session Limit</span>
            </div>
            <span className="text-xs font-bold text-primary font-display text-sm tabular-nums">
              {sessionMinutes} Minutes
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={sessionMinutes}
            onChange={(e) => setSessionMinutes(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer mt-2"
          />
          <div className="flex justify-between text-xs text-ink-soft mt-1 font-medium">
            <span>10 min (Quick snack)</span>
            <span>25 min (Recommended)</span>
            <span>60 min (Weekend)</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-destructive font-semibold">Confirm erase?</span>
              <MoraButton
                size="sm"
                variant="default"
                onClick={() => {
                  onResetProgress();
                  setShowConfirmReset(false);
                  sound.playPop();
                }}
                className="bg-coral hover:bg-coral/90 text-white"
              >
                Yes, Reset
              </MoraButton>
              <MoraButton
                size="sm"
                variant="outline"
                onClick={() => setShowConfirmReset(false)}
              >
                Cancel
              </MoraButton>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-coral transition-colors cursor-pointer font-medium"
            >
              <RotateCcw className="size-3.5" />
              Reset Student Progress
            </button>
          )}

          <MoraButton
            variant="joyful"
            size="default"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
          >
            Done
          </MoraButton>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Square, Circle, Star, Trophy, Sparkles, Music, Volume2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface RainbowMelodyGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface XyloKey {
  note: string;
  name: string;
  freq: number;
  color: string;
  height: string;
}

const XYLOPHONE_KEYS: XyloKey[] = [
  { note: 'C', name: 'Do', freq: 523.25, color: '#EF4444', height: 'h-64' },
  { note: 'D', name: 'Re', freq: 587.33, color: '#F97316', height: 'h-60' },
  { note: 'E', name: 'Mi', freq: 659.25, color: '#FACC15', height: 'h-56' },
  { note: 'F', name: 'Fa', freq: 698.46, color: '#22C55E', height: 'h-52' },
  { note: 'G', name: 'Sol', freq: 783.99, color: '#06B6D4', height: 'h-48' },
  { note: 'A', name: 'La', freq: 880.00, color: '#3B82F6', height: 'h-44' },
  { note: 'B', name: 'Ti', freq: 987.77, color: '#8B5CF6', height: 'h-40' },
  { note: 'C2', name: 'Do', freq: 1046.50, color: '#EC4899', height: 'h-36' },
];

interface SongTutorial {
  title: string;
  notes: string[];
}

const SONGS: SongTutorial[] = [
  {
    title: 'Twinkle Twinkle Little Star',
    notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
  },
  {
    title: 'Mary Had a Little Lamb',
    notes: ['E', 'D', 'C', 'D', 'E', 'E', 'E', 'D', 'D', 'D', 'E', 'G', 'G'],
  },
  {
    title: 'Ode to Joy',
    notes: ['E', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C', 'C', 'D', 'E', 'E', 'D'],
  },
];

export const RainbowMelodyGame: React.FC<RainbowMelodyGameProps> = ({ onBack, onFinishGame }) => {
  const [activeSongIndex, setActiveSongIndex] = useState<number | null>(0);
  const [songStep, setSongStep] = useState(0);
  const [instrument, setInstrument] = useState<OscillatorType>('sine');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<{ note: string; freq: number; delay: number }[]>([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [score, setScore] = useState(0);
  const recordingStartTime = useRef<number>(0);

  const activeSong = activeSongIndex !== null ? SONGS[activeSongIndex] : null;
  const targetNote = activeSong ? activeSong.notes[songStep] : null;

  const handleKeyPress = (key: XyloKey) => {
    // Play note with selected synth type
    sound.playNote(key.freq, instrument, 0.45, 0.28);

    // If recording
    if (isRecording) {
      const now = Date.now();
      const delay = now - recordingStartTime.current;
      setRecordedNotes((prev) => [...prev, { note: key.note, freq: key.freq, delay }]);
    }

    // If playing tutorial song
    if (activeSong && targetNote) {
      if (key.note === targetNote) {
        setScore((s) => s + 5);
        if (songStep + 1 >= activeSong.notes.length) {
          // Song completed!
          sound.playSuccess();
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
          setSongStep(0);
          sound.speak(`Wonderful! You mastered ${activeSong.title}!`);
        } else {
          setSongStep((prev) => prev + 1);
        }
      }
    }
  };

  const handleStartRecording = () => {
    sound.playPop();
    setRecordedNotes([]);
    setIsRecording(true);
    recordingStartTime.current = Date.now();
  };

  const handleStopRecording = () => {
    sound.playPop();
    setIsRecording(false);
  };

  const handlePlayback = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);
    sound.playPop();

    recordedNotes.forEach((item, index) => {
      setTimeout(() => {
        sound.playNote(item.freq, instrument, 0.4, 0.28);
        if (index === recordedNotes.length - 1) {
          setIsPlayingBack(false);
        }
      }, item.delay);
    });
  };

  const handleFinish = () => {
    sound.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onFinishGame(15, score + 25);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-200/80">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Studio</span>
        </button>

        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-600" />
          <span className="font-fredoka text-lg font-bold text-slate-800">
            Rainbow Xylophone & Song Studio
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
          <Star className="w-4 h-4 fill-purple-400 text-purple-500" />
          <span className="font-fredoka text-sm tabular-nums">{score} pts</span>
        </div>
      </div>

      {/* Tutorial Song Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-purple-200 shadow-xs mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Learn a Song:</span>
          <div className="flex flex-wrap gap-1.5">
            {SONGS.map((s, idx) => (
              <button
                key={s.title}
                onClick={() => {
                  sound.playPop();
                  setActiveSongIndex(idx);
                  setSongStep(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  activeSongIndex === idx
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.title}
              </button>
            ))}
            <button
              onClick={() => {
                sound.playPop();
                setActiveSongIndex(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                activeSongIndex === null
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Free Play
            </button>
          </div>
        </div>

        {/* Timbre / Instrument Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Sound:</span>
          {(
            [
              { type: 'sine' as const, label: 'Bell' },
              { type: 'triangle' as const, label: 'Marimba' },
              { type: 'square' as const, label: 'Chiptune' },
            ] as const
          ).map((item) => (
            <button
              key={item.type}
              onClick={() => {
                sound.playPop();
                setInstrument(item.type);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                instrument === item.type
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tutorial Note Target Banner */}
      {activeSong && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-purple-700 font-semibold">Playing: {activeSong.title}</div>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {activeSong.notes.map((note, i) => (
                <span
                  key={i}
                  className={`w-7 h-7 rounded-lg font-fredoka text-xs font-bold flex items-center justify-center ${
                    i === songStep
                      ? 'bg-purple-600 text-white scale-110 shadow-sm animate-pulse'
                      : i < songStep
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">Next Note:</span>
            <div className="font-fredoka text-2xl font-bold text-purple-700">
              {targetNote}
            </div>
          </div>
        </div>
      )}

      {/* Rainbow Xylophone Keys */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border-4 border-amber-800 shadow-xl relative overflow-hidden">
        {/* Wooden frame texture background */}
        <div className="absolute inset-x-8 top-12 bottom-12 border-y-8 border-amber-900/60 pointer-events-none rounded-xl" />

        <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-4 h-72">
          {XYLOPHONE_KEYS.map((key) => {
            const isTarget = targetNote === key.note;

            return (
              <button
                key={key.note}
                onClick={() => handleKeyPress(key)}
                style={{ backgroundColor: key.color }}
                className={`relative flex flex-col items-center justify-between py-4 w-10 sm:w-16 ${
                  key.height
                } rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer ${
                  isTarget ? 'ring-4 ring-white animate-bounce' : ''
                }`}
              >
                {/* Silver mounting pin top */}
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400 shadow-inner" />

                {/* Note Label */}
                <div className="text-center text-white drop-shadow-md">
                  <span className="font-fredoka text-lg sm:text-2xl font-bold block">{key.note}</span>
                  <span className="text-[10px] font-semibold opacity-90">{key.name}</span>
                </div>

                {/* Silver mounting pin bottom */}
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400 shadow-inner" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Recording & Playback Console */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs"
            >
              <Circle className="w-3.5 h-3.5 fill-white" />
              <span>Record Song</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop Recording ({recordedNotes.length} notes)</span>
            </button>
          )}

          <button
            onClick={handlePlayback}
            disabled={recordedNotes.length === 0 || isPlayingBack || isRecording}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isPlayingBack ? 'Playing...' : 'Play Recording'}</span>
          </button>
        </div>

        <button
          onClick={handleFinish}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-fredoka text-sm font-bold rounded-xl cursor-pointer shadow-xs transition-transform hover:scale-105"
        >
          Collect Music Stars!
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Star, Trophy, Sparkles, Volume2, Waves } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface ScienceEcosystemGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

interface Organism {
  id: string;
  name: string;
  emoji: string;
  level: number; // 0: Sun, 1: Plant, 2: Insect/Tadpole, 3: Frog, 4: Heron
  role: string;
  fact: string;
}

const ORGANISMS: Organism[] = [
  { id: 'sun', name: 'Sunlight', emoji: '☀️', level: 0, role: 'Energy Source', fact: 'The sun provides radiant solar energy to kickstart all life!' },
  { id: 'algae', name: 'Pond Lily & Algae', emoji: '🪷', level: 1, role: 'Primary Producer', fact: 'Plants turn sunlight into sugars through photosynthesis!' },
  { id: 'tadpole', name: 'Tadpole & Bugs', emoji: '🦗', level: 2, role: 'Herbivore Consumer', fact: 'Little insects and tadpoles graze on healthy green plants.' },
  { id: 'frog', name: 'Spotted Frog', emoji: '🐸', level: 3, role: 'Carnivore Predator', fact: 'Frogs catch bugs with lightning-fast sticky tongues!' },
  { id: 'heron', name: 'Blue Heron', emoji: '🪶', level: 4, role: 'Apex Wetland Hunter', fact: 'Tall herons wade gracefully in shallow water to spear fish.' },
];

export const ScienceEcosystemGame: React.FC<ScienceEcosystemGameProps> = ({ onBack, onFinishGame }) => {
  const [selectedChain, setSelectedChain] = useState<Organism[]>([]);
  const [availableOrganisms, setAvailableOrganisms] = useState<Organism[]>(
    [...ORGANISMS].sort(() => Math.random() - 0.5)
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isBalanced, setIsBalanced] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOrganism = (org: Organism) => {
    sound.playPop();
    const expectedLevel = selectedChain.length;

    if (org.level === expectedLevel) {
      // Correct trophic step!
      sound.playSuccess();
      sound.speak(`${org.name}! ${org.fact}`);
      const newChain = [...selectedChain, org];
      setSelectedChain(newChain);
      setAvailableOrganisms((prev) => prev.filter((o) => o.id !== org.id));
      setScore((s) => s + 20);
      setFeedback(`✨ Great choice! ${org.fact}`);

      if (newChain.length === ORGANISMS.length) {
        setIsBalanced(true);
        sound.playFanfare();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onFinishGame(14, score + 30);
      }
    } else {
      sound.playGentleBoing();
      if (expectedLevel === 0) {
        setFeedback('Hint: Every ecosystem starts with sunlight to give energy to plants!');
      } else if (expectedLevel === 1) {
        setFeedback('Hint: Who absorbs sunlight? Look for green plants or water lilies!');
      } else if (expectedLevel === 2) {
        setFeedback('Hint: Who eats the plants? Find small insects or tadpoles!');
      } else if (expectedLevel === 3) {
        setFeedback('Hint: Who eats the insects? Look for the spotted frog!');
      } else {
        setFeedback('Hint: Who is the majestic wetland bird at the top of the food web?');
      }
    }
  };

  const restart = () => {
    setSelectedChain([]);
    setAvailableOrganisms([...ORGANISMS].sort(() => Math.random() - 0.5));
    setFeedback(null);
    setIsBalanced(false);
    setScore(0);
  };

  const pondHealthPercentage = Math.round((selectedChain.length / ORGANISMS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-200/80">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Habitat</span>
        </button>

        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-emerald-600" />
          <span className="font-fredoka text-lg font-bold text-slate-800">
            Habitat Balance: Pond Food Web
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Star className="w-4 h-4 fill-emerald-400 text-emerald-500" />
          <span className="font-fredoka text-sm tabular-nums">{score} pts</span>
        </div>
      </div>

      {!isBalanced ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm">
          {/* Habitat Ecosystem Health Gauge */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-900">Ecosystem Balance Level</div>
              <div className="text-xs text-emerald-700">
                Connect the energy path from solar rays up to top predators
              </div>
            </div>
            <div className="w-full sm:w-64 flex items-center gap-3">
              <div className="flex-1 bg-white rounded-full h-3.5 border border-emerald-300 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pondHealthPercentage}%` }}
                />
              </div>
              <span className="font-fredoka text-base font-bold text-emerald-800 tabular-nums">
                {pondHealthPercentage}%
              </span>
            </div>
          </div>

          {/* Constructed Food Chain Sequence */}
          <div className="mb-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Constructed Energy Pathway:
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 min-h-24">
              {selectedChain.map((org, index) => (
                <React.Fragment key={org.id}>
                  {index > 0 && <span className="text-slate-400 font-bold text-lg">➔</span>}
                  <div className="flex flex-col items-center p-2.5 rounded-xl bg-white border border-emerald-300 shadow-2xs">
                    <span className="text-3xl">{org.emoji}</span>
                    <span className="font-fredoka text-xs font-bold text-slate-800 mt-1">{org.name}</span>
                    <span className="text-[10px] text-emerald-700 font-medium">{org.role}</span>
                  </div>
                </React.Fragment>
              ))}

              {selectedChain.length < ORGANISMS.length && (
                <div className="p-4 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-700 text-xs font-semibold flex items-center justify-center">
                  Next Step in Chain...
                </div>
              )}
            </div>
          </div>

          {/* Available Organisms to Place */}
          <div>
            <div className="text-xs font-bold text-slate-700 mb-3">
              Tap the next organism in the energy flow:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {availableOrganisms.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrganism(org)}
                  className="p-3 bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all shadow-2xs hover:scale-105 active:scale-95"
                >
                  <span className="text-4xl mb-1">{org.emoji}</span>
                  <span className="font-fredoka text-sm font-bold text-slate-800">{org.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">{org.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className="mt-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 animate-in fade-in">
              {feedback}
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-200 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="font-fredoka text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Perfect Wetland Harmony!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            The pond ecosystem is 100% balanced from radiant sunlight to top wading predators!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={restart}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Build Another Web
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

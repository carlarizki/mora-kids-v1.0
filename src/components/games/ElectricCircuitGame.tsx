import React, { useState } from 'react';
import { ArrowLeft, Zap, Star, Trophy, Sparkles, Volume2, RotateCcw, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface ElectricCircuitGameProps {
  onBack: () => void;
  onFinishGame: (starsEarned: number, score: number) => void;
}

type MaterialItem = 'copper' | 'gold' | 'rubber' | 'wood';

export const ElectricCircuitGame: React.FC<ElectricCircuitGameProps> = ({ onBack, onFinishGame }) => {
  const [switchClosed, setSwitchClosed] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<'bulb' | 'fan' | 'buzzer'>('bulb');
  const [batteryVoltage, setBatteryVoltage] = useState<number>(3); // 1.5V, 3V, 9V
  const [testMaterial, setTestMaterial] = useState<MaterialItem>('copper');
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const isConductor = testMaterial === 'copper' || testMaterial === 'gold';
  const isCircuitActive = switchClosed && isConductor;

  const handleToggleSwitch = () => {
    const nextState = !switchClosed;
    setSwitchClosed(nextState);

    if (nextState) {
      sound.playPop();
      if (isConductor) {
        sound.playSuccess();
        if (selectedLoad === 'buzzer') {
          sound.playNote(440, 'triangle', 0.5, 0.2);
        }
        if (!completedObjectives.includes('first_light')) {
          setCompletedObjectives((prev) => [...prev, 'first_light']);
          setScore((s) => s + 25);
        }
      } else {
        sound.playGentleBoing();
      }
    } else {
      sound.playPop();
    }
  };

  const handleChangeMaterial = (mat: MaterialItem) => {
    sound.playPop();
    setTestMaterial(mat);
    if (mat === 'rubber' || mat === 'wood') {
      sound.speak(`${mat.toUpperCase()} is an insulator! Electricity cannot flow through it.`);
    } else {
      sound.speak(`${mat.toUpperCase()} is a great conductor of electricity!`);
    }

    if (!completedObjectives.includes('material_test')) {
      setCompletedObjectives((prev) => [...prev, 'material_test']);
      setScore((s) => s + 20);
    }
  };

  const handleCompleteLab = () => {
    sound.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onFinishGame(18, score + 30);
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
          <span>Exit Lab</span>
        </button>

        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-600" />
          <span className="font-fredoka text-lg font-bold text-slate-800">
            Electric Circuit Sparks
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Star className="w-4 h-4 fill-emerald-400 text-emerald-500" />
          <span className="font-fredoka text-sm tabular-nums">{score} pts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Circuit Workbench (Left 2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border-2 border-emerald-600 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-2">
            <span>● VIRTUAL BREADBOARD</span>
            <span className="font-mono tabular-nums">
              CURRENT: {isCircuitActive ? `${(batteryVoltage * 0.4).toFixed(1)} A` : '0.0 A · CIRCUIT OPEN'}
            </span>
          </div>

          {/* Circuit Canvas Visualizer */}
          <div className="relative h-64 sm:h-72 my-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
            {/* SVG Wire Loop */}
            <svg viewBox="0 0 400 240" className="w-full h-full">
              {/* Copper Wires */}
              <rect
                x="50"
                y="40"
                width="300"
                height="160"
                rx="20"
                fill="none"
                stroke={isCircuitActive ? '#10B981' : '#64748B'}
                strokeWidth="6"
                strokeDasharray={isCircuitActive ? '10 6' : 'none'}
                className={isCircuitActive ? 'animate-pulse' : ''}
              />

              {/* Top: Battery Position */}
              <g transform="translate(160, 20)">
                <rect x="0" y="8" width="80" height="24" rx="4" fill="#F59E0B" />
                <rect x="75" y="14" width="8" height="12" rx="2" fill="#E2E8F0" />
                <text x="40" y="24" fill="#78350F" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {batteryVoltage}V Cell
                </text>
              </g>

              {/* Right: Switch Position */}
              <g
                transform="translate(330, 95)"
                className="cursor-pointer"
                onClick={handleToggleSwitch}
              >
                <circle cx="20" cy="10" r="7" fill="#E2E8F0" />
                <circle cx="20" cy="50" r="7" fill="#E2E8F0" />
                {/* Switch Arm */}
                <line
                  x1="20"
                  y1="10"
                  x2="20"
                  y2={switchClosed ? 50 : 30}
                  stroke="#38BDF8"
                  strokeWidth="5"
                  transform={switchClosed ? '' : 'rotate(-35 20 10)'}
                />
              </g>

              {/* Bottom: Load Position (Bulb / Fan / Buzzer) */}
              <g transform="translate(170, 175)">
                <circle
                  cx="30"
                  cy="25"
                  r="24"
                  fill={isCircuitActive ? '#FEF08A' : '#334155'}
                  stroke={isCircuitActive ? '#FACC15' : '#475569'}
                  strokeWidth="3"
                />
                {isCircuitActive && (
                  <circle cx="30" cy="25" r="32" fill="#FEF08A" opacity="0.25" className="animate-ping" />
                )}
                <text x="30" y="30" fill={isCircuitActive ? '#854D0E' : '#94A3B8'} fontSize="16" textAnchor="middle">
                  {selectedLoad === 'bulb' ? '💡' : selectedLoad === 'fan' ? '🌀' : '🔔'}
                </text>
              </g>

              {/* Left: Material Test Bridge */}
              <g transform="translate(30, 90)">
                <rect
                  x="10"
                  y="0"
                  width="20"
                  height="60"
                  rx="4"
                  fill={
                    testMaterial === 'copper'
                      ? '#B45309'
                      : testMaterial === 'gold'
                      ? '#EAB308'
                      : testMaterial === 'rubber'
                      ? '#6B7280'
                      : '#854D0E'
                  }
                />
              </g>
            </svg>

            {/* Glowing Indicator Badge */}
            <div
              className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                isCircuitActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isCircuitActive ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
              {isCircuitActive ? 'CURRENT FLOWING' : 'NO FLOW (OPEN / INSULATED)'}
            </div>
          </div>

          {/* Quick Switch Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Interactive Knife Switch:{' '}
              <strong className={switchClosed ? 'text-emerald-400' : 'text-slate-300'}>
                {switchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
              </strong>
            </span>
            <button
              onClick={handleToggleSwitch}
              className={`px-5 py-2.5 rounded-xl font-fredoka text-sm font-bold cursor-pointer transition-all shadow-md ${
                switchClosed
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {switchClosed ? 'Open Switch (Turn Off)' : 'Close Switch (Turn On)'}
            </button>
          </div>
        </div>

        {/* Experiment Controls (Right col) */}
        <div className="flex flex-col gap-4">
          {/* Material Conductor Selector */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <label className="text-xs font-bold text-slate-700 block mb-2">
              1. Material in Circuit Gap:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'copper', name: 'Copper Wire', type: 'Conductor' },
                  { id: 'gold', name: 'Gold Coin', type: 'Conductor' },
                  { id: 'rubber', name: 'Rubber Eraser', type: 'Insulator' },
                  { id: 'wood', name: 'Wooden Stick', type: 'Insulator' },
                ] as const
              ).map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => handleChangeMaterial(mat.id)}
                  className={`p-2.5 rounded-xl text-left border-2 cursor-pointer transition-all ${
                    testMaterial === mat.id
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-fredoka text-xs font-bold text-slate-800">{mat.name}</div>
                  <div
                    className={`text-[10px] font-semibold ${
                      mat.type === 'Conductor' ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {mat.type}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voltage Selection */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <label className="text-xs font-bold text-slate-700 block mb-2">
              2. Battery Voltage:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1.5, 3, 9].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    sound.playPop();
                    setBatteryVoltage(v);
                  }}
                  className={`py-2 rounded-xl font-fredoka text-sm font-bold border-2 cursor-pointer transition-colors ${
                    batteryVoltage === v
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>

          {/* Load Output Selection */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <label className="text-xs font-bold text-slate-700 block mb-2">
              3. Connected Output:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'bulb', label: '💡 Light', name: 'Bulb' },
                  { id: 'fan', label: '🌀 Motor', name: 'Fan' },
                  { id: 'buzzer', label: '🔔 Alarm', name: 'Buzzer' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playPop();
                    setSelectedLoad(item.id);
                  }}
                  className={`py-2 rounded-xl font-fredoka text-xs font-bold border-2 cursor-pointer transition-colors text-center ${
                    selectedLoad === item.id
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Finish & Claim Stars Button */}
          <button
            onClick={handleCompleteLab}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-fredoka text-base font-bold rounded-2xl shadow-sm cursor-pointer transition-transform hover:scale-[1.02]"
          >
            Complete Lab & Claim Stars!
          </button>
        </div>
      </div>
    </div>
  );
};

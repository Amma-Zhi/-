import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardData, HandEvaluation, JokerData } from '../types';
import { CardView } from './CardView';
import { soundEngine } from '../utils/audio';
import { Sparkles, Zap, Coins } from 'lucide-react';

interface HandScoringOverlayProps {
  handEval: HandEvaluation;
  playedCards: CardData[];
  jokers: JokerData[];
  onScoringComplete: (finalHandScore: number) => void;
  cardBack: string;
}

export const HandScoringOverlay: React.FC<HandScoringOverlayProps> = ({
  handEval,
  playedCards,
  jokers,
  onScoringComplete,
  cardBack,
}) => {
  const [step, setStep] = useState<number>(0);
  const [chips, setChips] = useState<number>(handEval.baseChips);
  const [mult, setMult] = useState<number>(handEval.baseMult);
  const [activeCardIdx, setActiveCardIdx] = useState<number>(-1);
  const [activeJokerIdx, setActiveJokerIdx] = useState<number>(-1);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  useEffect(() => {
    let isCancelled = false;

    async function runScoringSequence() {
      // 1. Initial delay
      await new Promise(r => setTimeout(r, 300));
      if (isCancelled) return;

      // 2. Score cards one by one
      let currentChips = handEval.baseChips;
      let currentMult = handEval.baseMult;

      for (let i = 0; i < playedCards.length; i++) {
        const card = playedCards[i];
        setActiveCardIdx(i);
        soundEngine.playCardFlip();

        let addChips = card.value || 10;
        let addMult = 0;

        if (card.enhancement === 'bonus') addChips += 30;
        if (card.enhancement === 'mult') addMult += 4;
        if (card.edition === 'foil') addChips += 50;
        if (card.edition === 'holographic') addMult += 10;

        currentChips += addChips;
        currentMult += addMult;

        setChips(currentChips);
        setMult(currentMult);

        soundEngine.playScoreStep(i);
        await new Promise(r => setTimeout(r, 450));
        if (isCancelled) return;
      }

      setActiveCardIdx(-1);

      // 3. Trigger Jokers sequentially
      for (let j = 0; j < jokers.length; j++) {
        const joker = jokers[j];
        setActiveJokerIdx(j);
        soundEngine.playJokerTrigger();

        if (joker.id === 'joker_bear') currentChips += 40;
        else if (joker.id === 'joker_kitty') {
          const heartCount = playedCards.filter(c => c.suit === 'hearts').length;
          currentMult += heartCount * 5;
        } else if (joker.id === 'joker_donut' && (handEval.handType === '两对' || handEval.handType === '葫芦')) {
          currentMult = Math.floor(currentMult * 1.5);
        } else if (joker.id === 'joker_piggy') {
          currentMult += 10;
        } else if (joker.id === 'joker_sheep') {
          currentChips += 30;
        } else if (joker.id === 'joker_unicorn' && (handEval.handType === '顺子' || handEval.handType === '同花顺')) {
          currentMult = Math.floor(currentMult * 2.0);
        } else if (joker.id === 'joker_legend_angel') {
          currentMult = Math.floor(currentMult * 2.2);
        } else {
          // Default small boost for any other jokers
          currentMult += 5;
        }

        setChips(currentChips);
        setMult(currentMult);

        await new Promise(r => setTimeout(r, 500));
        if (isCancelled) return;
      }

      setActiveJokerIdx(-1);

      // 4. Final tally calculation
      const finalScore = currentChips * currentMult;
      soundEngine.playVictory();

      await new Promise(r => setTimeout(r, 600));
      if (!isCancelled) {
        onScoringComplete(finalScore);
      }
    }

    runScoringSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  const totalCalculated = chips * mult;

  return (
    <div className="fixed inset-0 bg-pink-900/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-6 border-4 border-pink-300 shadow-2xl flex flex-col items-center gap-5 text-center"
      >
        {/* Hand Title Badge */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-black text-xl sm:text-2xl px-6 py-2 rounded-full shadow-lg border-2 border-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span>{handEval.handType}</span>
        </div>

        {/* Played Cards Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-32">
          {playedCards.map((card, idx) => (
            <CardView
              key={card.id}
              card={card}
              isScoring={activeCardIdx === idx}
              cardBack={cardBack}
              size="md"
            />
          ))}
        </div>

        {/* Triggered Jokers Row */}
        {jokers.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {jokers.map((joker, idx) => (
              <motion.div
                key={joker.id + idx}
                animate={activeJokerIdx === idx ? { scale: 1.2, y: -6 } : { scale: 1, y: 0 }}
                className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs shadow-xs flex items-center gap-1 ${
                  activeJokerIdx === idx
                    ? 'bg-amber-300 text-amber-950 border-amber-500 ring-4 ring-amber-200'
                    : 'bg-white text-slate-700 border-pink-200'
                }`}
              >
                <span>🤡</span>
                <span>{joker.name}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Chips x Mult Live Formula Panel */}
        <div className="w-full bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-inner flex items-center justify-around gap-2 text-lg sm:text-2xl font-black">
          {/* Chips */}
          <div className="flex flex-col items-center text-sky-600">
            <span className="text-xs text-sky-400 font-bold">筹码 (Chips)</span>
            <div className="flex items-center gap-1">
              <Zap className="w-5 h-5 fill-sky-300 text-sky-600" />
              <span>{chips}</span>
            </div>
          </div>

          <span className="text-pink-400 font-extrabold text-2xl">×</span>

          {/* Mult */}
          <div className="flex flex-col items-center text-rose-600">
            <span className="text-xs text-rose-400 font-bold">倍率 (Mult)</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-5 h-5 fill-rose-300 text-rose-600" />
              <span>{mult}</span>
            </div>
          </div>

          <span className="text-pink-400 font-extrabold text-2xl">=</span>

          {/* Score */}
          <div className="flex flex-col items-center text-pink-600">
            <span className="text-xs text-pink-400 font-bold font-sans">得 分 (Score)</span>
            <motion.span
              key={totalCalculated}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-2xl sm:text-3xl font-black text-rose-600"
            >
              {totalCalculated.toLocaleString()}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

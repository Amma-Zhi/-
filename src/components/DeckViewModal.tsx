import React from 'react';
import { motion } from 'motion/react';
import { CardData, HandLevelMap, HandType } from '../types';
import { CardView } from './CardView';
import { Layers, X, Sparkles, Zap } from 'lucide-react';

interface DeckViewModalProps {
  deck: CardData[];
  handLevels: HandLevelMap;
  cardBack: string;
  onClose: () => void;
}

export const DeckViewModal: React.FC<DeckViewModalProps> = ({
  deck,
  handLevels,
  cardBack,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-4 sm:p-6 border-4 border-pink-300 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 border-b-2 border-pink-200 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-rose-600">牌组详情与牌型等级</h2>
            <p className="text-xs text-slate-500">当前摸牌堆剩余卡牌数: {deck.length} 张</p>
          </div>
        </div>

        {/* Hand Levels Section */}
        <div className="flex flex-col gap-2 bg-white/80 p-3 rounded-2xl border border-pink-200 shadow-xs">
          <span className="font-extrabold text-xs text-slate-700 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>手牌等级与基础分值</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {(Object.entries(handLevels) as [HandType, { level: number; chips: number; mult: number }][]).map(([handName, levelInfo]) => (
              <div
                key={handName}
                className="bg-pink-50/80 p-2 rounded-xl border border-pink-200 flex flex-col items-center text-center"
              >
                <div className="font-extrabold text-slate-800">{handName}</div>
                <div className="text-[10px] text-pink-600 font-bold">Lv. {levelInfo.level}</div>
                <div className="flex items-center gap-1 text-[11px] font-black text-slate-700 mt-1">
                  <span className="text-sky-600">{levelInfo.chips}</span>
                  <span className="text-pink-400">×</span>
                  <span className="text-rose-600">{levelInfo.mult}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards in Deck Section */}
        <div className="flex flex-col gap-2">
          <span className="font-extrabold text-xs text-slate-700">牌堆剩余卡牌:</span>
          <div className="flex items-center gap-2 flex-wrap max-h-60 overflow-y-auto p-2 bg-white/60 rounded-2xl border border-pink-200">
            {deck.map((card) => (
              <CardView key={card.id} card={card} cardBack={cardBack} size="sm" isDisabled />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { CardData, HandLevelMap, HandType } from '../types';
import { CardView } from './CardView';
import { Layers, X } from 'lucide-react';

interface DeckViewModalProps {
  deck: CardData[];
  handLevels: HandLevelMap;
  cardBack: string;
  onClose: () => void;
}

// Order matching the reference image grid exactly
const HAND_TYPES_ORDER: HandType[] = [
  '高牌',
  '对子',
  '两对',
  '三条',
  '顺子',
  '同花',
  '葫芦',
  '四条',
  '同花顺',
  '皇家同花顺',
  '五条',
  '同花五条',
  '同花葫芦',
];

export const DeckViewModal: React.FC<DeckViewModalProps> = ({
  deck,
  handLevels,
  cardBack,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-4xl bg-[#FFF9FA] rounded-[32px] p-3.5 sm:p-5 border-[3px] border-[#F7C6D0] shadow-2xl flex flex-col gap-3 max-h-[94vh] relative overflow-hidden"
      >
        {/* Modal Outer Lace Accent Frame */}
        <div className="bg-[#FFFDF7] rounded-[24px] p-3 sm:p-5 border-2 border-[#F9B9C8] flex flex-col gap-3.5 shadow-xs overflow-hidden flex-1">
          {/* Top Header */}
          <div className="flex items-center justify-between pr-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE8EE] border-2 border-[#F7B6C6] text-[#E63956] flex items-center justify-center shadow-2xs shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg sm:text-xl font-black text-[#D85A7F] tracking-tight">
                    牌组详情与牌型等级
                  </h2>
                  <span className="text-xs text-[#FF85A1]">💕</span>
                </div>
                <p className="text-xs text-[#607D8B] font-bold">
                  当前摸牌堆剩余卡牌: <span className="text-[#D85A7F] font-black">{deck.length}</span> 张
                </p>
              </div>
            </div>

            {/* Circular Blue Ribbon Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F0F6FC] hover:bg-[#E3EFFD] border-2 border-[#CBE0F8] text-[#78A1D1] hover:text-[#537188] flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
              title="关闭"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Ribbon Bow Dashed Divider */}
          <div className="relative border-t-2 border-dashed border-[#F7C6D0] my-0.5 flex items-center justify-center shrink-0">
            <span className="absolute -top-3 bg-[#FFFDF7] px-2 text-lg drop-shadow-2xs leading-none">
              🎀
            </span>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Section 1: Hand Levels & Base Scores */}
            <div className="flex flex-col gap-2 shrink-0">
              {/* Ribbon Header Tag */}
              <div className="self-start inline-flex items-center gap-1.5 bg-[#FFE8EE] border border-dashed border-[#F7C6D0] text-[#D85A7F] font-black text-xs sm:text-sm px-3.5 py-1 rounded-xl shadow-2xs">
                <span>🎀</span>
                <span>手牌等级与基础分值</span>
              </div>

              {/* Hand Levels Box Container */}
              <div className="bg-[#FFFDF9] border-2 border-dashed border-[#F8D0DA] rounded-2xl p-3 sm:p-4 shadow-2xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {HAND_TYPES_ORDER.map((handName) => {
                    const levelInfo = handLevels[handName] || { level: 1, chips: 10, mult: 1 };
                    return (
                      <div
                        key={handName}
                        className="bg-[#FFF5F7] hover:bg-[#FFEBF0] border-2 border-dashed border-[#F7C6D0] rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center transition-all shadow-2xs group"
                      >
                        <div className="font-extrabold text-[#2D3748] text-xs sm:text-sm tracking-tight group-hover:text-[#D85A7F] transition-colors">
                          {handName}
                        </div>
                        <div className="text-[11px] text-[#E63956] font-bold mt-0.5">
                          Lv. {levelInfo.level}
                        </div>
                        <div className="flex items-center justify-center text-xs sm:text-sm font-black mt-1">
                          <span className="text-[#2B79C2]">{levelInfo.chips}</span>
                          <span className="text-[#E63956] font-bold mx-1">×</span>
                          <span className="text-[#E63956]">{levelInfo.mult}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 2: Remaining Cards in Deck */}
            <div className="flex flex-col gap-2 shrink-0">
              {/* Ribbon Header Tag */}
              <div className="self-start inline-flex items-center gap-1.5 bg-[#FFE8EE] border border-dashed border-[#F7C6D0] text-[#D85A7F] font-black text-xs sm:text-sm px-3.5 py-1 rounded-xl shadow-2xs">
                <span>🎀</span>
                <span>牌堆剩余卡牌:</span>
              </div>

              {/* Gingham Blue Frame Container with Center Bow */}
              <div className="bg-gingham-blue border-4 border-[#CBE0F8] rounded-3xl p-3 sm:p-4 relative shadow-xs pt-5">
                {/* Center Bow Ribbon on Top Edge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#EDF5FA] px-2.5 py-0.5 rounded-full border-2 border-[#CBE0F8] flex items-center justify-center shadow-2xs">
                  <span className="text-base leading-none">🎀</span>
                </div>

                {/* Cards Flex Grid */}
                <div className="bg-[#FFFDF9]/95 rounded-2xl p-3 border border-[#D0E1F9] min-h-[140px] flex flex-wrap items-center justify-start gap-2 sm:gap-2.5 max-h-[280px] overflow-y-auto">
                  {deck.length > 0 ? (
                    deck.map((card) => (
                      <CardView key={card.id} card={card} cardBack={cardBack} size="sm" isDisabled />
                    ))
                  ) : (
                    <div className="w-full text-center py-8 text-xs text-[#7C8B9E] font-extrabold">
                      摸牌堆暂无剩余卡牌 🃏
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { CardData, HandEvaluation, JokerData } from '../types';
import { CardView } from './CardView';
import { JokerCard } from './JokerCard';
import { Plus, Menu, Newspaper, Home, Settings } from 'lucide-react';

interface BattleScreenProps {
  currentScore: number;
  targetScore: number;
  round: number;
  maxRound?: number;
  ante: number;
  money: number;
  handsLeft: number;
  discardsLeft: number;
  handCards: CardData[];
  selectedCardIds: string[];
  jokers: JokerData[];
  deckCount: number;
  evaluatedHand?: HandEvaluation;
  onToggleSelectCard: (id: string) => void;
  onPlayHand: () => void;
  onDiscard: () => void;
  onOpenShop: () => void;
  onOpenDeckView: () => void;
  onOpenMenu: () => void;
  onOpenSettings?: () => void;
  onNavigateHome?: () => void;
  activeCardBack?: string;
  streak?: number;
  orientation?: 'portrait' | 'landscape';
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  currentScore,
  targetScore,
  round,
  maxRound = 8,
  ante,
  money,
  handsLeft,
  discardsLeft,
  handCards,
  selectedCardIds,
  jokers,
  deckCount,
  evaluatedHand,
  onToggleSelectCard,
  onPlayHand,
  onDiscard,
  onOpenShop,
  onOpenDeckView,
  onOpenMenu,
  onOpenSettings,
  onNavigateHome,
  activeCardBack = 'card_back_sakura',
  streak = 3,
  orientation = 'landscape',
}) => {
  const isLandscape = orientation === 'landscape';

  const selectedCards = handCards.filter((c) => selectedCardIds.includes(c.id));
  const displayPlayedCards = selectedCards.length > 0 ? selectedCards : handCards.slice(0, 5);

  return (
    <div
      className={`bg-[#EDF5FA] rounded-[36px] border-[6px] border-[#C6E2FF] shadow-2xl overflow-hidden select-none relative my-2 transition-all duration-300 ${
        isLandscape
          ? 'w-full max-w-[860px] min-h-[440px] p-3 flex flex-row justify-between gap-3'
          : 'w-full max-w-[420px] min-h-[720px] p-0 flex flex-col justify-between'
      }`}
    >
      {/* Background Soft Pattern */}
      <div className="absolute inset-0 bg-polka-dots pointer-events-none opacity-40" />

      {/* LANDSCAPE LAYOUT (3 Columns: Dashboard | Stage | Actions) */}
      {isLandscape ? (
        <div className="relative z-10 w-full h-full flex items-stretch justify-between gap-3 my-auto">
          {/* Left Column: Dashboard Stats */}
          <div className="w-[220px] bg-gingham-blue border-2 border-[#A2C4E5] rounded-3xl p-3 flex flex-col justify-between shadow-xs">
            {/* Top Round & Ante Badge */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#537188] font-bold">分数</span>
                <span className="text-lg font-black text-[#FF6392] tracking-tight">
                  {currentScore.toLocaleString()}
                </span>
              </div>
              <div className="w-14 h-12 rounded-full bg-white border border-[#FFB6C1] flex flex-col items-center justify-center">
                <span className="text-[9px] text-slate-400 font-extrabold">回合</span>
                <span className="text-xs font-black text-slate-800 leading-none">
                  {round}/{maxRound}
                </span>
                <span className="text-[8px] text-[#FF6392] font-black">Ante {ante}</span>
              </div>
            </div>

            {/* Money */}
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2 border border-[#A2C4E5] flex items-center justify-between">
              <span className="text-[10px] text-[#537188] font-bold">金币</span>
              <div className="flex items-center gap-1">
                <span className="text-xs">🪙</span>
                <span className="text-sm font-black text-slate-800">{money.toLocaleString()}</span>
                <button
                  onClick={onOpenShop}
                  className="w-4 h-4 rounded-full bg-[#A8D1E7] text-white flex items-center justify-center font-bold text-xs hover:bg-[#749BC2]"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Target & Hand Multiplier Info */}
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2 border border-[#A2C4E5] flex flex-col gap-1 text-center">
              <div className="flex items-center justify-between text-[10px] border-b border-slate-100 pb-1">
                <span className="text-slate-400 font-bold">目标</span>
                <span className="font-black text-[#FF6392]">{targetScore.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] border-b border-slate-100 pb-1">
                <span className="text-slate-400 font-bold">牌型</span>
                <span className="font-black text-slate-800">{evaluatedHand?.handType || '顺子'}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-bold">倍率</span>
                <span className="font-black text-[#FF6392]">x{evaluatedHand?.mult || 2.0}</span>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-[#C6E2FF]">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenMenu}
                  className="w-6 h-6 rounded-lg bg-[#EDF5FA] text-[#537188] flex items-center justify-center hover:bg-[#C6E2FF]"
                  title="帮助"
                >
                  <Menu className="w-3.5 h-3.5" />
                </button>
                {onOpenSettings && (
                  <button
                    onClick={onOpenSettings}
                    className="w-6 h-6 rounded-lg bg-[#FFF0F3] text-[#FF6392] flex items-center justify-center hover:bg-[#FFD1DC]"
                    title="设置"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                )}
                {onNavigateHome && (
                  <button
                    onClick={onNavigateHome}
                    className="w-6 h-6 rounded-lg bg-[#FFF0F3] text-[#FF6392] flex items-center justify-center hover:bg-[#FFD1DC]"
                    title="首页"
                  >
                    <Home className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-[10px] font-black text-[#FF6392]">连击 {streak}♥️</span>
              <button
                onClick={onOpenDeckView}
                className="w-6 h-6 rounded-lg bg-[#EDF5FA] text-[#537188] flex items-center justify-center hover:bg-[#C6E2FF]"
                title="图鉴"
              >
                <Newspaper className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Column: Card Stage (Jokers, Played Hand, Hand Cards) */}
          <div className="flex-1 flex flex-col justify-between py-1 gap-2">
            {/* Top: Special Jokers Ribbon */}
            <div className="flex flex-col items-center gap-1">
              <div className="bg-[#A8D1E7] text-white font-black text-[10px] px-3 py-0.5 rounded-full shadow-2xs border border-white">
                ✦ 本回合特殊牌 ✦
              </div>
              <div className="flex items-center justify-center gap-2">
                {jokers.length > 0 ? (
                  jokers.slice(0, 3).map((joker) => (
                    <JokerCard key={joker.id} item={joker} type="joker" />
                  ))
                ) : (
                  <>
                    <div className="w-16 h-22 bg-white border-2 border-[#FFB6C1] rounded-xl p-1 flex flex-col items-center justify-between shadow-xs">
                      <span className="text-[7px] font-black text-[#FF6392]">JOKER</span>
                      <span className="text-base">🤡</span>
                      <span className="text-[7px] font-black text-[#FF6392]">JOKER</span>
                    </div>
                    <div className="w-16 h-22 bg-white border-2 border-[#FFB6C1] rounded-xl p-1 flex flex-col items-center justify-between shadow-xs">
                      <span className="text-[7px] font-black text-[#FF6392]">JOKER</span>
                      <span className="text-base">🎪</span>
                      <span className="text-[7px] font-black text-[#FF6392]">JOKER</span>
                    </div>
                    <div className="w-16 h-22 bg-white border-2 border-[#FFB6C1] rounded-xl p-1 flex flex-col items-center justify-between shadow-xs">
                      <span className="text-[7px] font-black text-[#FF6392]">JOKER</span>
                      <span className="text-base">🎩</span>
                      <span className="text-[7px] font-black text-[#FF6392]">JOKER</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Middle: Played Hand & Score Pill */}
            <div className="flex flex-col items-center gap-1 my-auto">
              <div className="flex items-center justify-center gap-1.5">
                {displayPlayedCards.slice(0, 5).map((card) => (
                  <CardView key={card.id} card={card} size="sm" />
                ))}
              </div>
              <div className="bg-[#A8D1E7] border-2 border-white text-white font-black text-[11px] px-4 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-bounce">
                <span>{evaluatedHand?.handType || '顺子'} +{evaluatedHand ? evaluatedHand.baseChips * evaluatedHand.baseMult : 1200}</span>
                <span className="text-xs">♥️</span>
              </div>
            </div>

            {/* Bottom: Hand Cards Row & Draw Deck */}
            <div className="p-2 flex items-center justify-between gap-2 bg-white/60 backdrop-blur-xs rounded-2xl border border-[#C6E2FF]">
              <div className="flex items-center gap-1 overflow-x-auto flex-1">
                {handCards.map((card) => (
                  <CardView
                    key={card.id}
                    card={card}
                    isSelected={selectedCardIds.includes(card.id)}
                    size="sm"
                    onClick={() => onToggleSelectCard(card.id)}
                  />
                ))}
              </div>
              <div
                onClick={onOpenDeckView}
                className="w-12 h-16 bg-gingham-blue border-2 border-[#A2C4E5] rounded-xl shadow-md flex items-center justify-center relative cursor-pointer group hover:scale-105 transition-transform"
              >
                <span className="text-xl">🎀</span>
                <span className="absolute -bottom-1 -right-1 bg-[#A8D1E7] text-white font-black text-[9px] px-1 rounded-full border border-white">
                  {deckCount}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Action Buttons */}
          <div className="w-[140px] flex flex-col justify-center gap-2">
            <button
              onClick={onPlayHand}
              disabled={handsLeft <= 0 || selectedCardIds.length === 0}
              className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1 btn-pink-pill transition-all cursor-pointer ${
                handsLeft <= 0 || selectedCardIds.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <span>🎀 出牌</span>
            </button>

            <button
              onClick={onDiscard}
              disabled={discardsLeft <= 0 || selectedCardIds.length === 0}
              className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1 btn-blue-pill transition-all cursor-pointer ${
                discardsLeft <= 0 || selectedCardIds.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <span>弃牌 ({discardsLeft})</span>
            </button>

            <button
              onClick={onOpenShop}
              className="py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1 btn-pink-pill transition-all cursor-pointer"
            >
              <span>🎀 商店</span>
            </button>

            <button
              onClick={onOpenShop}
              className="py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1 btn-blue-pill transition-all cursor-pointer"
            >
              <span>刷新 🪙10</span>
            </button>
          </div>
        </div>
      ) : (
        /* PORTRAIT LAYOUT */
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[710px]">
          {/* Top Lace Header Panel */}
          <div className="bg-gingham-blue border-b-2 border-[#A2C4E5] p-3 pb-4 shadow-sm relative">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#537188] font-bold">分数</span>
                <span className="text-xl font-black text-[#FF6392] tracking-tight">
                  {currentScore.toLocaleString()}
                </span>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-xs">♥️</span>
                  <span className="text-xs">♥️</span>
                  <span className="text-xs">♥️</span>
                </div>
              </div>

              <div className="flex flex-col items-center relative">
                <span className="text-xl drop-shadow-2xs -mb-2.5 z-20">🎀</span>
                <div className="w-20 h-16 rounded-full bg-white border-2 border-[#FFB6C1] shadow-xs flex flex-col items-center justify-center pt-2">
                  <span className="text-[10px] text-slate-400 font-extrabold">回合</span>
                  <span className="text-sm font-black text-slate-800 leading-none my-0.5">
                    {round}/{maxRound}
                  </span>
                  <span className="text-[9px] text-[#FF6392] font-black bg-[#FFF0F3] px-2 rounded-full">
                    Ante {ante}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] text-[#537188] font-bold">金币</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">🪙</span>
                  <span className="text-base font-black text-slate-800">
                    {money.toLocaleString()}
                  </span>
                  <button
                    onClick={onOpenShop}
                    className="w-5 h-5 rounded-full bg-[#A8D1E7] text-white flex items-center justify-center font-bold text-xs hover:bg-[#749BC2] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-white/90 backdrop-blur-xs rounded-2xl p-2 border border-[#A2C4E5] shadow-2xs grid grid-cols-3 text-center">
              <div className="flex flex-col border-r border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold">目标分数</span>
                <span className="text-xs font-black text-[#FF6392]">{targetScore.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border-r border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold">牌型</span>
                <span className="text-xs font-black text-slate-800">
                  {evaluatedHand?.handType || '顺子'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold">倍率</span>
                <span className="text-xs font-black text-[#FF6392]">
                  x{evaluatedHand?.mult || 2.0}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Jokers */}
          <div className="p-3 flex flex-col items-center gap-2">
            <div className="bg-[#A8D1E7] text-white font-black text-[11px] px-4 py-0.5 rounded-full shadow-2xs border border-white flex items-center gap-1">
              <span>✦ 本回合特殊牌 ✦</span>
            </div>

            <div className="flex items-center justify-center gap-2 overflow-x-auto w-full py-1">
              {jokers.length > 0 ? (
                jokers.slice(0, 3).map((joker) => (
                  <JokerCard key={joker.id} item={joker} type="joker" />
                ))
              ) : (
                <>
                  <div className="w-20 h-28 bg-white border-2 border-[#FFB6C1] rounded-2xl p-1 flex flex-col items-center justify-between shadow-xs">
                    <span className="text-[8px] font-black text-[#FF6392]">JOKER</span>
                    <span className="text-2xl">🤡</span>
                    <span className="text-[8px] font-black text-[#FF6392]">JOKER</span>
                  </div>
                  <div className="w-20 h-28 bg-white border-2 border-[#FFB6C1] rounded-2xl p-1 flex flex-col items-center justify-between shadow-xs">
                    <span className="text-[8px] font-black text-[#FF6392]">JOKER</span>
                    <span className="text-2xl">🎪</span>
                    <span className="text-[8px] font-black text-[#FF6392]">JOKER</span>
                  </div>
                  <div className="w-20 h-28 bg-white border-2 border-[#FFB6C1] rounded-2xl p-1 flex flex-col items-center justify-between shadow-xs">
                    <span className="text-[8px] font-black text-[#FF6392]">JOKER</span>
                    <span className="text-2xl">🎩</span>
                    <span className="text-[8px] font-black text-[#FF6392]">JOKER</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Middle Played Hand */}
          <div className="flex flex-col items-center gap-1 my-auto">
            <div className="flex items-center justify-center gap-1.5 px-2">
              {displayPlayedCards.slice(0, 5).map((card) => (
                <CardView key={card.id} card={card} size="sm" />
              ))}
            </div>

            <div className="bg-[#A8D1E7] border-2 border-white text-white font-black text-xs px-5 py-1 rounded-full shadow-md flex items-center gap-1.5 mt-1 animate-bounce">
              <span>{evaluatedHand?.handType || '顺子'} +{evaluatedHand ? evaluatedHand.baseChips * evaluatedHand.baseMult : 1200}</span>
              <span className="text-xs">♥️</span>
            </div>
          </div>

          {/* Bottom Hand Cards & Deck */}
          <div className="p-3 flex items-center justify-between gap-2 bg-white/50 backdrop-blur-xs rounded-3xl border border-[#C6E2FF] mx-2 my-1">
            <div className="flex items-center gap-1 overflow-x-auto flex-1">
              {handCards.map((card) => (
                <CardView
                  key={card.id}
                  card={card}
                  isSelected={selectedCardIds.includes(card.id)}
                  size="sm"
                  onClick={() => onToggleSelectCard(card.id)}
                />
              ))}
            </div>

            <div
              onClick={onOpenDeckView}
              className="w-14 h-20 bg-gingham-blue border-2 border-[#A2C4E5] rounded-xl shadow-md flex items-center justify-center relative cursor-pointer group hover:scale-105 transition-transform"
            >
              <span className="text-2xl">🎀</span>
              <span className="absolute -bottom-1 -right-1 bg-[#A8D1E7] text-white font-black text-[10px] px-1.5 py-0.2 rounded-full border border-white shadow-2xs">
                {deckCount}
              </span>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-3 pt-1 flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={onPlayHand}
                disabled={handsLeft <= 0 || selectedCardIds.length === 0}
                className={`py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-1 btn-pink-pill transition-all cursor-pointer ${
                  handsLeft <= 0 || selectedCardIds.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <span>🎀 出牌</span>
              </button>

              <button
                onClick={onDiscard}
                disabled={discardsLeft <= 0 || selectedCardIds.length === 0}
                className={`py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-1 btn-blue-pill transition-all cursor-pointer ${
                  discardsLeft <= 0 || selectedCardIds.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <span>弃牌 ({discardsLeft})</span>
              </button>

              <button
                onClick={onOpenShop}
                className="py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-1 btn-pink-pill transition-all cursor-pointer"
              >
                <span>🎀 商店</span>
              </button>

              <button
                onClick={onOpenShop}
                className="py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-1 btn-blue-pill transition-all cursor-pointer"
              >
                <span>刷新 🪙10</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-2 border border-[#C6E2FF] flex items-center justify-between text-slate-700 shadow-2xs mt-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenMenu}
                  className="w-7 h-7 rounded-lg bg-[#EDF5FA] text-[#537188] flex items-center justify-center hover:bg-[#C6E2FF]"
                  title="菜单选项"
                >
                  <Menu className="w-4 h-4" />
                </button>
                {onNavigateHome && (
                  <button
                    onClick={onNavigateHome}
                    className="w-7 h-7 rounded-lg bg-[#FFF0F3] text-[#FF6392] flex items-center justify-center hover:bg-[#FFD1DC]"
                    title="返回首页"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-[#FF6392]">
                <span>连击 {streak}</span>
                <span className="text-xs">♥️</span>
                <span className="text-xs">♥️</span>
                <span className="text-xs">♥️</span>
                <span className="text-xs">♥️</span>
                <span className="text-xs">♥️</span>
              </div>

              <button
                onClick={onOpenDeckView}
                className="w-7 h-7 rounded-lg bg-[#EDF5FA] text-[#537188] flex items-center justify-center hover:bg-[#C6E2FF]"
                title="查看图鉴牌组"
              >
                <Newspaper className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

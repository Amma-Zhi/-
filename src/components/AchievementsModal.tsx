import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Achievement, RedeemItem } from '../types';
import { Trophy, Sparkles, Check, Lock, ShoppingBag, X } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AchievementsModalProps {
  achievements: Achievement[];
  redeemItems: RedeemItem[];
  crystals: number;
  activeCardBack: string;
  activeDeckSkin: string;
  onClaimAchievement: (achId: string, reward: number) => void;
  onRedeemItem: (item: RedeemItem) => void;
  onSelectCardBack: (cardBackId: string) => void;
  onSelectDeckSkin: (deckSkinId: string) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  redeemItems,
  crystals,
  activeCardBack,
  activeDeckSkin,
  onClaimAchievement,
  onRedeemItem,
  onSelectCardBack,
  onSelectDeckSkin,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'shop'>('achievements');

  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-4 sm:p-6 border-4 border-pink-300 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b-2 border-pink-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('achievements');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-all ${
                activeTab === 'achievements'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-pink-200 hover:bg-pink-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>成就任务</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('shop');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-all ${
                activeTab === 'shop'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-pink-200 hover:bg-pink-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>萌粉兑换所</span>
            </button>
          </div>

          {/* Crystals balance */}
          <div className="flex items-center gap-1.5 bg-rose-100 text-rose-800 font-black px-3 py-1.5 rounded-2xl border border-rose-300 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-rose-500 fill-rose-300" />
            <span>草莓水晶: {crystals}</span>
          </div>
        </div>

        {/* TAB 1: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-1">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    ach.unlocked ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold text-sm text-slate-800">{ach.title}</div>
                    <div className="text-xs text-slate-500">{ach.description}</div>
                  </div>
                </div>

                {ach.unlocked ? (
                  <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Check className="w-4 h-4" />
                    <span>已完成</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-500 font-extrabold text-xs bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    <Sparkles className="w-3.5 h-3.5 fill-rose-300" />
                    <span>+{ach.rewardCrystals} 水晶</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: REDEEM SHOP */}
        {activeTab === 'shop' && (
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-1">
            <p className="text-xs text-slate-500 text-left font-medium">
              使用获得的【草莓水晶】解锁精美卡牌背面与特色初始卡组！
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {redeemItems.map((item) => {
                const isCardBack = item.type === 'card_back';
                const isEquipped = isCardBack
                  ? activeCardBack === item.id
                  : activeDeckSkin === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-2xl border-2 border-pink-200 shadow-xs flex flex-col justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-16 rounded-xl ${item.previewColor || 'bg-pink-300'} border-2 border-white shadow-xs flex items-center justify-center text-white`}>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.description}</div>
                      </div>
                    </div>

                    {item.unlocked ? (
                      isEquipped ? (
                        <div className="w-full bg-rose-500 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-xs">
                          使用中 ✨
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            soundEngine.playPop();
                            if (isCardBack) onSelectCardBack(item.id);
                            else onSelectDeckSkin(item.id);
                          }}
                          className="w-full bg-pink-100 hover:bg-pink-200 text-pink-800 font-extrabold text-xs py-2 rounded-xl text-center border border-pink-300 transition-colors"
                        >
                          装备此样式
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          if (crystals >= item.price) {
                            soundEngine.playCoin();
                            onRedeemItem(item);
                          }
                        }}
                        disabled={crystals < item.price}
                        className={`w-full font-extrabold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                          crystals >= item.price
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>兑换 ({item.price} 水晶)</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

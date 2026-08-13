import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement, GameStats, RedeemItem } from '../types';
import { Trophy, Sparkles, Check, ShoppingBag, X, Star, Target, Heart, Award, Gift, Lock } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AchievementsModalProps {
  achievements: Achievement[];
  redeemItems: RedeemItem[];
  crystals: number;
  activeCardBack: string;
  activeDeckSkin: string;
  stats?: GameStats;
  onClaimAchievement: (achId: string, reward: number) => void;
  onRedeemItem: (item: RedeemItem) => void;
  onSelectCardBack: (cardBackId: string) => void;
  onSelectDeckSkin: (deckSkinId: string) => void;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  iconType: 'sparkle' | 'star' | 'circle' | 'heart' | 'trophy';
}

// Helper to check if achievement completion criteria is met
function isAchievementMet(ach: Achievement, stats?: GameStats): boolean {
  if (ach.unlocked) return true;

  // If progress bar criteria present
  if (ach.progress !== undefined && ach.maxProgress !== undefined) {
    return ach.progress >= ach.maxProgress;
  }

  if (!stats) return false;

  switch (ach.id) {
    case 'ach_first_game':
      return stats.totalGamesPlayed >= 1;
    case 'ach_high_score_1k':
      return stats.highestHandScore >= 1000;
    case 'ach_high_score_10k':
      return stats.highestHandScore >= 10000;
    case 'ach_high_score_100k':
      return stats.highestHandScore >= 100000;
    case 'ach_full_jokers':
      return stats.totalGamesPlayed >= 1;
    case 'ach_rich':
      return stats.totalMoneyEarned >= 50;
    case 'ach_daily_completer':
      return stats.dailyChallengesCompleted >= 1;
    case 'ach_win_run':
      return stats.totalWins >= 1;
    default:
      return false;
  }
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  redeemItems,
  crystals,
  activeCardBack,
  activeDeckSkin,
  stats,
  onClaimAchievement,
  onRedeemItem,
  onSelectCardBack,
  onSelectDeckSkin,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'shop'>('achievements');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  // Compute stats for progress bars
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const achProgressPercent = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;

  // Next locked item in redeem shop sorted by price
  const lockedRedeemItems = [...redeemItems].filter(i => !i.unlocked).sort((a, b) => a.price - b.price);
  const nextRedeemItem = lockedRedeemItems[0];
  const requiredCrystals = nextRedeemItem ? nextRedeemItem.price : 1;
  const crystalsNeeded = nextRedeemItem ? Math.max(0, requiredCrystals - crystals) : 0;
  const redeemProgressPercent = nextRedeemItem
    ? Math.min(100, Math.round((crystals / requiredCrystals) * 100))
    : 100;

  // Trigger celebration particle explosion
  const triggerParticleBurst = (originX?: number, originY?: number) => {
    const x = originX ?? window.innerWidth / 2;
    const y = originY ?? window.innerHeight / 2;

    const colors = ['#FF6392', '#FFD1DC', '#FFD700', '#38BDF8', '#A855F7', '#F43F5E', '#10B981', '#F59E0B'];
    const iconTypes: ('sparkle' | 'star' | 'circle' | 'heart' | 'trophy')[] = ['sparkle', 'star', 'circle', 'heart', 'trophy'];

    const newParticles: Particle[] = [];
    const count = 36;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
      const speed = 120 + Math.random() * 220;
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 14 + Math.floor(Math.random() * 16),
        iconType: iconTypes[Math.floor(Math.random() * iconTypes.length)],
      });
    }

    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 1200);
  };

  const handleClaim = (e: React.MouseEvent, ach: Achievement) => {
    e.stopPropagation();
    soundEngine.playCoin();
    triggerParticleBurst(e.clientX, e.clientY);
    setToastMessage({
      title: `🎉 成功解锁成就【${ach.title}】！`,
      subtitle: `获得 +${ach.rewardCrystals} 草莓水晶奖励！`,
    });
    setTimeout(() => setToastMessage(null), 3200);

    onClaimAchievement(ach.id, ach.rewardCrystals);
  };

  const handleRedeem = (e: React.MouseEvent, item: RedeemItem) => {
    e.stopPropagation();
    soundEngine.playCoin();
    triggerParticleBurst(e.clientX, e.clientY);
    setToastMessage({
      title: `✨ 成功兑换【${item.name}】！`,
      subtitle: `已成功解锁个性外观，快去装备使用吧！`,
    });
    setTimeout(() => setToastMessage(null), 3200);

    onRedeemItem(item);
  };

  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Particle Explosions Overlay */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: p.x,
              y: p.y,
              scale: 0.2,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: p.x + p.vx,
              y: p.y + p.vy,
              scale: [0.3, 1.3, 0],
              opacity: [1, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="pointer-events-none fixed z-60 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ color: p.color }}
          >
            {p.iconType === 'sparkle' && <Sparkles style={{ width: p.size, height: p.size }} className="fill-current" />}
            {p.iconType === 'star' && <Star style={{ width: p.size, height: p.size }} className="fill-current" />}
            {p.iconType === 'heart' && <Heart style={{ width: p.size, height: p.size }} className="fill-current" />}
            {p.iconType === 'trophy' && <Trophy style={{ width: p.size, height: p.size }} className="fill-current" />}
            {p.iconType === 'circle' && (
              <div
                className="rounded-full shadow-xs"
                style={{ width: p.size * 0.7, height: p.size * 0.7, backgroundColor: p.color }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Celebration Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className="fixed top-8 z-70 bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-white font-extrabold px-6 py-3 rounded-2xl shadow-2xl border-2 border-white flex flex-col items-center gap-0.5 text-center"
          >
            <div className="text-sm font-black flex items-center gap-1.5">
              <Award className="w-5 h-5 text-amber-200 fill-amber-300 animate-bounce" />
              <span>{toastMessage.title}</span>
            </div>
            <div className="text-xs text-pink-100 font-bold">{toastMessage.subtitle}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Outer Modal Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#FFF9FA] rounded-[32px] p-3.5 sm:p-5 border-[3px] border-[#F7C6D0] shadow-2xl flex flex-col gap-3 max-h-[94vh] relative overflow-hidden"
      >
        {/* Inner Lace Panel */}
        <div className="bg-[#FFFDF7] rounded-[24px] p-3 sm:p-5 border-2 border-[#F9B9C8] flex flex-col gap-3 shadow-xs overflow-hidden flex-1">
          {/* Header Tabs Row */}
          <div className="flex items-center justify-between shrink-0">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setActiveTab('achievements');
                }}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-[#E85575] text-white border-[#D64262] shadow-sm'
                    : 'bg-[#FFF2F5] text-[#D85A7F] border-[#F7C6D0] hover:bg-[#FFE8EE]'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>成就任务</span>
                {activeTab === 'achievements' && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs leading-none">🎀</span>
                )}
              </button>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setActiveTab('shop');
                }}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  activeTab === 'shop'
                    ? 'bg-[#E85575] text-white border-[#D64262] shadow-sm'
                    : 'bg-[#FFF2F5] text-[#D85A7F] border-[#F7C6D0] hover:bg-[#FFE8EE]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>萌粉兑换所</span>
                {activeTab === 'shop' && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs leading-none">🎀</span>
                )}
              </button>
            </div>

            {/* Top Right Controls: Crystals & Close Button */}
            <div className="flex items-center gap-2">
              {/* Crystals Badge Pill */}
              <div className="flex items-center gap-1.5 bg-[#FFEAEF] border-2 border-[#F7B6C6] text-[#D85A7F] font-black px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-2xs">
                <Gift className="w-4 h-4 text-[#E85575] fill-[#FFD1DC]" />
                <span>草莓水晶: <span className="text-[#E85575] font-extrabold">{crystals}</span></span>
              </div>

              {/* Close Ring Button with Ribbon */}
              <div className="relative">
                <button
                  onClick={onClose}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F0F6FC] hover:bg-[#E3EFFD] border-2 border-[#CBE0F8] text-[#78A1D1] hover:text-[#537188] flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
                  title="关闭"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs leading-none pointer-events-none drop-shadow-2xs">
                  🎀
                </span>
              </div>
            </div>
          </div>

          {/* Ribbon Dashed Divider */}
          <div className="relative border-t-2 border-dashed border-[#F7C6D0] my-0.5 flex items-center justify-center shrink-0">
            <span className="absolute -top-3 bg-[#FFFDF7] px-2 text-base leading-none drop-shadow-2xs">
              🎀
            </span>
          </div>

          {/* PROGRESS BARS BANNER */}
          <div className="bg-[#FFF8FA] p-3 sm:p-3.5 rounded-2xl border-2 border-dashed border-[#F8D0DA] shadow-2xs flex flex-col gap-2.5 shrink-0 text-left">
            {/* Row 1: Achievement Overall Progress Bar */}
            <div className="flex items-center justify-between text-xs font-black text-[#2C3E50]">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#E85575]" />
                <span>成就达成总进度 ({unlockedCount}/{totalAchievements})</span>
              </div>
              <span className="bg-[#FFE8EE] text-[#D85A7F] px-2.5 py-0.5 rounded-lg border border-[#F7B6C6] text-[11px] font-black">
                {achProgressPercent}%
              </span>
            </div>
            <div className="w-full h-3 bg-[#FFF0F3] rounded-full overflow-hidden border border-[#F8C4D0] p-0.5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${achProgressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#FF92AE] to-[#E85575] rounded-full"
              />
            </div>

            {/* Row 2: Distance to Next Redeem Target Progress Bar */}
            {nextRedeemItem ? (
              <div className="bg-[#FFFDF9] p-2.5 rounded-xl border border-[#F8D0DA] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#34495E]">
                    <Target className="w-4 h-4 text-[#F39C12] shrink-0" />
                    <span>距离下一个兑换【<span className="text-[#E85575] font-black">{nextRedeemItem.name}</span>】：</span>
                  </div>
                  <div className="text-[11px] font-extrabold text-[#D85A7F]">
                    {crystalsNeeded > 0 ? (
                      <span>还差 <span className="text-[#E85575] font-black text-xs">{crystalsNeeded}</span> 水晶</span>
                    ) : (
                      <span className="text-emerald-600 font-black">✨ 水晶充足，随时可兑！</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Gingham Blue Pattern Progress Bar */}
                  <div className="flex-1 h-3.5 bg-gingham-blue rounded-full overflow-hidden border-2 border-[#CBE0F8] relative p-0.5 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${redeemProgressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#83B8EE] via-[#65A3EA] to-[#408AD8] rounded-full relative shadow-xs"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      />
                    </motion.div>
                  </div>
                  <span className="text-[11px] font-black text-[#E85575] min-w-[60px] text-right">
                    {crystals} / {nextRedeemItem.price} 水晶
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-xs font-extrabold text-emerald-800 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-200" />
                <span>🎉 恭喜！已解锁萌粉兑换所全部限定道具！</span>
              </div>
            )}
          </div>

          {/* Scrollable List Area */}
          <div className="flex-1 overflow-y-auto pr-1">
            {/* TAB 1: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="flex flex-col gap-3.5 pt-2">
                {achievements.map((ach) => {
                  const isMet = isAchievementMet(ach, stats);
                  const isUnlocked = ach.unlocked;

                  return (
                    <div
                      key={ach.id}
                      className="relative bg-[#FFFDF8] p-3.5 rounded-2xl border-2 border-dashed border-[#F7C6D0] shadow-2xs flex items-center justify-between gap-3 text-left transition-all hover:border-[#E85575]"
                    >
                      {/* Top Ribbon Bow Accent on Item Frame */}
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs leading-none drop-shadow-2xs">
                        🎀
                      </span>

                      {/* Left Trophy Scallop Circle Badge */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="relative w-12 h-12 rounded-full bg-[#FFE8EE] border-2 border-dashed border-[#F7B6C6] flex items-center justify-center shrink-0 shadow-2xs">
                          <Trophy className={`w-6 h-6 ${isUnlocked ? 'text-[#E85575]' : isMet ? 'text-[#F39C12]' : 'text-[#A0AEC0]'}`} />
                          <span className="absolute -bottom-1.5 text-[10px] leading-none">🎀</span>
                        </div>

                        {/* Title & Description */}
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <div className="font-extrabold text-sm sm:text-base text-[#2C3E50] tracking-tight truncate">
                            {ach.title}
                          </div>
                          <div className="text-xs text-[#64748B] font-semibold truncate">
                            {ach.description}
                          </div>

                          {/* Progress indicator if any */}
                          {ach.progress !== undefined && ach.maxProgress !== undefined && !isUnlocked && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#CBD5E1]">
                                <div
                                  className="h-full bg-[#E85575] rounded-full"
                                  style={{ width: `${Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100))}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-[#94A3B8]">
                                {ach.progress}/{ach.maxProgress}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Action Button */}
                      {isUnlocked ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs bg-emerald-50 px-3.5 py-2 rounded-2xl border-2 border-emerald-200 shrink-0 shadow-2xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>已完成</span>
                        </div>
                      ) : isMet ? (
                        /* CLAIMABLE ACTIVE BUTTON */
                        <button
                          onClick={(e) => handleClaim(e, ach)}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-[#E85575] to-[#FF7597] hover:from-[#D64262] hover:to-[#E85575] text-white font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-md border-2 border-white transition-all cursor-pointer active:scale-95 shrink-0"
                        >
                          <Gift className="w-4 h-4 text-amber-200 fill-amber-300 animate-pulse" />
                          <span>解锁 (+{ach.rewardCrystals})</span>
                        </button>
                      ) : (
                        /* GREY DISABLED BUTTON (Criteria NOT met yet) */
                        <button
                          disabled
                          className="flex items-center gap-1.5 bg-[#E2E8F0] text-[#94A3B8] font-bold text-xs sm:text-sm px-4 py-2 rounded-2xl border-2 border-[#CBD5E1] cursor-not-allowed shrink-0"
                          title="未达到解锁条件"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>解锁 (+{ach.rewardCrystals})</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: REDEEM SHOP */}
            {activeTab === 'shop' && (
              <div className="flex flex-col gap-3.5 pt-2">
                <p className="text-xs text-[#64748B] text-left font-bold bg-[#FFEAEF] p-2.5 rounded-xl border border-[#F7B6C6]">
                  ✨ 使用【草莓水晶】即可兑换限定个性卡牌背面与初始特色卡组！
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {redeemItems.map((item) => {
                    const isCardBack = item.type === 'card_back';
                    const isEquipped = isCardBack
                      ? activeCardBack === item.id
                      : activeDeckSkin === item.id;
                    const canAfford = crystals >= item.price;

                    return (
                      <div
                        key={item.id}
                        className="relative bg-[#FFFDF8] p-3.5 rounded-2xl border-2 border-dashed border-[#F7C6D0] shadow-2xs flex flex-col justify-between gap-3 text-left hover:border-[#E85575] transition-all"
                      >
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] leading-none drop-shadow-2xs">
                          🎀
                        </span>

                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-16 rounded-xl ${
                              item.previewColor || 'bg-[#FFB6C1]'
                            } border-2 border-white shadow-xs flex items-center justify-center text-white shrink-0`}
                          >
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="font-extrabold text-sm text-[#2C3E50]">{item.name}</div>
                            <div className="text-[11px] text-[#64748B] font-medium leading-snug">{item.description}</div>
                          </div>
                        </div>

                        {item.unlocked ? (
                          isEquipped ? (
                            <div className="w-full bg-[#E85575] text-white font-black text-xs py-2 rounded-xl text-center shadow-2xs border border-white">
                              使用中 ✨
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                soundEngine.playPop();
                                if (isCardBack) onSelectCardBack(item.id);
                                else onSelectDeckSkin(item.id);
                              }}
                              className="w-full bg-[#FFEAEF] hover:bg-[#FFD1DC] text-[#D85A7F] font-extrabold text-xs py-2 rounded-xl text-center border-2 border-[#F7B6C6] transition-colors cursor-pointer"
                            >
                              装备此样式
                            </button>
                          )
                        ) : canAfford ? (
                          /* ACTIVE CAN-AFFORD REDEEM BUTTON */
                          <button
                            onClick={(e) => handleRedeem(e, item)}
                            className="w-full bg-gradient-to-r from-[#E85575] to-[#FF7597] hover:from-[#D64262] hover:to-[#E85575] text-white font-black text-xs py-2 rounded-xl shadow-xs border-2 border-white transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            <span>兑换 ({item.price} 水晶)</span>
                          </button>
                        ) : (
                          /* GREY DISABLED BUTTON (INSUFFICIENT CRYSTALS) */
                          <button
                            disabled
                            className="w-full bg-[#E2E8F0] text-[#94A3B8] font-bold text-xs py-2 rounded-xl border-2 border-[#CBD5E1] cursor-not-allowed flex items-center justify-center gap-1"
                            title="草莓水晶不足"
                          >
                            <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>兑换 ({item.price} 水晶)</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

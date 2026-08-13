import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BoosterPackData,
  HandLevelMap,
  JokerData,
  PlanetCardData,
  TarotCardData,
  VoucherData,
} from '../types';
import { JokerCard } from './JokerCard';
import { soundEngine } from '../utils/audio';
import { ShoppingBag, RotateCw, ArrowRight, Coins, Sparkles, Wand2, Layers } from 'lucide-react';

interface ShopModalProps {
  money: number;
  jokers: JokerData[];
  consumables: (TarotCardData | PlanetCardData)[];
  shopJokers: JokerData[];
  shopConsumables: (TarotCardData | PlanetCardData)[];
  shopPacks: BoosterPackData[];
  shopVouchers: VoucherData[];
  onBuyJoker: (joker: JokerData) => void;
  onBuyConsumable: (item: TarotCardData | PlanetCardData) => void;
  onBuyPack: (pack: BoosterPackData) => void;
  onBuyVoucher: (voucher: VoucherData) => void;
  onSellJoker: (jokerId: string) => void;
  onSellConsumable: (itemId: string) => void;
  onRerollShop: () => void;
  onNextRound: () => void;
  handLevels: HandLevelMap;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  money,
  jokers,
  consumables,
  shopJokers,
  shopConsumables,
  shopPacks,
  shopVouchers,
  onBuyJoker,
  onBuyConsumable,
  onBuyPack,
  onBuyVoucher,
  onSellJoker,
  onSellConsumable,
  onRerollShop,
  onNextRound,
  handLevels,
}) => {
  const rerollCost = 5;

  return (
    <div className="fixed inset-0 bg-pink-900/60 backdrop-blur-md z-40 flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-4 sm:p-6 border-4 border-pink-300 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto"
      >
        {/* Shop Title Bar */}
        <div className="flex items-center justify-between border-b-2 border-pink-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-600">粉红萌宠甜品屋 (商店)</h2>
              <p className="text-xs text-slate-500">购买小丑牌、魔法塔罗牌与行星卡包提升实力！</p>
            </div>
          </div>

          {/* Current Money & Next Round */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-400 text-amber-950 font-black px-4 py-2 rounded-2xl shadow-sm text-base">
              <Coins className="w-5 h-5 text-amber-800" />
              <span>${money}</span>
            </div>

            <button
              onClick={() => {
                soundEngine.playPop();
                onNextRound();
              }}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm sm:text-base px-5 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <span>进入下一关</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Inventory (Top Slots) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 p-3 rounded-2xl border border-pink-200 shadow-xs">
          {/* Jokers Owned (5 max) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-700 flex items-center gap-1">
                <span>🤡 小丑牌槽位</span>
                <span className="text-pink-500">({jokers.length} / 5)</span>
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 min-h-[148px]">
              {jokers.map((joker, idx) => (
                <JokerCard
                  key={joker.id + idx}
                  item={joker}
                  type="joker"
                  onSell={() => {
                    soundEngine.playCoin();
                    onSellJoker(joker.id);
                  }}
                />
              ))}
              {Array.from({ length: Math.max(0, 5 - jokers.length) }).map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-36 border-2 border-dashed border-pink-200 rounded-2xl flex items-center justify-center text-pink-300 text-xs font-bold"
                >
                  空槽位
                </div>
              ))}
            </div>
          </div>

          {/* Consumables Owned (2 max) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-700 flex items-center gap-1">
                <Wand2 className="w-4 h-4 text-purple-500" />
                <span>消耗牌槽位 (魔法/行星)</span>
                <span className="text-purple-500">({consumables.length} / 2)</span>
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 min-h-[148px]">
              {consumables.map((item, idx) => (
                <JokerCard
                  key={item.id + idx}
                  item={item}
                  type={'targetSuit' in item ? 'tarot' : 'planet'}
                  onSell={() => {
                    soundEngine.playCoin();
                    onSellConsumable(item.id);
                  }}
                />
              ))}
              {Array.from({ length: Math.max(0, 2 - consumables.length) }).map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-36 border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-center text-purple-300 text-xs font-bold"
                >
                  空槽位
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop Items Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-rose-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>今日货架商品</span>
            </span>

            {/* Reroll Button */}
            <button
              onClick={() => {
                if (money >= rerollCost) {
                  soundEngine.playCoin();
                  onRerollShop();
                }
              }}
              disabled={money < rerollCost}
              className={`flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl border transition-all ${
                money >= rerollCost
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>刷新商品 (${rerollCost})</span>
            </button>
          </div>

          {/* Available Jokers for sale */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {shopJokers.map((joker) => (
              <JokerCard
                key={joker.id}
                item={joker}
                type="joker"
                isShopItem
                price={joker.cost}
                isDisabled={money < joker.cost || jokers.length >= 5}
                onClick={() => {
                  if (money >= joker.cost && jokers.length < 5) {
                    soundEngine.playCoin();
                    onBuyJoker(joker);
                  }
                }}
              />
            ))}

            {/* Available Consumables for sale */}
            {shopConsumables.map((item) => (
              <JokerCard
                key={item.id}
                item={item}
                type={'targetSuit' in item ? 'tarot' : 'planet'}
                isShopItem
                price={item.cost}
                isDisabled={money < item.cost || consumables.length >= 2}
                onClick={() => {
                  if (money >= item.cost && consumables.length < 2) {
                    soundEngine.playCoin();
                    onBuyConsumable(item);
                  }
                }}
              />
            ))}
          </div>

          {/* Booster Packs & Vouchers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Packs */}
            {shopPacks.map((pack) => (
              <div
                key={pack.id}
                className="bg-white p-3 rounded-2xl border-2 border-pink-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-800">{pack.name}</div>
                    <div className="text-[10px] text-slate-500">{pack.description}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (money >= pack.cost) {
                      soundEngine.playCoin();
                      onBuyPack(pack);
                    }
                  }}
                  disabled={money < pack.cost}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                    money >= pack.cost
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  ${pack.cost} 开启
                </button>
              </div>
            ))}

            {/* Vouchers */}
            {shopVouchers.map((v) => (
              <div
                key={v.id}
                className="bg-white p-3 rounded-2xl border-2 border-purple-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    🎖️
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-800">{v.name}</div>
                    <div className="text-[10px] text-slate-500">{v.description}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (money >= v.cost && !v.bought) {
                      soundEngine.playCoin();
                      onBuyVoucher(v);
                    }
                  }}
                  disabled={money < v.cost || v.bought}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                    v.bought
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : money >= v.cost
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {v.bought ? '已拥有' : `$${v.cost} 购买`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

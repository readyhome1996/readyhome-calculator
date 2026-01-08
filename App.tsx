
import React, { useState, useMemo, useCallback } from 'react';
import { ItemData, CalculationResult } from './types.ts';
import { INITIAL_ITEMS, BRAND_NAME, STORE_URL, KOREAN_HOLIDAYS, COLORS } from './constants.ts';

type Step = 'landing' | 'input' | 'result';

const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const dateString = date.toISOString().split('T')[0];
  return !KOREAN_HOLIDAYS.includes(dateString);
};

const formatDate = (date: Date): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
};

const ItemCard: React.FC<{
  item: ItemData;
  onUpdate: (id: string, updates: Partial<ItemData>) => void;
}> = ({ item, onUpdate }) => {
  return (
    <div className={`border-4 rounded-3xl p-6 mb-6 transition-all ${item.isActive ? 'border-blue-600 bg-white shadow-xl' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center space-x-5 mb-4">
        <div className="relative">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className={`w-20 h-20 rounded-2xl object-cover bg-white ${!item.isActive && 'grayscale opacity-50'}`}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=READYHOME'; }}
          />
          {item.isActive && (
            <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <span className="font-black">✓</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={item.isActive} 
              onChange={() => onUpdate(item.id, { isActive: !item.isActive })}
              className="w-8 h-8 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-2xl font-black text-gray-900">{item.name}</span>
          </label>
        </div>
      </div>

      {item.isActive && (
        <div className="space-y-6 pt-6 border-t-2 border-dashed border-gray-100 animate-fadeIn">
          <div>
            <label className="block text-xl font-bold text-gray-700 mb-3">현재 보유량 (팩)</label>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onUpdate(item.id, { packsOwned: Math.max(0, item.packsOwned - 1) })}
                className="w-16 h-16 flex items-center justify-center border-4 border-gray-200 rounded-2xl text-4xl font-bold bg-white active:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={item.packsOwned || ''}
                onChange={(e) => onUpdate(item.id, { packsOwned: Number(e.target.value) })}
                className="flex-1 h-16 border-4 border-gray-300 rounded-2xl text-center text-3xl font-black focus:border-blue-500 outline-none"
                placeholder="0"
              />
              <button 
                onClick={() => onUpdate(item.id, { packsOwned: item.packsOwned + 1 })}
                className="w-16 h-16 flex items-center justify-center border-4 border-gray-200 rounded-2xl text-4xl font-bold bg-white active:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-bold text-gray-600 mb-2">팩당 개수</label>
              <input
                type="number"
                inputMode="numeric"
                value={item.unitsPerPack || ''}
                onChange={(e) => onUpdate(item.id, { unitsPerPack: Number(e.target.value) })}
                className="w-full h-16 border-4 border-gray-200 rounded-2xl px-4 text-2xl font-bold focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-600 mb-2">하루 사용량</label>
              <input
                type="number"
                inputMode="numeric"
                value={item.dailyUsage || ''}
                onChange={(e) => onUpdate(item.id, { dailyUsage: Number(e.target.value) })}
                className="w-full h-16 border-4 border-gray-200 rounded-2xl px-4 text-2xl font-bold focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [items, setItems] = useState<ItemData[]>(INITIAL_ITEMS);

  const results = useMemo(() => {
    const now = new Date();
    return items
      .filter(it => it.isActive && it.dailyUsage > 0)
      .map(it => {
        const availableDays = (it.packsOwned * it.unitsPerPack) / it.dailyUsage;
        const exhaustionDate = new Date(now.getTime() + availableDays * 24 * 60 * 60 * 1000);
        return {
          itemId: it.id,
          itemName: it.name,
          imageUrl: it.imageUrl,
          availableDays,
          exhaustionDate
        };
      })
      .sort((a, b) => a.availableDays - b.availableDays);
  }, [items]);

  const urgentItem = results[0] || null;

  const recommendedOrderDate = useMemo(() => {
    if (!urgentItem) return null;
    let d = new Date(urgentItem.exhaustionDate);
    let count = 3; // 3영업일 전 주문 권장
    while (count > 0) {
      d.setDate(d.getDate() - 1);
      if (isBusinessDay(d)) count--;
    }
    return formatDate(d < new Date() ? new Date() : d);
  }, [urgentItem]);

  const updateItem = useCallback((id: string, updates: Partial<ItemData>) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...updates } : it));
  }, []);

  const handleGoStore = () => {
    const ids = results.map(r => r.itemId).join(',');
    window.open(`${STORE_URL}/shop?from=calculator&items=${ids}`, '_blank');
  };

  const renderLanding = () => (
    <div className="flex flex-col items-center text-center px-4 animate-fadeIn min-h-[80vh] justify-center">
      <div className="w-full max-w-md mb-10 rounded-[3rem] overflow-hidden shadow-2xl bg-gray-200 aspect-[2.5/1]">
        <img 
          src="https://images.unsplash.com/photo-1581056316607-a662829cde8b?auto=format&fit=crop&q=80&w=1200&h=480" 
          alt="레디홈" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mb-6 flex items-center space-x-2">
        <span className="text-3xl font-black text-blue-600">READYHOME</span>
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
        기저귀 재고,<br/>언제 주문할까요?
      </h1>
      <p className="text-2xl text-gray-600 mb-12 font-medium">
        남은 양을 입력하면<br/>
        자동으로 계산해 드릴게요.
      </p>
      <button 
        onClick={() => setStep('input')}
        className="w-full max-w-sm bg-blue-600 text-white font-black py-7 rounded-[2rem] text-3xl shadow-2xl active:scale-95 transition-transform"
      >
        계산 시작하기
      </button>
      <p className="mt-8 text-gray-400 font-bold text-lg">이 계산기는 레디홈이 만들었습니다.</p>
    </div>
  );

  const renderInput = () => (
    <div className="animate-fadeIn pb-40">
      <header className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
          현재 보유하신<br/>제품을 알려주세요.
        </h2>
        <p className="text-xl text-gray-500 font-bold">체크(✓) 후 수량을 입력해 주세요.</p>
      </header>

      <div className="space-y-2">
        {items.map(it => <ItemCard key={it.id} item={it} onUpdate={updateItem} />)}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-xl border-t-2 border-gray-100 max-w-xl mx-auto z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button 
          disabled={results.length === 0}
          onClick={() => { window.scrollTo(0,0); setStep('result'); }}
          className={`w-full py-6 rounded-[2rem] text-3xl font-black shadow-xl transition-all ${
            results.length > 0 ? 'bg-blue-600 text-white active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          계산 결과 확인
        </button>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="animate-fadeIn space-y-10 pb-20">
      <header className="text-center pt-6">
        <div className="inline-block px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xl font-black mb-6">계산 결과 리포트</div>
        <div className="bg-white border-[6px] border-blue-600 rounded-[3.5rem] p-12 shadow-2xl">
          <p className="text-2xl text-gray-500 font-bold mb-4">가장 빨리 소진되는 날까지</p>
          <div className="text-7xl font-black text-blue-600 mb-6">
            {urgentItem?.availableDays.toFixed(1)}일
          </div>
          <div className="bg-blue-600 text-white inline-block px-8 py-3 rounded-full text-2xl font-black">
            {urgentItem ? formatDate(urgentItem.exhaustionDate) : '-'} 예정
          </div>
        </div>
      </header>

      {urgentItem && (
        <section className="bg-red-50 border-4 border-red-200 rounded-[3rem] p-8 shadow-inner">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-black">!</div>
            <h3 className="text-3xl font-black text-red-900">제일 먼저 떨어져요</h3>
          </div>
          
          <div className="flex items-center space-x-6 mb-8 bg-white p-6 rounded-3xl shadow-sm">
            <img src={urgentItem.imageUrl} className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-100" />
            <div className="flex-1">
              <span className="text-2xl font-black text-gray-900 block">{urgentItem.itemName}</span>
              <span className="text-3xl font-black text-red-600">{urgentItem.availableDays.toFixed(1)}일 남음</span>
            </div>
          </div>

          <div className="text-center bg-white py-8 px-6 rounded-3xl border-2 border-red-100">
            <p className="text-2xl font-bold text-gray-800 leading-relaxed">
              안전한 배송을 위해<br/>
              <span className="text-4xl font-black text-blue-600 underline underline-offset-8 decoration-4">[{recommendedOrderDate}]</span>까지<br/>
              주문을 추천드려요!
            </p>
          </div>
        </section>
      )}

      <section>
        <h3 className="text-2xl font-black text-gray-900 mb-6 ml-2">전체 품목 현황</h3>
        <div className="space-y-4">
          {results.map(res => (
            <div key={res.itemId} className="bg-white border-2 border-gray-100 p-6 rounded-[2rem] flex items-center space-x-5 shadow-sm">
              <img src={res.imageUrl} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xl font-bold text-gray-800">{res.itemName}</span>
                  <span className="text-2xl font-black text-blue-600">{res.availableDays.toFixed(1)}일</span>
                </div>
                <p className="text-lg text-gray-400 font-bold text-right">{formatDate(res.exhaustionDate)} 소진</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-10 space-y-8">
        <div>
          <button 
            onClick={handleGoStore}
            className="w-full bg-blue-600 text-white font-black py-8 rounded-[2.5rem] text-3xl shadow-2xl active:scale-95 transition-transform"
          >
            이 사용량 기준으로 준비하기
          </button>
          <p className="text-center mt-4 text-gray-500 text-lg font-bold">
            계산 결과를 기준으로 레디홈 자사몰로 이동합니다.
          </p>
        </div>
        
        <button 
          onClick={() => { window.scrollTo(0,0); setStep('input'); }}
          className="w-full py-4 text-gray-400 font-bold text-2xl underline underline-offset-8"
        >
          수치 다시 입력하기
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen max-w-xl mx-auto bg-white md:shadow-2xl md:my-10 md:rounded-[4rem] overflow-hidden flex flex-col relative shadow-inner">
      <main className="flex-grow p-6 pt-10">
        {step === 'landing' && renderLanding()}
        {step === 'input' && renderInput()}
        {step === 'result' && renderResult()}
      </main>

      <footer className="bg-gray-50 border-t-2 border-gray-100 py-16 px-8 text-center mt-20">
        <div className="mb-6 opacity-30 font-black text-2xl tracking-tighter">READYHOME</div>
        <p className="text-gray-500 font-bold text-lg mb-2">이 계산기는 레디홈이 만들었습니다.</p>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          © {new Date().getFullYear()} READYHOME. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}

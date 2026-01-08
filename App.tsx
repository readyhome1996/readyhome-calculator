
import React, { useState, useMemo, useCallback } from 'react';
import { ItemData } from './types';
import { INITIAL_ITEMS, BRAND_NAME, STORE_URL, KOREAN_HOLIDAYS } from './constants';

type AppStep = 'landing' | 'input' | 'result';

const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const dateString = date.toISOString().split('T')[0];
  return !KOREAN_HOLIDAYS.includes(dateString);
};

const formatDateWithDay = (date: Date): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
};

const ItemInputRow: React.FC<{
  item: ItemData;
  onChange: (id: string, updates: Partial<ItemData>) => void;
}> = ({ item, onChange }) => {
  const handleToggle = () => onChange(item.id, { isActive: !item.isActive });
  
  return (
    <div className={`border-2 rounded-2xl p-5 mb-4 transition-all ${item.isActive ? 'border-blue-600 bg-white shadow-md' : 'border-gray-200 bg-gray-50 opacity-90'}`}>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className={`w-16 h-16 rounded-xl object-cover transition-all ${item.isActive ? 'ring-4 ring-blue-100' : 'grayscale'}`} 
          />
          {item.isActive && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">
              ✓
            </div>
          )}
        </div>
        
        <label className="flex flex-col cursor-pointer flex-1">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={item.isActive}
              onChange={handleToggle}
              className="w-6 h-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xl font-bold text-gray-800">{item.name}</span>
          </div>
        </label>
      </div>

      {item.isActive && (
        <div className="space-y-6 mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
          <div>
            <div className="flex items-baseline space-x-2 mb-2">
              <label className="text-gray-600 font-bold text-lg">현재 보유량 (팩)</label>
              <span className="text-gray-400 text-sm font-normal">현재 보유한 팩 수를 적어주세요.</span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onChange(item.id, { packsOwned: Math.max(0, item.packsOwned - 1) })}
                className="w-14 h-14 flex items-center justify-center border-2 border-gray-300 rounded-xl text-3xl font-bold bg-white active:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={item.packsOwned || ''}
                onChange={(e) => onChange(item.id, { packsOwned: Number(e.target.value) })}
                placeholder="0"
                className="flex-1 h-14 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                onClick={() => onChange(item.id, { packsOwned: item.packsOwned + 1 })}
                className="w-14 h-14 flex items-center justify-center border-2 border-gray-300 rounded-xl text-3xl font-bold bg-white active:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1 text-base font-bold">
                팩당 개수 <span className="text-blue-600 text-[11px] whitespace-nowrap">(레디홈 기준·수정가능)</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={item.unitsPerPack || ''}
                onChange={(e) => onChange(item.id, { unitsPerPack: Number(e.target.value) })}
                className="w-full h-14 border-2 border-gray-300 rounded-xl px-4 text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">※ 사이즈별로 다를 수 있습니다.</p>
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-base font-bold">하루 사용량</label>
              <input
                type="number"
                inputMode="numeric"
                value={item.dailyUsage || ''}
                onChange={(e) => onChange(item.id, { dailyUsage: Number(e.target.value) })}
                className="w-full h-14 border-2 border-gray-300 rounded-xl px-4 text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">하루 평균 사용량을 적어주세요.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [items, setItems] = useState<ItemData[]>(INITIAL_ITEMS);

  const activeResults = useMemo(() => {
    const now = new Date();
    return items
      .filter(item => item.isActive && item.dailyUsage > 0)
      .map(item => {
        const availableDays = (item.packsOwned * item.unitsPerPack) / item.dailyUsage;
        const exhaustionDate = new Date(now.getTime() + availableDays * 24 * 60 * 60 * 1000);
        return {
          itemId: item.id,
          itemName: item.name,
          imageUrl: item.imageUrl,
          availableDays: availableDays,
          exhaustionDate: exhaustionDate
        };
      });
  }, [items]);

  const urgentItem = useMemo(() => {
    if (activeResults.length === 0) return null;
    return [...activeResults].sort((a, b) => a.availableDays - b.availableDays)[0];
  }, [activeResults]);

  const recommendedOrderDate = useMemo(() => {
    if (!urgentItem) return null;
    let orderDate = new Date(urgentItem.exhaustionDate);
    let businessDaysToSubstract = 3;
    const now = new Date();
    while (businessDaysToSubstract > 0) {
      orderDate.setDate(orderDate.getDate() - 1);
      if (isBusinessDay(orderDate)) businessDaysToSubstract--;
    }
    return formatDateWithDay(orderDate < now ? now : orderDate);
  }, [urgentItem]);

  const handleItemChange = useCallback((id: string, updates: Partial<ItemData>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const handleCTA = () => {
    const itemQuery = activeResults.map(r => r.itemId).join(',');
    window.open(`${STORE_URL}/shop?from=calculator&items=${itemQuery}`, '_blank');
  };

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 animate-fadeIn">
      <div className="w-full mb-10 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600" 
          alt="레디홈 케어" 
          className="w-full h-56 object-cover"
        />
      </div>
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">R</div>
          <span className="text-2xl font-black text-blue-600 tracking-tight">READYHOME</span>
        </div>
        <h2 className="text-xl font-bold text-gray-400 mb-2">시니어를 위한 간편한 도구</h2>
        <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">재고·구매 시점<br/>자동 계산기</h1>
      </div>
      <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium">
        남은 기저귀와 위생용품,<br/>
        언제 다시 주문해야 할지<br/>
        레디홈이 알려드릴게요.
      </p>
      <button 
        onClick={() => { window.scrollTo(0, 0); setStep('input'); }}
        className="w-full max-w-sm bg-blue-600 text-white font-bold py-6 rounded-2xl text-2xl shadow-xl active:scale-95 transition-transform"
      >
        계산 시작하기
      </button>
    </div>
  );

  const renderInput = () => (
    <div className="animate-fadeIn pb-36">
      <header className="mb-8 pt-4">
        <h2 className="text-3xl font-black text-gray-900 mb-2 leading-snug">
          어떤 제품을<br/>사용 중이신가요?
        </h2>
        <p className="text-gray-500 text-lg">
          체크(✓)한 제품의 상세 정보를 적어주세요.
        </p>
      </header>

      <section className="space-y-4">
        {items.map(item => (
          <ItemInputRow key={item.id} item={item} onChange={handleItemChange} />
        ))}
      </section>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t border-gray-100 max-w-xl mx-auto z-20 shadow-[0_-4px_30px_rgba(0,0,0,0.1)]">
        <button 
          disabled={activeResults.length === 0}
          onClick={() => { window.scrollTo(0, 0); setStep('result'); }}
          className={`w-full py-5 rounded-2xl text-2xl font-bold shadow-lg transition-all ${
            activeResults.length > 0 
              ? 'bg-blue-600 text-white active:scale-95' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          계산 완료하기
        </button>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="animate-fadeIn space-y-8 pb-10">
      <header className="pt-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-wider">계산 결과</h2>
        <div className="bg-white border-2 border-blue-600 rounded-3xl p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12"></div>
          <p className="text-gray-500 text-xl mb-3 relative">현재 기준 사용 가능 기간</p>
          <div className="text-6xl font-black text-blue-600 mb-4 relative">
            [ {urgentItem ? urgentItem.availableDays.toFixed(1) : '0.0'}일 ]
          </div>
          <div className="inline-block bg-blue-100 text-blue-800 px-6 py-2 rounded-full font-black text-xl mb-3 relative">
            소진 예정: {urgentItem ? formatDateWithDay(urgentItem.exhaustionDate) : '-'}
          </div>
          <p className="text-sm text-gray-400 block mt-2">※ 가장 빨리 소진되는 품목 기준</p>
        </div>
      </header>

      {urgentItem && (
        <div className="bg-red-50 border-4 border-red-100 rounded-[2rem] p-8 shadow-inner">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl">!</div>
            <span className="text-2xl font-black text-red-800">주문이 시급한 품목</span>
          </div>
          <div className="flex items-center space-x-6 mb-6">
            <img src={urgentItem.imageUrl} alt={urgentItem.itemName} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
            <div className="flex-1">
              <span className="text-2xl font-black text-gray-900 block mb-1">{urgentItem.itemName}</span>
              <span className="text-3xl font-black text-red-600">[ {urgentItem.availableDays.toFixed(1)}일 남음 ]</span>
            </div>
          </div>
          
          <div className="text-center space-y-6 bg-white p-6 rounded-2xl border border-red-100">
            <p className="text-2xl text-gray-800 leading-relaxed font-bold">
              안전한 사용을 위해<br/>
              <span className="text-3xl font-black text-blue-600 underline underline-offset-8 decoration-4">[{recommendedOrderDate}]</span>까지<br/>
              주문을 완료해주세요!
            </p>
            <p className="text-lg text-gray-500 font-medium">
              (배송 지연 방지를 위해 3일 전 권장)
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <h3 className="text-2xl font-black text-gray-900 ml-1">상세 현황</h3>
        <div className="space-y-4">
          {activeResults.map(res => (
            <div key={res.itemId} className="flex items-center space-x-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <img src={res.imageUrl} alt={res.itemName} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">{res.itemName}</span>
                  <span className="text-2xl font-black text-blue-600">{res.availableDays.toFixed(1)}일</span>
                </div>
                <div className="text-right">
                  <span className="text-base text-gray-500 font-medium">{formatDateWithDay(res.exhaustionDate)} 소진 예정</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 space-y-6 pb-12">
        <button 
          onClick={handleCTA}
          className="w-full bg-blue-600 text-white font-bold py-7 rounded-2xl text-2xl shadow-2xl active:scale-95 transition-transform"
        >
          이 사용량 기준으로 준비하기
        </button>
        <p className="text-center text-gray-500 text-lg font-bold">
          레디홈 자사몰로 이동하여<br/>부족한 제품을 준비하세요.
        </p>
        <button 
          onClick={() => { window.scrollTo(0, 0); setStep('input'); }}
          className="w-full py-4 text-gray-400 font-bold text-xl hover:text-gray-600 transition-all underline underline-offset-4"
        >
          다시 계산하기
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen max-w-xl mx-auto bg-white md:shadow-2xl md:my-10 md:rounded-[3.5rem] overflow-x-hidden relative flex flex-col">
      <main className={`flex-grow px-6 py-6 ${step === 'input' ? 'pb-24' : ''}`}>
        {step === 'landing' && renderLanding()}
        {step === 'input' && renderInput()}
        {step === 'result' && renderResult()}
      </main>

      <footer className="mt-auto border-t border-gray-50 pt-12 pb-16 px-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-[10px] font-black">R</div>
          <p className="text-gray-400 font-bold text-lg">READYHOME</p>
        </div>
        <p className="text-gray-500 font-bold mb-2 text-base">
          본 도구는 레디홈 공식 사용량 계산기입니다.
        </p>
        <p className="text-gray-300 text-sm tracking-widest uppercase">
          © {new Date().getFullYear()} READYHOME ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}


import { ItemData } from './types.ts';

export const COLORS = {
  primary: '#2563EB', // 레디홈 메인 블루
  accent: '#DC2626',  // 경고용 레드
  bgLight: '#F8FAFC',
};

export const BRAND_NAME = "레디홈 (ReadyHome)";
export const STORE_URL = "https://readyhome.co.kr";

// 깃허브 업로드 전, 실제 이미지가 없어도 동작하도록 Unsplash 샘플 이미지를 연결했습니다.
// 나중에 assets 폴더에 실제 파일을 넣으실 때 파일명을 맞춰주세요.
export const INITIAL_ITEMS: ItemData[] = [
  { 
    id: 'diaper-outer', 
    name: '겉기저귀', 
    packsOwned: 0, 
    unitsPerPack: 10, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=200&h=200' 
  },
  { 
    id: 'diaper-inner', 
    name: '속기저귀', 
    packsOwned: 0, 
    unitsPerPack: 30, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=200&h=200' 
  },
  { 
    id: 'diaper-pant', 
    name: '팬티형 기저귀', 
    packsOwned: 0, 
    unitsPerPack: 10, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=200&h=200' 
  },
  { 
    id: 'mat', 
    name: '깔개매트', 
    packsOwned: 0, 
    unitsPerPack: 10, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1626073142207-6874550e20e8?auto=format&fit=crop&q=80&w=200&h=200' 
  },
  { 
    id: 'wipes', 
    name: '물티슈', 
    packsOwned: 0, 
    unitsPerPack: 72, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200&h=200' 
  },
  { 
    id: 'gloves', 
    name: '위생장갑', 
    packsOwned: 0, 
    unitsPerPack: 200, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200&h=200' 
  },
];

export const KOREAN_HOLIDAYS = [
  '2024-01-01', '2024-02-09', '2024-02-10', '2024-02-11', '2024-02-12',
  '2024-03-01', '2024-05-05', '2024-05-15', '2024-06-06', '2024-08-15',
  '2024-09-16', '2024-09-17', '2024-09-18', '2024-10-03', '2024-10-09', '2024-12-25',
  '2025-01-01', '2025-01-28', '2025-01-29', '2025-01-30', '2025-03-01',
  '2025-05-05', '2025-05-06', '2025-06-06', '2025-08-15', '2025-10-03',
  '2025-10-05', '2025-10-06', '2025-10-07', '2025-10-09', '2025-12-25'
];

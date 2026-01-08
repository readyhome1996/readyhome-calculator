
import { ItemData } from './types';

export const COLORS = {
  primary: '#2563EB', // ReadyHome Main Blue
  secondary: '#64748B',
  background: '#F8FAFC',
  accent: '#EF4444', // Red for warning
  success: '#10B981',
};

// 고품질 의료/케어 관련 이미지 사용
export const INITIAL_ITEMS: ItemData[] = [
  { 
    id: 'diaper-outer', 
    name: '겉기저귀', 
    packsOwned: 0, 
    unitsPerPack: 10, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1544126592-807daa2b565b?auto=format&fit=crop&q=80&w=200' 
  },
  { 
    id: 'diaper-inner', 
    name: '속기저귀', 
    packsOwned: 0, 
    unitsPerPack: 30, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1626012497673-206e90367319?auto=format&fit=crop&q=80&w=200' 
  },
  { 
    id: 'diaper-pant', 
    name: '팬티형 기저귀', 
    packsOwned: 0, 
    unitsPerPack: 10, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1544126592-72021077759c?auto=format&fit=crop&q=80&w=200' 
  },
  { 
    id: 'mat', 
    name: '깔개매트', 
    packsOwned: 0, 
    unitsPerPack: 10, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200' 
  },
  { 
    id: 'wipes', 
    name: '물티슈', 
    packsOwned: 0, 
    unitsPerPack: 72, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=200' 
  },
  { 
    id: 'gloves', 
    name: '위생장갑', 
    packsOwned: 0, 
    unitsPerPack: 200, 
    dailyUsage: 0, 
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=200' 
  },
];

export const BRAND_NAME = "레디홈 (ReadyHome)";
export const STORE_URL = "https://readyhome.co.kr";

export const KOREAN_HOLIDAYS = [
  '2024-01-01', '2024-02-09', '2024-02-10', '2024-02-11', '2024-02-12',
  '2024-03-01', '2024-04-10', '2024-05-05', '2024-05-06', '2024-05-15',
  '2024-06-06', '2024-08-15', '2024-09-16', '2024-09-17', '2024-09-18',
  '2024-10-03', '2024-10-09', '2024-12-25',
  '2025-01-01', '2025-01-28', '2025-01-29', '2025-01-30', '2025-03-01',
  '2025-03-03', '2025-05-05', '2025-05-06', '2025-06-06', '2025-08-15',
  '2025-10-03', '2025-10-05', '2025-10-06', '2025-10-07', '2025-10-09',
  '2025-12-25',
  '2026-01-01', '2026-02-16', '2026-02-17', '2026-02-18', '2026-03-01',
  '2026-03-02', '2026-05-05', '2026-05-24', '2026-06-06', '2026-08-15',
  '2026-09-24', '2026-09-25', '2026-09-26', '2026-10-03', '2026-10-05',
  '2026-10-09', '2026-12-25'
];

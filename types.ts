
export interface ItemData {
  id: string;
  name: string;
  packsOwned: number;
  unitsPerPack: number;
  dailyUsage: number;
  isActive: boolean;
  imageUrl: string;
}

export interface CalculationResult {
  itemId: string;
  itemName: string;
  availableDays: number;
  exhaustionDate: Date;
}

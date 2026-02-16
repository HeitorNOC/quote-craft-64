export type Room = { name: string; sqFt: number };

export type MaterialSource = 'HomeDepot' | 'Lowes' | 'Manual';

export type MaterialOption = {
  id: string;
  name: string;
  source: MaterialSource;
  pricePerSqFt: number;
  url?: string;
};

export type ManualMaterial = {
  name: string;
  pricePerSqFt: number;
};

export type CleaningTypeOption = {
  id: string;
  name: string;
  pricePerSqFt: number;
};

export type ZillowResponse = {
  address: string;
  totalSqFt: number;
  rooms: Room[];
};

export type FlooringState = {
  step: number;
  useZillow: boolean | null;
  address: string;
  totalSqFt: number;
  rooms: Room[];
  selectedRooms: string[];
  material: MaterialOption | null;
  manualMaterial: ManualMaterial | null;
  materialSource: MaterialSource | null;
  estimate: number | null;
  contact: { name: string; email: string; phone: string };
};

export type CleaningState = {
  step: number;
  useZillow: boolean | null;
  address: string;
  totalSqFt: number;
  rooms: Room[];
  selectedRooms: string[];
  cleaningType: CleaningTypeOption | null;
  estimate: number | null;
  contact: { name: string; email: string; phone: string };
};

export type Service = 'flooring' | 'cleaning' | null;

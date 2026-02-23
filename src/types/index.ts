export type Room = { name: string; sqFt: number };

export type MaterialSource = 'HomeDepot' | 'Lowes' | 'Manual';

export type MaterialOption = {
  id: string;
  name: string;
  source: MaterialSource;
  pricePerSqFt: number;
  url?: string;
  image?: string;
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
  zipCode?: string;
  bedrooms?: number;
  bathrooms?: number;
  found: boolean;
};

export type CoverageType = 'whole' | 'specific' | null;

export type CleaningFrequency = 'one-time' | 'monthly';

export type RoomMaterial = {
  room: string;
  sqFt: number;
  material: MaterialOption | null;
  manualPrice?: number;
  manualName?: string;
  url?: string; // Product URL from Home Depot or other sources
};

export type FlooringState = {
  step: number;
  useZillow: boolean | null;
  address: string;
  zipCode: string;
  totalSqFt: number;
  coverageType: CoverageType;
  knowsSqFt: boolean | null;
  rooms: Room[];
  selectedRooms: string[];
  material: MaterialOption | null;
  manualMaterial: ManualMaterial | null;
  materialSource: MaterialSource | null;
  roomMaterials: RoomMaterial[];
  estimate: number | null;
  contact: { name: string; email: string; phone: string; observations?: string };
};

export type CleaningState = {
  step: number;
  useZillow: boolean | null;
  address: string;
  zipCode: string;
  totalSqFt: number;
  coverageType: CoverageType;
  knowsSqFt: boolean | null;
  rooms: Room[];
  selectedRooms: string[];
  cleaningType: CleaningTypeOption | null;
  frequency: CleaningFrequency | null;
  roomMaterials: RoomMaterial[];
  estimate: number | null;
  contact: { name: string; email: string; phone: string; observations?: string };
};

export type Service = 'flooring' | 'cleaning' | null;

import { create } from 'zustand';
import type {
  Service, FlooringState, CleaningState,
  Room, MaterialOption, ManualMaterial, MaterialSource,
  CleaningTypeOption,
} from '@/types';

const STORAGE_KEY = 'jdServiceStore';

const defaultFlooring: FlooringState = {
  step: 1, useZillow: null, address: '', totalSqFt: 0, rooms: [],
  selectedRooms: [], material: null, manualMaterial: null,
  materialSource: null, estimate: null, contact: { email: '', phone: '' },
};

const defaultCleaning: CleaningState = {
  step: 1, useZillow: null, address: '', totalSqFt: 0, rooms: [],
  selectedRooms: [], cleaningType: null, estimate: null,
  contact: { email: '', phone: '' },
};

interface ServiceStore {
  service: Service;
  flooring: FlooringState;
  cleaning: CleaningState;
  // Service
  setService: (s: Service) => void;
  // Flooring actions
  setFlooringStep: (step: number) => void;
  setFlooringUseZillow: (v: boolean) => void;
  setFlooringAddress: (a: string) => void;
  setFlooringZillowData: (totalSqFt: number, rooms: Room[]) => void;
  setFlooringManualRooms: (rooms: Room[]) => void;
  setFlooringSelectedRooms: (rooms: string[]) => void;
  setFlooringMaterial: (m: MaterialOption | null) => void;
  setFlooringManualMaterial: (m: ManualMaterial | null) => void;
  setFlooringMaterialSource: (s: MaterialSource | null) => void;
  setFlooringEstimate: (v: number | null) => void;
  setFlooringContact: (c: { email: string; phone: string }) => void;
  // Cleaning actions
  setCleaningStep: (step: number) => void;
  setCleaningUseZillow: (v: boolean) => void;
  setCleaningAddress: (a: string) => void;
  setCleaningZillowData: (totalSqFt: number, rooms: Room[]) => void;
  setCleaningManualRooms: (rooms: Room[]) => void;
  setCleaningSelectedRooms: (rooms: string[]) => void;
  setCleaningType: (t: CleaningTypeOption | null) => void;
  setCleaningEstimate: (v: number | null) => void;
  setCleaningContact: (c: { email: string; phone: string }) => void;
  // Reset
  resetAll: () => void;
}

function loadFromStorage(): Partial<Pick<ServiceStore, 'service' | 'flooring' | 'cleaning'>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

export const useServiceStore = create<ServiceStore>((set, get) => {
  const saved = loadFromStorage();

  // Subscribe to persist
  const persistMiddleware = () => {
    const { service, flooring, cleaning } = get();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ service, flooring, cleaning }));
    } catch { /* ignore */ }
  };

  // We'll call persistMiddleware after every set
  const persistSet: typeof set = (partial, replace) => {
    set(partial, replace);
    persistMiddleware();
  };

  return {
    service: saved.service ?? null,
    flooring: { ...defaultFlooring, ...saved.flooring },
    cleaning: { ...defaultCleaning, ...saved.cleaning },

    setService: (s) => persistSet({ service: s }),

    setFlooringStep: (step) => persistSet(st => ({ flooring: { ...st.flooring, step } })),
    setFlooringUseZillow: (v) => persistSet(st => ({ flooring: { ...st.flooring, useZillow: v } })),
    setFlooringAddress: (a) => persistSet(st => ({ flooring: { ...st.flooring, address: a } })),
    setFlooringZillowData: (totalSqFt, rooms) => persistSet(st => ({ flooring: { ...st.flooring, totalSqFt, rooms } })),
    setFlooringManualRooms: (rooms) => persistSet(st => ({ flooring: { ...st.flooring, rooms, totalSqFt: rooms.reduce((s, r) => s + r.sqFt, 0) } })),
    setFlooringSelectedRooms: (rooms) => persistSet(st => ({ flooring: { ...st.flooring, selectedRooms: rooms } })),
    setFlooringMaterial: (m) => persistSet(st => ({ flooring: { ...st.flooring, material: m } })),
    setFlooringManualMaterial: (m) => persistSet(st => ({ flooring: { ...st.flooring, manualMaterial: m } })),
    setFlooringMaterialSource: (s) => persistSet(st => ({ flooring: { ...st.flooring, materialSource: s } })),
    setFlooringEstimate: (v) => persistSet(st => ({ flooring: { ...st.flooring, estimate: v } })),
    setFlooringContact: (c) => persistSet(st => ({ flooring: { ...st.flooring, contact: c } })),

    setCleaningStep: (step) => persistSet(st => ({ cleaning: { ...st.cleaning, step } })),
    setCleaningUseZillow: (v) => persistSet(st => ({ cleaning: { ...st.cleaning, useZillow: v } })),
    setCleaningAddress: (a) => persistSet(st => ({ cleaning: { ...st.cleaning, address: a } })),
    setCleaningZillowData: (totalSqFt, rooms) => persistSet(st => ({ cleaning: { ...st.cleaning, totalSqFt, rooms } })),
    setCleaningManualRooms: (rooms) => persistSet(st => ({ cleaning: { ...st.cleaning, rooms, totalSqFt: rooms.reduce((s, r) => s + r.sqFt, 0) } })),
    setCleaningSelectedRooms: (rooms) => persistSet(st => ({ cleaning: { ...st.cleaning, selectedRooms: rooms } })),
    setCleaningType: (t) => persistSet(st => ({ cleaning: { ...st.cleaning, cleaningType: t } })),
    setCleaningEstimate: (v) => persistSet(st => ({ cleaning: { ...st.cleaning, estimate: v } })),
    setCleaningContact: (c) => persistSet(st => ({ cleaning: { ...st.cleaning, contact: c } })),

    resetAll: () => {
      persistSet({ service: null, flooring: { ...defaultFlooring }, cleaning: { ...defaultCleaning } });
    },
  };
});

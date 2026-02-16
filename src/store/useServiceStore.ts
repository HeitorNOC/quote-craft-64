import { create } from 'zustand';
import type {
  Service, FlooringState, CleaningState,
  Room, MaterialOption, ManualMaterial, MaterialSource,
  CleaningTypeOption, CoverageType, CleaningFrequency,
} from '@/types';

const STORAGE_KEY = 'jdServiceStore';

const defaultFlooring: FlooringState = {
  step: 1, useZillow: null, address: '', totalSqFt: 0,
  coverageType: null, knowsSqFt: null,
  rooms: [], selectedRooms: [], material: null, manualMaterial: null,
  materialSource: null, estimate: null, contact: { name: '', email: '', phone: '' },
};

const defaultCleaning: CleaningState = {
  step: 1, useZillow: null, address: '', totalSqFt: 0,
  coverageType: null, knowsSqFt: null,
  rooms: [], selectedRooms: [], cleaningType: null, frequency: null, estimate: null,
  contact: { name: '', email: '', phone: '' },
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
  setFlooringZillowData: (totalSqFt: number) => void;
  setFlooringManualRooms: (rooms: Room[]) => void;
  setFlooringSelectedRooms: (rooms: string[]) => void;
  setFlooringCoverageType: (c: CoverageType) => void;
  setFlooringKnowsSqFt: (v: boolean | null) => void;
  setFlooringMaterial: (m: MaterialOption | null) => void;
  setFlooringManualMaterial: (m: ManualMaterial | null) => void;
  setFlooringMaterialSource: (s: MaterialSource | null) => void;
  setFlooringEstimate: (v: number | null) => void;
  setFlooringContact: (c: { name: string; email: string; phone: string }) => void;
  // Cleaning actions
  setCleaningStep: (step: number) => void;
  setCleaningUseZillow: (v: boolean) => void;
  setCleaningAddress: (a: string) => void;
  setCleaningZillowData: (totalSqFt: number) => void;
  setCleaningManualRooms: (rooms: Room[]) => void;
  setCleaningSelectedRooms: (rooms: string[]) => void;
  setCleaningCoverageType: (c: CoverageType) => void;
  setCleaningKnowsSqFt: (v: boolean | null) => void;
  setCleaningType: (t: CleaningTypeOption | null) => void;
  setCleaningFrequency: (f: CleaningFrequency) => void;
  setCleaningEstimate: (v: number | null) => void;
  setCleaningContact: (c: { name: string; email: string; phone: string }) => void;
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
    setFlooringZillowData: (totalSqFt) => persistSet(st => ({ flooring: { ...st.flooring, totalSqFt } })),
    setFlooringManualRooms: (rooms) => persistSet(st => ({ flooring: { ...st.flooring, rooms, totalSqFt: rooms.reduce((s, r) => s + r.sqFt, 0) } })),
    setFlooringSelectedRooms: (rooms) => persistSet(st => ({ flooring: { ...st.flooring, selectedRooms: rooms } })),
    setFlooringCoverageType: (c) => persistSet(st => ({ flooring: { ...st.flooring, coverageType: c } })),
    setFlooringKnowsSqFt: (v) => persistSet(st => ({ flooring: { ...st.flooring, knowsSqFt: v } })),
    setFlooringMaterial: (m) => persistSet(st => ({ flooring: { ...st.flooring, material: m } })),
    setFlooringManualMaterial: (m) => persistSet(st => ({ flooring: { ...st.flooring, manualMaterial: m } })),
    setFlooringMaterialSource: (s) => persistSet(st => ({ flooring: { ...st.flooring, materialSource: s } })),
    setFlooringEstimate: (v) => persistSet(st => ({ flooring: { ...st.flooring, estimate: v } })),
    setFlooringContact: (c) => persistSet(st => ({ flooring: { ...st.flooring, contact: c } })),

    setCleaningStep: (step) => persistSet(st => ({ cleaning: { ...st.cleaning, step } })),
    setCleaningUseZillow: (v) => persistSet(st => ({ cleaning: { ...st.cleaning, useZillow: v } })),
    setCleaningAddress: (a) => persistSet(st => ({ cleaning: { ...st.cleaning, address: a } })),
    setCleaningZillowData: (totalSqFt) => persistSet(st => ({ cleaning: { ...st.cleaning, totalSqFt } })),
    setCleaningManualRooms: (rooms) => persistSet(st => ({ cleaning: { ...st.cleaning, rooms, totalSqFt: rooms.reduce((s, r) => s + r.sqFt, 0) } })),
    setCleaningSelectedRooms: (rooms) => persistSet(st => ({ cleaning: { ...st.cleaning, selectedRooms: rooms } })),
    setCleaningCoverageType: (c) => persistSet(st => ({ cleaning: { ...st.cleaning, coverageType: c } })),
    setCleaningKnowsSqFt: (v) => persistSet(st => ({ cleaning: { ...st.cleaning, knowsSqFt: v } })),
    setCleaningType: (t) => persistSet(st => ({ cleaning: { ...st.cleaning, cleaningType: t } })),
    setCleaningFrequency: (f) => persistSet(st => ({ cleaning: { ...st.cleaning, frequency: f } })),
    setCleaningEstimate: (v) => persistSet(st => ({ cleaning: { ...st.cleaning, estimate: v } })),
    setCleaningContact: (c) => persistSet(st => ({ cleaning: { ...st.cleaning, contact: c } })),

    resetAll: () => {
      persistSet({ service: null, flooring: { ...defaultFlooring }, cleaning: { ...defaultCleaning } });
    },
  };
});

import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ZillowFetcher from '@/components/ZillowFetcher';
import ManualRoomForm from '@/components/ManualRoomForm';
import RoomSelector from '@/components/RoomSelector';
import MaterialSelector from '@/components/MaterialSelector';
import EstimateCard from '@/components/EstimateCard';
import ContactForm from '@/components/ContactForm';
import { calculateFlooringEstimate } from '@/lib/utils';
import type { Room, MaterialOption, ManualMaterial, MaterialSource } from '@/types';

const FLAT_FEE = 50;

const Flooring = () => {
  const navigate = useNavigate();
  const service = useServiceStore(s => s.service);
  const f = useServiceStore(s => s.flooring);
  const setStep = useServiceStore(s => s.setFlooringStep);
  const setUseZillow = useServiceStore(s => s.setFlooringUseZillow);
  const setZillowData = useServiceStore(s => s.setFlooringZillowData);
  const setManualRooms = useServiceStore(s => s.setFlooringManualRooms);
  const setSelectedRooms = useServiceStore(s => s.setFlooringSelectedRooms);
  const setMaterial = useServiceStore(s => s.setFlooringMaterial);
  const setManualMaterial = useServiceStore(s => s.setFlooringManualMaterial);
  const setMaterialSource = useServiceStore(s => s.setFlooringMaterialSource);
  const setEstimate = useServiceStore(s => s.setFlooringEstimate);
  const resetAll = useServiceStore(s => s.resetAll);

  useEffect(() => {
    if (service !== 'flooring') navigate('/', { replace: true });
  }, [service, navigate]);

  const goBack = useCallback(() => {
    if (f.step > 1) setStep(f.step - 1);
    else navigate('/');
  }, [f.step, setStep, navigate]);

  const handleZillowData = useCallback((totalSqFt: number, rooms: Room[], _address: string) => {
    setUseZillow(true);
    setZillowData(totalSqFt, rooms);
    setStep(3);
  }, [setUseZillow, setZillowData, setStep]);

  const handleSkipZillow = useCallback(() => {
    setUseZillow(false);
    setStep(2);
  }, [setUseZillow, setStep]);

  const handleManualRooms = useCallback((rooms: Room[]) => {
    setManualRooms(rooms);
    setStep(3);
  }, [setManualRooms, setStep]);

  const handleRoomsContinue = useCallback(() => setStep(4), [setStep]);

  const handleMaterialSelect = useCallback((material: MaterialOption | null, manual: ManualMaterial | null, source: MaterialSource) => {
    setMaterial(material);
    setManualMaterial(manual);
    setMaterialSource(source);
    const pricePerSqFt = material?.pricePerSqFt ?? manual?.pricePerSqFt ?? 0;
    const est = calculateFlooringEstimate(f.selectedRooms, f.rooms, pricePerSqFt, FLAT_FEE);
    setEstimate(est);
    setStep(5);
  }, [setMaterial, setManualMaterial, setMaterialSource, setEstimate, setStep, f.selectedRooms, f.rooms]);

  const handleSchedule = useCallback(() => setStep(6), [setStep]);

  const handleContactSuccess = useCallback(() => {
    resetAll();
    navigate('/');
  }, [resetAll, navigate]);

  const pricePerSqFt = f.material?.pricePerSqFt ?? f.manualMaterial?.pricePerSqFt ?? 0;
  const totalSelectedSqFt = useMemo(
    () => f.rooms.filter(r => f.selectedRooms.includes(r.name)).reduce((s, r) => s + r.sqFt, 0),
    [f.rooms, f.selectedRooms]
  );

  const stepTitles: Record<number, string> = {
    1: 'Property Data Source',
    2: 'Enter Room Details',
    3: 'Select Areas',
    4: 'Choose Flooring Material',
    5: 'Your Estimate',
    6: 'Contact Information',
  };

  if (service !== 'flooring') return null;

  return (
    <WizardLayout step={f.step} title={stepTitles[f.step] ?? ''} onBack={goBack}>
      {f.step === 1 && (
        <ZillowFetcher onDataFetched={handleZillowData} onSkip={handleSkipZillow} />
      )}
      {f.step === 2 && (
        <ManualRoomForm initialRooms={f.rooms.length ? f.rooms : undefined} onSubmit={handleManualRooms} />
      )}
      {f.step === 3 && (
        <RoomSelector rooms={f.rooms} selectedRooms={f.selectedRooms} onChange={setSelectedRooms} onContinue={handleRoomsContinue} />
      )}
      {f.step === 4 && (
        <MaterialSelector onSelect={handleMaterialSelect} />
      )}
      {f.step === 5 && f.estimate !== null && (
        <EstimateCard
          estimate={f.estimate}
          flatFee={FLAT_FEE}
          totalSqFt={totalSelectedSqFt}
          pricePerSqFt={pricePerSqFt}
          serviceType="flooring"
          onSchedule={handleSchedule}
        />
      )}
      {f.step === 6 && (
        <ContactForm
          payload={{
            service: 'flooring',
            rooms: f.selectedRooms,
            totalSqFt: totalSelectedSqFt,
            material: f.material ?? f.manualMaterial,
            estimate: f.estimate,
          }}
          onSuccess={handleContactSuccess}
        />
      )}
    </WizardLayout>
  );
};

export default Flooring;

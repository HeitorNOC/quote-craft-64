import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ContactInfoStep from '@/components/ContactInfoStep';
import ZillowFetcher from '@/components/ZillowFetcher';
import ManualRoomForm from '@/components/ManualRoomForm';
import RoomSelector from '@/components/RoomSelector';
import MaterialSelector from '@/components/MaterialSelector';
import EstimateCard from '@/components/EstimateCard';
import { calculateFlooringEstimate } from '@/lib/utils';
import type { Room, MaterialOption, ManualMaterial, MaterialSource } from '@/types';

const FLAT_FEE = 50;

const Flooring = () => {
  const navigate = useNavigate();
  const service = useServiceStore(s => s.service);
  const f = useServiceStore(s => s.flooring);
  const setStep = useServiceStore(s => s.setFlooringStep);
  const setContact = useServiceStore(s => s.setFlooringContact);
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

  const handleContact = useCallback((data: { name: string; email: string; phone: string }) => {
    setContact(data);
    setStep(2);
  }, [setContact, setStep]);

  const handleZillowData = useCallback((totalSqFt: number, rooms: Room[], _address: string) => {
    setUseZillow(true);
    setZillowData(totalSqFt, rooms);
    setStep(4);
  }, [setUseZillow, setZillowData, setStep]);

  const handleSkipZillow = useCallback(() => {
    setUseZillow(false);
    setStep(3);
  }, [setUseZillow, setStep]);

  const handleManualRooms = useCallback((rooms: Room[]) => {
    setManualRooms(rooms);
    setStep(4);
  }, [setManualRooms, setStep]);

  const handleRoomsContinue = useCallback(() => setStep(5), [setStep]);

  const handleMaterialSelect = useCallback((material: MaterialOption | null, manual: ManualMaterial | null, source: MaterialSource) => {
    setMaterial(material);
    setManualMaterial(manual);
    setMaterialSource(source);
    const pricePerSqFt = material?.pricePerSqFt ?? manual?.pricePerSqFt ?? 0;
    const est = calculateFlooringEstimate(f.selectedRooms, f.rooms, pricePerSqFt, FLAT_FEE);
    setEstimate(est);
    setStep(6);
  }, [setMaterial, setManualMaterial, setMaterialSource, setEstimate, setStep, f.selectedRooms, f.rooms]);

  const handleEstimateSubmit = useCallback(() => {
    resetAll();
    navigate('/');
  }, [resetAll, navigate]);

  const pricePerSqFt = f.material?.pricePerSqFt ?? f.manualMaterial?.pricePerSqFt ?? 0;
  const totalSelectedSqFt = useMemo(
    () => f.rooms.filter(r => f.selectedRooms.includes(r.name)).reduce((s, r) => s + r.sqFt, 0),
    [f.rooms, f.selectedRooms]
  );

  const stepTitles: Record<number, string> = {
    1: 'Contact Information',
    2: 'Property Data Source',
    3: 'Enter Room Details',
    4: 'Select Areas',
    5: 'Choose Flooring Material',
    6: 'Your Estimate',
  };

  if (service !== 'flooring') return null;

  return (
    <WizardLayout step={f.step} title={stepTitles[f.step] ?? ''} onBack={goBack}>
      {f.step === 1 && (
        <ContactInfoStep
          initialValues={f.contact.name ? f.contact : undefined}
          onSubmit={handleContact}
        />
      )}
      {f.step === 2 && (
        <ZillowFetcher onDataFetched={handleZillowData} onSkip={handleSkipZillow} />
      )}
      {f.step === 3 && (
        <ManualRoomForm initialRooms={f.rooms.length ? f.rooms : undefined} onSubmit={handleManualRooms} />
      )}
      {f.step === 4 && (
        <RoomSelector rooms={f.rooms} selectedRooms={f.selectedRooms} onChange={setSelectedRooms} onContinue={handleRoomsContinue} />
      )}
      {f.step === 5 && (
        <MaterialSelector onSelect={handleMaterialSelect} />
      )}
      {f.step === 6 && f.estimate !== null && (
        <EstimateCard
          estimate={f.estimate}
          flatFee={FLAT_FEE}
          totalSqFt={totalSelectedSqFt}
          pricePerSqFt={pricePerSqFt}
          serviceType="flooring"
          contact={f.contact}
          onSchedule={handleEstimateSubmit}
        />
      )}
    </WizardLayout>
  );
};

export default Flooring;

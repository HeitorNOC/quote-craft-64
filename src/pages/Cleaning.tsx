import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ZillowFetcher from '@/components/ZillowFetcher';
import ManualRoomForm from '@/components/ManualRoomForm';
import RoomSelector from '@/components/RoomSelector';
import CleaningTypeSelect from '@/components/CleaningTypeSelect';
import EstimateCard from '@/components/EstimateCard';
import ContactForm from '@/components/ContactForm';
import { calculateCleaningEstimate } from '@/lib/utils';
import type { Room, CleaningTypeOption } from '@/types';

const FLAT_FEE = 30;

const Cleaning = () => {
  const navigate = useNavigate();
  const service = useServiceStore(s => s.service);
  const c = useServiceStore(s => s.cleaning);
  const setStep = useServiceStore(s => s.setCleaningStep);
  const setUseZillow = useServiceStore(s => s.setCleaningUseZillow);
  const setZillowData = useServiceStore(s => s.setCleaningZillowData);
  const setManualRooms = useServiceStore(s => s.setCleaningManualRooms);
  const setSelectedRooms = useServiceStore(s => s.setCleaningSelectedRooms);
  const setCleaningType = useServiceStore(s => s.setCleaningType);
  const setEstimate = useServiceStore(s => s.setCleaningEstimate);
  const resetAll = useServiceStore(s => s.resetAll);

  useEffect(() => {
    if (service !== 'cleaning') navigate('/', { replace: true });
  }, [service, navigate]);

  const goBack = useCallback(() => {
    if (c.step > 1) setStep(c.step - 1);
    else navigate('/');
  }, [c.step, setStep, navigate]);

  const handleZillowData = useCallback((totalSqFt: number, rooms: Room[]) => {
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

  const handleCleaningSelect = useCallback((type: CleaningTypeOption) => {
    setCleaningType(type);
    const est = calculateCleaningEstimate(c.selectedRooms, c.rooms, type.pricePerSqFt, FLAT_FEE);
    setEstimate(est);
    setStep(5);
  }, [setCleaningType, setEstimate, setStep, c.selectedRooms, c.rooms]);

  const handleSchedule = useCallback(() => setStep(6), [setStep]);

  const handleContactSuccess = useCallback(() => {
    resetAll();
    navigate('/');
  }, [resetAll, navigate]);

  const totalSelectedSqFt = useMemo(
    () => c.rooms.filter(r => c.selectedRooms.includes(r.name)).reduce((s, r) => s + r.sqFt, 0),
    [c.rooms, c.selectedRooms]
  );

  const stepTitles: Record<number, string> = {
    1: 'Property Data Source',
    2: 'Enter Room Details',
    3: 'Select Areas',
    4: 'Choose Cleaning Type',
    5: 'Your Estimate',
    6: 'Contact Information',
  };

  if (service !== 'cleaning') return null;

  return (
    <WizardLayout step={c.step} title={stepTitles[c.step] ?? ''} onBack={goBack}>
      {c.step === 1 && (
        <ZillowFetcher onDataFetched={handleZillowData} onSkip={handleSkipZillow} />
      )}
      {c.step === 2 && (
        <ManualRoomForm initialRooms={c.rooms.length ? c.rooms : undefined} onSubmit={handleManualRooms} />
      )}
      {c.step === 3 && (
        <RoomSelector rooms={c.rooms} selectedRooms={c.selectedRooms} onChange={setSelectedRooms} onContinue={handleRoomsContinue} />
      )}
      {c.step === 4 && (
        <CleaningTypeSelect onSelect={handleCleaningSelect} />
      )}
      {c.step === 5 && c.estimate !== null && c.cleaningType && (
        <EstimateCard
          estimate={c.estimate}
          flatFee={FLAT_FEE}
          totalSqFt={totalSelectedSqFt}
          pricePerSqFt={c.cleaningType.pricePerSqFt}
          serviceType="cleaning"
          onSchedule={handleSchedule}
        />
      )}
      {c.step === 6 && (
        <ContactForm
          payload={{
            service: 'cleaning',
            rooms: c.selectedRooms,
            totalSqFt: totalSelectedSqFt,
            cleaningType: c.cleaningType,
            estimate: c.estimate,
          }}
          onSuccess={handleContactSuccess}
        />
      )}
    </WizardLayout>
  );
};

export default Cleaning;

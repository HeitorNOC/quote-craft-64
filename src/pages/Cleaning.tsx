import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ContactInfoStep from '@/components/ContactInfoStep';
import ZillowFetcher from '@/components/ZillowFetcher';
import ManualRoomForm from '@/components/ManualRoomForm';
import RoomSelector from '@/components/RoomSelector';
import CleaningTypeSelect from '@/components/CleaningTypeSelect';
import EstimateCard from '@/components/EstimateCard';
import { calculateCleaningEstimate } from '@/lib/utils';
import type { Room, CleaningTypeOption } from '@/types';

const FLAT_FEE = 30;

const Cleaning = () => {
  const navigate = useNavigate();
  const service = useServiceStore(s => s.service);
  const c = useServiceStore(s => s.cleaning);
  const setStep = useServiceStore(s => s.setCleaningStep);
  const setContact = useServiceStore(s => s.setCleaningContact);
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

  const handleContact = useCallback((data: { name: string; email: string; phone: string }) => {
    setContact(data);
    setStep(2);
  }, [setContact, setStep]);

  const handleZillowData = useCallback((totalSqFt: number, _address: string) => {
    setUseZillow(true);
    setZillowData(totalSqFt);
    setStep(3); // Go to manual room entry (Zillow only provides total sqFt)
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

  const handleCleaningSelect = useCallback((type: CleaningTypeOption) => {
    setCleaningType(type);
    const est = calculateCleaningEstimate(c.selectedRooms, c.rooms, type.pricePerSqFt, FLAT_FEE);
    setEstimate(est);
    setStep(6);
  }, [setCleaningType, setEstimate, setStep, c.selectedRooms, c.rooms]);

  const handleEstimateSubmit = useCallback(() => {
    resetAll();
    navigate('/');
  }, [resetAll, navigate]);

  const totalSelectedSqFt = useMemo(
    () => c.rooms.filter(r => c.selectedRooms.includes(r.name)).reduce((s, r) => s + r.sqFt, 0),
    [c.rooms, c.selectedRooms]
  );

  const stepTitles: Record<number, string> = {
    1: 'Contact Information',
    2: 'Property Data Source',
    3: 'Enter Room Details',
    4: 'Select Areas',
    5: 'Choose Cleaning Type',
    6: 'Your Estimate',
  };

  if (service !== 'cleaning') return null;

  return (
    <WizardLayout step={c.step} title={stepTitles[c.step] ?? ''} onBack={goBack}>
      {c.step === 1 && (
        <ContactInfoStep
          initialValues={c.contact.name ? c.contact : undefined}
          onSubmit={handleContact}
        />
      )}
      {c.step === 2 && (
        <ZillowFetcher onDataFetched={handleZillowData} onSkip={handleSkipZillow} />
      )}
      {c.step === 3 && (
        <ManualRoomForm initialRooms={c.rooms.length ? c.rooms : undefined} zillowTotalSqFt={c.useZillow ? c.totalSqFt : undefined} onSubmit={handleManualRooms} />
      )}
      {c.step === 4 && (
        <RoomSelector rooms={c.rooms} selectedRooms={c.selectedRooms} onChange={setSelectedRooms} onContinue={handleRoomsContinue} />
      )}
      {c.step === 5 && (
        <CleaningTypeSelect onSelect={handleCleaningSelect} />
      )}
      {c.step === 6 && c.estimate !== null && c.cleaningType && (
        <EstimateCard
          estimate={c.estimate}
          flatFee={FLAT_FEE}
          totalSqFt={totalSelectedSqFt}
          pricePerSqFt={c.cleaningType.pricePerSqFt}
          serviceType="cleaning"
          contact={c.contact}
          onSchedule={handleEstimateSubmit}
        />
      )}
    </WizardLayout>
  );
};

export default Cleaning;

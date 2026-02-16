import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ContactInfoStep from '@/components/ContactInfoStep';
import ZillowFetcher from '@/components/ZillowFetcher';
import ManualRoomForm from '@/components/ManualRoomForm';
import RoomSelector from '@/components/RoomSelector';
import CleaningTypeSelect from '@/components/CleaningTypeSelect';
import CleaningFrequencyStep from '@/components/CleaningFrequencyStep';
import EstimateCard from '@/components/EstimateCard';
import CoverageChoiceStep from '@/components/CoverageChoiceStep';
import SqFtKnowledgeStep from '@/components/SqFtKnowledgeStep';
import TotalSqFtStep from '@/components/TotalSqFtStep';
import ScheduleVisitStep from '@/components/ScheduleVisitStep';
import { calculateCleaningEstimate } from '@/lib/utils';
import type { Room, CleaningTypeOption, CoverageType, CleaningFrequency } from '@/types';

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
  const setCoverageType = useServiceStore(s => s.setCleaningCoverageType);
  const setKnowsSqFt = useServiceStore(s => s.setCleaningKnowsSqFt);
  const setCleaningType = useServiceStore(s => s.setCleaningType);
  const setFrequency = useServiceStore(s => s.setCleaningFrequency);
  const setEstimate = useServiceStore(s => s.setCleaningEstimate);
  const resetAll = useServiceStore(s => s.resetAll);

  useEffect(() => {
    if (service !== 'cleaning') navigate('/', { replace: true });
  }, [service, navigate]);

  // Steps: 1=Contact, 2=Zillow, 3=Frequency, 4=Coverage, then branch
  // Whole: 5=TotalSqFt, 6=Type, 7=Estimate
  // Specific+knows: 5=SqFtKnowledge, 6=ManualRooms, 7=RoomSelect, 8=Type, 9=Estimate
  // Specific+!knows: 5=SqFtKnowledge, 6=Schedule

  const totalSteps = useMemo(() => {
    if (c.coverageType === 'whole') return 7;
    if (c.coverageType === 'specific' && c.knowsSqFt === false) return 6;
    if (c.coverageType === 'specific' && c.knowsSqFt === true) return 9;
    return 7;
  }, [c.coverageType, c.knowsSqFt]);

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
    setStep(3);
  }, [setUseZillow, setZillowData, setStep]);

  const handleSkipZillow = useCallback(() => {
    setUseZillow(false);
    setStep(3);
  }, [setUseZillow, setStep]);

  const handleFrequency = useCallback((freq: CleaningFrequency) => {
    setFrequency(freq);
    setStep(4);
  }, [setFrequency, setStep]);

  const handleCoverage = useCallback((type: CoverageType) => {
    setCoverageType(type);
    setStep(5);
  }, [setCoverageType, setStep]);

  const handleTotalSqFt = useCallback((sqFt: number) => {
    setZillowData(sqFt);
    setStep(6);
  }, [setZillowData, setStep]);

  const handleKnowsSqFt = useCallback((knows: boolean) => {
    setKnowsSqFt(knows);
    setStep(6);
  }, [setKnowsSqFt, setStep]);

  const handleManualRooms = useCallback((rooms: Room[]) => {
    setManualRooms(rooms);
    setStep(7);
  }, [setManualRooms, setStep]);

  const handleRoomsContinue = useCallback(() => setStep(8), [setStep]);

  const handleCleaningSelect = useCallback((type: CleaningTypeOption) => {
    setCleaningType(type);
    if (c.coverageType === 'whole') {
      const est = c.totalSqFt * type.pricePerSqFt + FLAT_FEE;
      setEstimate(est);
      setStep(7);
    } else {
      const est = calculateCleaningEstimate(c.selectedRooms, c.rooms, type.pricePerSqFt, FLAT_FEE);
      setEstimate(est);
      setStep(9);
    }
  }, [setCleaningType, setEstimate, setStep, c.coverageType, c.totalSqFt, c.selectedRooms, c.rooms]);

  const handleEstimateSubmit = useCallback(() => {
    resetAll();
    navigate('/');
  }, [resetAll, navigate]);

  const handleScheduleDone = useCallback(() => {
    resetAll();
    navigate('/');
  }, [resetAll, navigate]);

  const totalSelectedSqFt = useMemo(
    () => c.coverageType === 'whole'
      ? c.totalSqFt
      : c.rooms.filter(r => c.selectedRooms.includes(r.name)).reduce((s, r) => s + r.sqFt, 0),
    [c.coverageType, c.totalSqFt, c.rooms, c.selectedRooms]
  );

  const getStepTitle = (): string => {
    if (c.step === 1) return 'Contact Information';
    if (c.step === 2) return 'Property Data Source';
    if (c.step === 3) return 'Cleaning Frequency';
    if (c.step === 4) return 'Coverage Area';
    if (c.coverageType === 'whole') {
      if (c.step === 5) return 'Total Square Footage';
      if (c.step === 6) return 'Choose Cleaning Type';
      if (c.step === 7) return 'Your Estimate';
    } else {
      if (c.step === 5) return 'Room Measurements';
      if (c.step === 6) return c.knowsSqFt ? 'Enter Room Details' : 'Schedule Visit';
      if (c.step === 7) return 'Select Areas';
      if (c.step === 8) return 'Choose Cleaning Type';
      if (c.step === 9) return 'Your Estimate';
    }
    return '';
  };

  const getStepLabels = (): string[] => {
    if (c.coverageType === 'whole') {
      return ['Contact', 'Data Source', 'Frequency', 'Coverage', 'Sq Ft', 'Type', 'Estimate'];
    }
    if (c.coverageType === 'specific' && c.knowsSqFt === false) {
      return ['Contact', 'Data Source', 'Frequency', 'Coverage', 'Measurements', 'Schedule'];
    }
    if (c.coverageType === 'specific' && c.knowsSqFt === true) {
      return ['Contact', 'Data Source', 'Frequency', 'Coverage', 'Measurements', 'Rooms', 'Select', 'Type', 'Estimate'];
    }
    return ['Contact', 'Data Source', 'Frequency', 'Coverage', 'Details', 'Options', 'Estimate'];
  };

  if (service !== 'cleaning') return null;

  return (
    <WizardLayout step={c.step} totalSteps={totalSteps} title={getStepTitle()} stepLabels={getStepLabels()} onBack={goBack}>
      {c.step === 1 && (
        <ContactInfoStep initialValues={c.contact.name ? c.contact : undefined} onSubmit={handleContact} />
      )}
      {c.step === 2 && (
        <ZillowFetcher onDataFetched={handleZillowData} onSkip={handleSkipZillow} />
      )}
      {c.step === 3 && (
        <CleaningFrequencyStep onSelect={handleFrequency} />
      )}
      {c.step === 4 && (
        <CoverageChoiceStep onSelect={handleCoverage} />
      )}

      {/* Whole house path */}
      {c.step === 5 && c.coverageType === 'whole' && (
        <TotalSqFtStep initialValue={c.totalSqFt || undefined} onSubmit={handleTotalSqFt} />
      )}
      {c.step === 6 && c.coverageType === 'whole' && (
        <CleaningTypeSelect onSelect={handleCleaningSelect} />
      )}
      {c.step === 7 && c.coverageType === 'whole' && c.estimate !== null && c.cleaningType && (
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

      {/* Specific rooms path */}
      {c.step === 5 && c.coverageType === 'specific' && (
        <SqFtKnowledgeStep onAnswer={handleKnowsSqFt} />
      )}
      {c.step === 6 && c.coverageType === 'specific' && c.knowsSqFt === true && (
        <ManualRoomForm
          initialRooms={c.rooms.length ? c.rooms : undefined}
          zillowTotalSqFt={c.useZillow ? c.totalSqFt : undefined}
          onSubmit={handleManualRooms}
        />
      )}
      {c.step === 6 && c.coverageType === 'specific' && c.knowsSqFt === false && (
        <ScheduleVisitStep
          serviceType="cleaning"
          contact={c.contact}
          address={c.address}
          coverageType="specific"
          onDone={handleScheduleDone}
        />
      )}
      {c.step === 7 && c.coverageType === 'specific' && (
        <RoomSelector rooms={c.rooms} selectedRooms={c.selectedRooms} onChange={setSelectedRooms} onContinue={handleRoomsContinue} />
      )}
      {c.step === 8 && c.coverageType === 'specific' && (
        <CleaningTypeSelect onSelect={handleCleaningSelect} />
      )}
      {c.step === 9 && c.coverageType === 'specific' && c.estimate !== null && c.cleaningType && (
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

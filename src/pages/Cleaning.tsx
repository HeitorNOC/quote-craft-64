import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ContactInfoStep from '@/components/ContactInfoStep';
import ZillowFetcher from '@/components/ZillowFetcher';
import PropertyDetailsStep from '@/components/PropertyDetailsStep';
import RoomManagementStep from '@/components/RoomManagementStep';
import CleaningTypeSelect from '@/components/CleaningTypeSelect';
import CleaningFrequencyStep from '@/components/CleaningFrequencyStep';
import EstimateCard from '@/components/EstimateCard';
import CoverageChoiceStep from '@/components/CoverageChoiceStep';
import SqFtKnowledgeStep from '@/components/SqFtKnowledgeStep';
import ScheduleVisitStep from '@/components/ScheduleVisitStep';
import { calculateCleaningEstimate } from '@/lib/utils';
import bgCleaning from '@/assets/bg-cleaning.jpg';
import type { Room, CleaningTypeOption, CoverageType, CleaningFrequency } from '@/types';

const FLAT_FEE = 30;

const Cleaning = () => {
  const navigate = useNavigate();
  const service = useServiceStore(s => s.service);
  const c = useServiceStore(s => s.cleaning);
  const setStep = useServiceStore(s => s.setCleaningStep);
  const setContact = useServiceStore(s => s.setCleaningContact);
  const setAddress = useServiceStore(s => s.setCleaningAddress);
  const setUseZillow = useServiceStore(s => s.setCleaningUseZillow);
  const setZillowData = useServiceStore(s => s.setCleaningZillowData);
  const setZipCode = useServiceStore(s => s.setCleaningZipCode);
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

  // Steps: 1=Contact, 2=Zillow, 3=PropertyDetails, 4=Frequency, 5=Coverage, then branch
  // Whole: 6=Type, 7=Estimate (7 steps)
  // Specific+knows: 6=SqFtKnowledge(yes), 7=RoomManagement, 8=Type, 9=Estimate (9 steps)
  // Specific+!knows: 6=SqFtKnowledge(no), 7=Schedule (7 steps)

  const totalSteps = useMemo(() => {
    if (c.coverageType === 'whole') return 7;
    if (c.coverageType === 'specific' && c.knowsSqFt === false) return 7;
    if (c.coverageType === 'specific' && c.knowsSqFt === true) return 9;
    // If specific but knowsSqFt not yet set, show step count for measuring knowledge
    if (c.coverageType === 'specific') return 7;
    return 7;
  }, [c.coverageType, c.knowsSqFt]);

  const goBack = useCallback(() => {
    if (c.step <= 1) {
      navigate('/');
      return;
    }
    setStep(c.step - 1);
  }, [c.step, setStep, navigate]);

  const handleContact = useCallback((data: { name: string; email: string; phone: string }) => {
    setContact(data);
    setStep(2);
  }, [setContact, setStep]);

  const handleZillowData = useCallback((totalSqFt: number, zipCode: string, _address: string) => {
    setUseZillow(true);
    setZillowData(totalSqFt);
    setZipCode(zipCode);
    setStep(3);
  }, [setUseZillow, setZillowData, setZipCode, setStep]);

  const handleSkipZillow = useCallback(() => {
    setUseZillow(false);
    setStep(3);
  }, [setUseZillow, setStep]);

  const handlePropertyDetails = useCallback((address: string, zipCode: string, sqFt: number) => {
    setAddress(address);
    setZillowData(sqFt);
    setZipCode(zipCode);
    setStep(4);
  }, [setAddress, setZillowData, setZipCode, setStep]);

  const handleFrequency = useCallback((freq: CleaningFrequency) => {
    setFrequency(freq);
    setStep(5);
  }, [setFrequency, setStep]);

  const handleCoverage = useCallback((type: CoverageType) => {
    setCoverageType(type);
    if (type === 'whole') {
      setStep(6); // CleaningType directly
    } else {
      // Specific: go to SqFtKnowledgeStep to ask if they know sqft
      setStep(6);
    }
  }, [setCoverageType, setStep]);

  const handleKnowsSqFt = useCallback((knows: boolean) => {
    setKnowsSqFt(knows);
    if (knows) {
      setStep(7); // RoomManagement
    } else {
      setStep(7); // Schedule
    }
  }, [setKnowsSqFt, setStep]);

  const handleRoomManagement = useCallback((rooms: Room[], selectedRooms: string[]) => {
    setManualRooms(rooms);
    setSelectedRooms(selectedRooms);
    setStep(8);
  }, [setManualRooms, setSelectedRooms, setStep]);

  const handleCleaningSelect = useCallback((type: CleaningTypeOption) => {
    // Validate zipCode
    if (!c.zipCode || c.zipCode.trim() === '') {
      return;
    }

    // Validate coverage-specific requirements
    if (c.coverageType === 'whole') {
      if (!c.totalSqFt || c.totalSqFt <= 0) {
        return;
      }
    } else {
      if (c.selectedRooms.length === 0) {
        return;
      }
    }

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
  }, [setCleaningType, setEstimate, setStep, c.coverageType, c.totalSqFt, c.selectedRooms, c.rooms, c.zipCode]);

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
    if (c.step === 2) return 'Find Your Property';
    if (c.step === 3) return 'Property Details';
    if (c.step === 4) return 'Cleaning Frequency';
    if (c.step === 5) return 'Coverage Area';
    if (c.coverageType === 'whole') {
      if (c.step === 6) return 'Choose Cleaning Type';
      if (c.step === 7) return 'Your Estimate';
    } else {
      if (c.step === 6) return 'Measurement Knowledge';
      if (c.step === 7) return c.knowsSqFt ? 'Define Areas' : 'Schedule Visit';
      if (c.step === 8) return 'Choose Cleaning Type';
      if (c.step === 9) return 'Your Estimate';
    }
    return '';
  };

  const getStepLabels = (): string[] => {
    if (c.coverageType === 'whole') {
      return ['Contact', 'Find', 'Details', 'Frequency', 'Coverage', 'Type', 'Estimate'];
    }
    if (c.coverageType === 'specific' && c.knowsSqFt === false) {
      return ['Contact', 'Find', 'Details', 'Frequency', 'Coverage', 'Measure', 'Schedule'];
    }
    if (c.coverageType === 'specific' && c.knowsSqFt === true) {
      return ['Contact', 'Find', 'Details', 'Frequency', 'Coverage', 'Measure', 'Areas', 'Type', 'Estimate'];
    }
    // While in coverage choice for specific
    return ['Contact', 'Find', 'Details', 'Frequency', 'Coverage', 'Measure'];
  };

  if (service !== 'cleaning') return null;

  return (
    <WizardLayout step={c.step} totalSteps={totalSteps} title={getStepTitle()} stepLabels={getStepLabels()} onBack={goBack} bgImage={bgCleaning}>
      {c.step === 1 && (
        <ContactInfoStep initialValues={c.contact.name ? c.contact : undefined} onSubmit={handleContact} />
      )}
      {c.step === 2 && (
        <ZillowFetcher onDataFetched={handleZillowData} onSkip={handleSkipZillow} />
      )}
      {c.step === 3 && (
        <PropertyDetailsStep
          initialAddress={c.address}
          initialZipCode={c.zipCode}
          initialSqFt={c.totalSqFt}
          onContinue={handlePropertyDetails}
        />
      )}
      {c.step === 4 && (
        <CleaningFrequencyStep onSelect={handleFrequency} />
      )}
      {c.step === 5 && (
        <CoverageChoiceStep onSelect={handleCoverage} />
      )}

      {/* Whole house path */}
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
      {c.step === 6 && c.coverageType === 'specific' && (
        <SqFtKnowledgeStep onAnswer={handleKnowsSqFt} />
      )}
      {c.step === 7 && c.coverageType === 'specific' && c.knowsSqFt === true && (
        <RoomManagementStep initialRooms={c.rooms.length ? c.rooms : undefined} initialSelectedRooms={c.selectedRooms} onSubmit={handleRoomManagement} />
      )}
      {c.step === 7 && c.coverageType === 'specific' && c.knowsSqFt === false && (
        <ScheduleVisitStep
          serviceType="cleaning"
          contact={c.contact}
          address={c.address}
          coverageType="specific"
          onDone={handleScheduleDone}
        />
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

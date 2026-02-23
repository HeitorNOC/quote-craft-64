import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ContactInfoStep from '@/components/ContactInfoStep';
// import ZillowFetcher from '@/components/ZillowFetcher'; // Commented out - using manual property details only
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
  /*
  Complete Flow with validations (Zillow removed - using manual details):
  1. Contact → 2. PropertyDetails → 3. Frequency → 4. Coverage → ...
  Path A (Whole house): 4→5.Type→6.Estimate (6 steps)
  Path B (Specific + knows sqft): 4→5.SqFtKnowledge(yes)→6.RoomManagement→7.Type→8.Estimate (8 steps)
  Path C (Specific + no sqft): 4→5.SqFtKnowledge(no)→6.Schedule (6 steps)
  
  // COMMENTED: Zillow integration removed in favor of manual property details
  // Previous flow: 1.Contact → 2.Zillow → 3.PropertyDetails → 4.Frequency → 5.Coverage → ...
  */
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

  // Steps: 1=Contact, 2=PropertyDetails (was 3), 3=Frequency (was 4), 4=Coverage (was 5), then branch
  // Whole: 5=Type, 6=Estimate (6 steps - was 7)
  // Specific+knows: 5=SqFtKnowledge(yes), 6=RoomManagement, 7=Type, 8=Estimate (8 steps - was 9)
  // Specific+!knows: 5=SqFtKnowledge(no), 6=Schedule (6 steps - was 7)

  const totalSteps = useMemo(() => {
    if (c.coverageType === 'whole') return 6; // Was 7
    if (c.coverageType === 'specific' && c.knowsSqFt === false) return 6; // Was 7
    if (c.coverageType === 'specific' && c.knowsSqFt === true) return 8; // Was 9
    // If specific but knowsSqFt not yet set, show step count for measuring knowledge
    if (c.coverageType === 'specific') return 6; // Was 7
    return 6; // Was 7
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
    setStep(2); // Now goes directly to PropertyDetailsStep (was step 2 with Zillow, now 2 is PropertyDetails)
  }, [setContact, setStep]);

  // COMMENTED: Zillow integration removed
  // const handleZillowData = useCallback((totalSqFt: number, zipCode: string, _address: string) => {
  //   setUseZillow(true);
  //   setZillowData(totalSqFt);
  //   setZipCode(zipCode);
  //   setStep(3);
  // }, [setUseZillow, setZillowData, setZipCode, setStep]);

  // const handleSkipZillow = useCallback(() => {
  //   setUseZillow(false);
  //   setStep(3);
  // }, [setUseZillow, setStep]);

  const handlePropertyDetails = useCallback((address: string, zipCode: string, sqFt: number) => {
    setAddress(address);
    setZillowData(sqFt);
    setZipCode(zipCode);
    setStep(3); // Now goes to Frequency (was step 4)
  }, [setAddress, setZillowData, setZipCode, setStep]);

  const handleFrequency = useCallback((freq: CleaningFrequency) => {
    setFrequency(freq);
    setStep(4); // Was step 5
  }, [setFrequency, setStep]);

  const handleCoverage = useCallback((type: CoverageType) => {
    setCoverageType(type);
    if (type === 'whole') {
      setStep(5); // CleaningType directly (was step 6)
    } else {
      // Specific: go to SqFtKnowledgeStep to ask if they know sqft
      setStep(5); // (was step 6)
    }
  }, [setCoverageType, setStep]);

  const handleKnowsSqFt = useCallback((knows: boolean) => {
    setKnowsSqFt(knows);
    if (knows) {
      setStep(6); // RoomManagement (was step 7)
    } else {
      setStep(6); // Schedule (was step 7)
    }
  }, [setKnowsSqFt, setStep]);

  const handleRoomManagement = useCallback((rooms: Room[], selectedRooms: string[]) => {
    setManualRooms(rooms);
    setSelectedRooms(selectedRooms);
    setStep(7); // Was step 8
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
      setStep(6); // Estimate (was step 7)
    } else {
      const est = calculateCleaningEstimate(c.selectedRooms, c.rooms, type.pricePerSqFt, FLAT_FEE);
      setEstimate(est);
      setStep(8); // Estimate (was step 9)
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
    if (c.step === 2) return 'Property Details'; // Was step 3
    if (c.step === 3) return 'Cleaning Frequency'; // Was step 4
    if (c.step === 4) return 'Coverage Area'; // Was step 5
    if (c.coverageType === 'whole') {
      if (c.step === 5) return 'Choose Cleaning Type'; // Was step 6
      if (c.step === 6) return 'Your Estimate'; // Was step 7
    } else {
      if (c.step === 5) return 'Measurement Knowledge'; // Was step 6
      if (c.step === 6) return c.knowsSqFt ? 'Define Areas' : 'Schedule Visit'; // Was step 7
      if (c.step === 7) return 'Choose Cleaning Type'; // Was step 8
      if (c.step === 8) return 'Your Estimate'; // Was step 9
    }
    return '';
  };

  const getStepLabels = (): string[] => {
    if (c.coverageType === 'whole') {
      return ['Contact', 'Details', 'Frequency', 'Coverage', 'Type', 'Estimate']; // Removed 'Find'
    }
    if (c.coverageType === 'specific' && c.knowsSqFt === false) {
      return ['Contact', 'Details', 'Frequency', 'Coverage', 'Measure', 'Schedule']; // Removed 'Find'
    }
    if (c.coverageType === 'specific' && c.knowsSqFt === true) {
      return ['Contact', 'Details', 'Frequency', 'Coverage', 'Measure', 'Areas', 'Type', 'Estimate']; // Removed 'Find'
    }
    // While in coverage choice for specific
    return ['Contact', 'Details', 'Frequency', 'Coverage', 'Measure']; // Removed 'Find'
  };

  if (service !== 'cleaning') return null;

  return (
    <WizardLayout step={c.step} totalSteps={totalSteps} title={getStepTitle()} stepLabels={getStepLabels()} onBack={goBack} bgImage={bgCleaning}>
      {c.step === 1 && (
        <ContactInfoStep initialValues={c.contact.name ? c.contact : undefined} onSubmit={handleContact} />
      )}
      {/* COMMENTED: Zillow integration removed - using manual property details only
      {c.step === 2 && (
        <ZillowFetcher onDataFetched={handleZillowData} onSkip={handleSkipZillow} />
      )}
      */}
      {c.step === 2 && (
        <PropertyDetailsStep
          initialAddress={c.address}
          initialZipCode={c.zipCode}
          initialSqFt={c.totalSqFt}
          onContinue={handlePropertyDetails}
        />
      )}
      {c.step === 3 && (
        <CleaningFrequencyStep onSelect={handleFrequency} />
      )}
      {c.step === 4 && (
        <CoverageChoiceStep onSelect={handleCoverage} />
      )}

      {/* Whole house path */}
      {c.step === 5 && c.coverageType === 'whole' && (
        <CleaningTypeSelect onSelect={handleCleaningSelect} />
      )}
      {c.step === 6 && c.coverageType === 'whole' && c.estimate !== null && c.cleaningType && (
        <EstimateCard
          estimate={c.estimate}
          flatFee={FLAT_FEE}
          totalSqFt={totalSelectedSqFt}
          pricePerSqFt={c.cleaningType.pricePerSqFt}
          serviceType="cleaning"
          contact={c.contact}
          address={c.address}
          zipCode={c.zipCode}
          coverage="whole"
          cleaningType={c.cleaningType.name}
          frequency={c.frequency || undefined}
          onSchedule={handleEstimateSubmit}
        />
      )}

      {/* Specific rooms path */}
      {c.step === 5 && c.coverageType === 'specific' && (
        <SqFtKnowledgeStep onAnswer={handleKnowsSqFt} />
      )}
      {c.step === 6 && c.coverageType === 'specific' && c.knowsSqFt === true && (
        <RoomManagementStep initialRooms={c.rooms.length ? c.rooms : undefined} initialSelectedRooms={c.selectedRooms} onSubmit={handleRoomManagement} />
      )}
      {c.step === 6 && c.coverageType === 'specific' && c.knowsSqFt === false && (
        <ScheduleVisitStep
          serviceType="cleaning"
          contact={c.contact}
          address={c.address}
          zipCode={c.zipCode}
          coverageType="specific"
          onDone={handleScheduleDone}
        />
      )}
      {c.step === 7 && c.coverageType === 'specific' && (
        <CleaningTypeSelect onSelect={handleCleaningSelect} />
      )}
      {c.step === 8 && c.coverageType === 'specific' && c.estimate !== null && c.cleaningType && (
        <EstimateCard
          estimate={c.estimate}
          flatFee={FLAT_FEE}
          totalSqFt={totalSelectedSqFt}
          pricePerSqFt={c.cleaningType.pricePerSqFt}
          serviceType="cleaning"
          contact={c.contact}
          address={c.address}
          zipCode={c.zipCode}
          coverage="specific"
          cleaningType={c.cleaningType.name}
          frequency={c.frequency || undefined}
          onSchedule={handleEstimateSubmit}
        />
      )}
    </WizardLayout>
  );
};

export default Cleaning;

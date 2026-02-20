import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ContactInfoStep from '@/components/ContactInfoStep';
import ZillowFetcher from '@/components/ZillowFetcher';
import PropertyDetailsStep from '@/components/PropertyDetailsStep';
import RoomManagementStep from '@/components/RoomManagementStep';
import FlooringMaterialSelector from '@/components/FlooringMaterialSelector';
import EstimateCard from '@/components/EstimateCard';
import CoverageChoiceStep from '@/components/CoverageChoiceStep';
import SqFtKnowledgeStep from '@/components/SqFtKnowledgeStep';
import ScheduleVisitStep from '@/components/ScheduleVisitStep';
import { calculateFlooringEstimate } from '@/lib/utils';
import bgFlooring from '@/assets/bg-flooring.jpg';
import type { Room, MaterialOption, ManualMaterial, MaterialSource, CoverageType } from '@/types';

const FLAT_FEE = 50;

/*
  Complete Flow with validations:
  1. Contact → 2. Zillow → 3. PropertyDetails → 4. Coverage → ...
  Path A (Whole house): 4→5.Material→6.Estimate (6 steps)
  Path B (Specific + knows sqft): 4→5.SqFtKnowledge(yes)→6.RoomManagement→7.Material→8.Estimate (8 steps)
  Path C (Specific + no sqft): 4→5.SqFtKnowledge(no)→6.Schedule (6 steps)
*/

const Flooring = () => {
  const navigate = useNavigate();
  const service = useServiceStore(s => s.service);
  const f = useServiceStore(s => s.flooring);
  const setStep = useServiceStore(s => s.setFlooringStep);
  const setContact = useServiceStore(s => s.setFlooringContact);
  const setAddress = useServiceStore(s => s.setFlooringAddress);
  const setUseZillow = useServiceStore(s => s.setFlooringUseZillow);
  const setZillowData = useServiceStore(s => s.setFlooringZillowData);
  const setZipCode = useServiceStore(s => s.setFlooringZipCode);
  const setManualRooms = useServiceStore(s => s.setFlooringManualRooms);
  const setSelectedRooms = useServiceStore(s => s.setFlooringSelectedRooms);
  const setCoverageType = useServiceStore(s => s.setFlooringCoverageType);
  const setKnowsSqFt = useServiceStore(s => s.setFlooringKnowsSqFt);
  const setMaterial = useServiceStore(s => s.setFlooringMaterial);
  const setManualMaterial = useServiceStore(s => s.setFlooringManualMaterial);
  const setMaterialSource = useServiceStore(s => s.setFlooringMaterialSource);
  const setEstimate = useServiceStore(s => s.setFlooringEstimate);
  const resetAll = useServiceStore(s => s.resetAll);

  useEffect(() => {
    if (service !== 'flooring') navigate('/', { replace: true });
  }, [service, navigate]);

  const totalSteps = useMemo(() => {
    if (f.coverageType === 'whole') return 6;
    if (f.coverageType === 'specific' && f.knowsSqFt === false) return 6;
    if (f.coverageType === 'specific' && f.knowsSqFt === true) return 8;
    // If specific but knowsSqFt not yet set, we're in step 5 (SqFtKnowledgeStep)
    if (f.coverageType === 'specific') return 6;
    return 6;
  }, [f.coverageType, f.knowsSqFt]);

  const goBack = useCallback(() => {
    if (f.step > 1) setStep(f.step - 1);
    else navigate('/');
  }, [f.step, setStep, navigate]);

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

  const handleCoverage = useCallback((type: CoverageType) => {
    setCoverageType(type);
    if (type === 'whole') {
      setStep(5); // Material directly
    } else {
      // Specific: go to SqFtKnowledgeStep to ask if they know sqft
      setStep(5);
    }
  }, [setCoverageType, setStep]);

  const handleKnowsSqFt = useCallback((knows: boolean) => {
    setKnowsSqFt(knows);
    if (knows) {
      setStep(6); // RoomManagement
    } else {
      setStep(6); // Schedule
    }
  }, [setKnowsSqFt, setStep]);

  const handleRoomManagement = useCallback((rooms: Room[], selectedRooms: string[]) => {
    setManualRooms(rooms);
    setSelectedRooms(selectedRooms);
    setStep(7);
  }, [setManualRooms, setSelectedRooms, setStep]);

  // MaterialSelector uses (material, manualMaterial, source) signature
  const handleMaterialSelect = useCallback((material: MaterialOption | null, manual: ManualMaterial | null, source: MaterialSource) => {
    // Validate zipCode
    if (!f.zipCode || f.zipCode.trim() === '') {
      console.error('Zip code is required for estimate');
      return;
    }

    // Validate coverage-specific requirements
    if (f.coverageType === 'whole') {
      if (!f.totalSqFt || f.totalSqFt <= 0) {
        console.error('Valid property square footage is required for estimate');
        return;
      }
    } else {
      if (f.selectedRooms.length === 0) {
        console.error('At least one area must be selected');
        return;
      }
    }

    setMaterial(material);
    setManualMaterial(manual);
    setMaterialSource(source);
    const price = material?.pricePerSqFt ?? manual?.pricePerSqFt ?? 0;

    if (f.coverageType === 'whole') {
      const est = f.totalSqFt * price + FLAT_FEE;
      setEstimate(est);
      setStep(6);
    } else {
      const est = calculateFlooringEstimate(f.selectedRooms, f.rooms, price, FLAT_FEE);
      setEstimate(est);
      setStep(8);
    }
  }, [setMaterial, setManualMaterial, setMaterialSource, setEstimate, setStep, f.coverageType, f.totalSqFt, f.selectedRooms, f.rooms, f.zipCode]);

  const handleEstimateSubmit = useCallback(() => {
    resetAll();
    navigate('/');
  }, [resetAll, navigate]);

  const handleScheduleDone = useCallback(() => {
    resetAll();
    navigate('/');
  }, [resetAll, navigate]);

  const totalSelectedSqFt = useMemo(
    () => f.coverageType === 'whole'
      ? f.totalSqFt
      : f.rooms.filter(r => f.selectedRooms.includes(r.name)).reduce((s, r) => s + r.sqFt, 0),
    [f.coverageType, f.totalSqFt, f.rooms, f.selectedRooms]
  );

  const pricePerSqFt = f.material?.pricePerSqFt ?? f.manualMaterial?.pricePerSqFt ?? 0;

  const getStepTitle = (): string => {
    if (f.step === 1) return 'Contact Information';
    if (f.step === 2) return 'Find Your Property';
    if (f.step === 3) return 'Property Details';
    if (f.step === 4) return 'Coverage Area';
    if (f.coverageType === 'whole') {
      if (f.step === 5) return 'Choose Flooring Material';
      if (f.step === 6) return 'Your Estimate';
    } else {
      if (f.step === 5) return 'Measurement Knowledge';
      if (f.step === 6) return f.knowsSqFt ? 'Define Areas' : 'Schedule Visit';
      if (f.step === 7) return 'Choose Flooring Material';
      if (f.step === 8) return 'Your Estimate';
    }
    return '';
  };

  const getStepLabels = (): string[] => {
    if (f.coverageType === 'whole') {
      return ['Contact', 'Find', 'Details', 'Coverage', 'Material', 'Estimate'];
    }
    if (f.coverageType === 'specific' && f.knowsSqFt === false) {
      return ['Contact', 'Find', 'Details', 'Coverage', 'Measure', 'Schedule'];
    }
    if (f.coverageType === 'specific' && f.knowsSqFt === true) {
      return ['Contact', 'Find', 'Details', 'Coverage', 'Measure', 'Areas', 'Material', 'Estimate'];
    }
    // While in coverage choice for specific
    return ['Contact', 'Find', 'Details', 'Coverage', 'Measure'];
  };

  if (service !== 'flooring') return null;

  return (
    <WizardLayout step={f.step} totalSteps={totalSteps} title={getStepTitle()} stepLabels={getStepLabels()} onBack={goBack} bgImage={bgFlooring}>
      {f.step === 1 && (
        <ContactInfoStep initialValues={f.contact.name ? f.contact : undefined} onSubmit={handleContact} />
      )}
      {f.step === 2 && (
        <ZillowFetcher onDataFetched={handleZillowData} onSkip={handleSkipZillow} />
      )}
      {f.step === 3 && (
        <PropertyDetailsStep 
          initialAddress={f.address}
          initialZipCode={f.zipCode}
          initialSqFt={f.totalSqFt} 
          onContinue={handlePropertyDetails} 
        />
      )}
      {f.step === 4 && (
        <CoverageChoiceStep onSelect={handleCoverage} />
      )}

      {/* Whole house path */}
      {f.step === 5 && f.coverageType === 'whole' && (
        <FlooringMaterialSelector onSelect={handleMaterialSelect} zipCode={f.zipCode} />
      )}
      {f.step === 6 && f.coverageType === 'whole' && f.estimate !== null && (
        <EstimateCard estimate={f.estimate} flatFee={FLAT_FEE} totalSqFt={totalSelectedSqFt} pricePerSqFt={pricePerSqFt} serviceType="flooring" contact={f.contact} onSchedule={handleEstimateSubmit} />
      )}

      {/* Specific rooms path */}
      {f.step === 5 && f.coverageType === 'specific' && (
        <SqFtKnowledgeStep onAnswer={handleKnowsSqFt} />
      )}
      {f.step === 6 && f.coverageType === 'specific' && f.knowsSqFt === true && (
        <RoomManagementStep initialRooms={f.rooms.length ? f.rooms : undefined} initialSelectedRooms={f.selectedRooms} onSubmit={handleRoomManagement} />
      )}
      {f.step === 6 && f.coverageType === 'specific' && f.knowsSqFt === false && (
        <ScheduleVisitStep serviceType="flooring" contact={f.contact} address={f.address} coverageType="specific" onDone={handleScheduleDone} />
      )}
      {f.step === 7 && f.coverageType === 'specific' && (
        <FlooringMaterialSelector onSelect={handleMaterialSelect} zipCode={f.zipCode} />
      )}
      {f.step === 8 && f.coverageType === 'specific' && f.estimate !== null && (
        <EstimateCard estimate={f.estimate} flatFee={FLAT_FEE} totalSqFt={totalSelectedSqFt} pricePerSqFt={pricePerSqFt} serviceType="flooring" contact={f.contact} onSchedule={handleEstimateSubmit} />
      )}
    </WizardLayout>
  );
};

export default Flooring;

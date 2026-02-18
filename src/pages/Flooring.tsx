import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/store/useServiceStore';
import WizardLayout from '@/components/WizardLayout';
import ContactInfoStep from '@/components/ContactInfoStep';
import ZillowFetcher from '@/components/ZillowFetcher';
import ManualRoomForm from '@/components/ManualRoomForm';
import RoomSelector from '@/components/RoomSelector';
import FlooringMaterialSelector from '@/components/FlooringMaterialSelector';
import EstimateCard from '@/components/EstimateCard';
import CoverageChoiceStep from '@/components/CoverageChoiceStep';
import SqFtKnowledgeStep from '@/components/SqFtKnowledgeStep';
import TotalSqFtStep from '@/components/TotalSqFtStep';
import ScheduleVisitStep from '@/components/ScheduleVisitStep';
import { calculateFlooringEstimate } from '@/lib/utils';
import bgFlooring from '@/assets/bg-flooring.jpg';
import type { Room, MaterialOption, ManualMaterial, MaterialSource, CoverageType } from '@/types';

const FLAT_FEE = 50;

/*
  Flow paths:
  Path A (Whole house): 1.Contact → 2.Zillow → 3.Coverage → 4.SqFt → 5.Material → 6.Estimate
  Path B (Specific + knows sqft): 1→2→3→4.KnowsSqFt(yes)→5.RoomForm→6.RoomSelector→7.Material→8.Estimate
  Path C (Specific + no sqft): 1→2→3→4.KnowsSqFt(no)→5.ScheduleVisit
*/

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
    if (f.coverageType === 'specific' && f.knowsSqFt === false) return 5;
    if (f.coverageType === 'specific' && f.knowsSqFt === true) return 8;
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

  const handleZillowData = useCallback((totalSqFt: number, _address: string) => {
    setUseZillow(true);
    setZillowData(totalSqFt);
    setStep(3);
  }, [setUseZillow, setZillowData, setStep]);

  const handleSkipZillow = useCallback(() => {
    setUseZillow(false);
    setStep(3);
  }, [setUseZillow, setStep]);

  const handleCoverage = useCallback((type: CoverageType) => {
    setCoverageType(type);
    setStep(4);
  }, [setCoverageType, setStep]);

  const handleTotalSqFt = useCallback((sqFt: number) => {
    setZillowData(sqFt);
    setStep(5);
  }, [setZillowData, setStep]);

  const handleKnowsSqFt = useCallback((knows: boolean) => {
    setKnowsSqFt(knows);
    setStep(5);
  }, [setKnowsSqFt, setStep]);

  const handleManualRooms = useCallback((rooms: Room[]) => {
    setManualRooms(rooms);
    setStep(6);
  }, [setManualRooms, setStep]);

  const handleRoomsContinue = useCallback(() => setStep(7), [setStep]);

  // MaterialSelector uses (material, manualMaterial, source) signature
  const handleMaterialSelect = useCallback((material: MaterialOption | null, manual: ManualMaterial | null, source: MaterialSource) => {
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
  }, [setMaterial, setManualMaterial, setMaterialSource, setEstimate, setStep, f.coverageType, f.totalSqFt, f.selectedRooms, f.rooms]);

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
    if (f.step === 2) return 'Property Data Source';
    if (f.step === 3) return 'Coverage Area';
    if (f.coverageType === 'whole') {
      if (f.step === 4) return 'Total Square Footage';
      if (f.step === 5) return 'Choose Flooring Material';
      if (f.step === 6) return 'Your Estimate';
    } else {
      if (f.step === 4) return 'Room Measurements';
      if (f.step === 5) return f.knowsSqFt ? 'Enter Room Details' : 'Schedule Visit';
      if (f.step === 6) return 'Select Areas';
      if (f.step === 7) return 'Choose Flooring Material';
      if (f.step === 8) return 'Your Estimate';
    }
    return '';
  };

  const getStepLabels = (): string[] => {
    if (f.coverageType === 'whole') {
      return ['Contact', 'Data Source', 'Coverage', 'Sq Ft', 'Material', 'Estimate'];
    }
    if (f.coverageType === 'specific' && f.knowsSqFt === false) {
      return ['Contact', 'Data Source', 'Coverage', 'Measurements', 'Schedule'];
    }
    if (f.coverageType === 'specific' && f.knowsSqFt === true) {
      return ['Contact', 'Data Source', 'Coverage', 'Measurements', 'Rooms', 'Select', 'Material', 'Estimate'];
    }
    return ['Contact', 'Data Source', 'Coverage', 'Details', 'Options', 'Estimate'];
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
        <CoverageChoiceStep onSelect={handleCoverage} />
      )}

      {/* Whole house path */}
      {f.step === 4 && f.coverageType === 'whole' && (
        <TotalSqFtStep initialValue={f.totalSqFt || undefined} onSubmit={handleTotalSqFt} />
      )}
      {f.step === 5 && f.coverageType === 'whole' && (
        <FlooringMaterialSelector onSelect={handleMaterialSelect} />
      )}
      {f.step === 6 && f.coverageType === 'whole' && f.estimate !== null && (
        <EstimateCard estimate={f.estimate} flatFee={FLAT_FEE} totalSqFt={totalSelectedSqFt} pricePerSqFt={pricePerSqFt} serviceType="flooring" contact={f.contact} onSchedule={handleEstimateSubmit} />
      )}

      {/* Specific rooms path */}
      {f.step === 4 && f.coverageType === 'specific' && (
        <SqFtKnowledgeStep onAnswer={handleKnowsSqFt} />
      )}
      {f.step === 5 && f.coverageType === 'specific' && f.knowsSqFt === true && (
        <ManualRoomForm initialRooms={f.rooms.length ? f.rooms : undefined} zillowTotalSqFt={f.useZillow ? f.totalSqFt : undefined} onSubmit={handleManualRooms} />
      )}
      {f.step === 5 && f.coverageType === 'specific' && f.knowsSqFt === false && (
        <ScheduleVisitStep serviceType="flooring" contact={f.contact} address={f.address} coverageType="specific" onDone={handleScheduleDone} />
      )}
      {f.step === 6 && f.coverageType === 'specific' && (
        <RoomSelector rooms={f.rooms} selectedRooms={f.selectedRooms} onChange={setSelectedRooms} onContinue={handleRoomsContinue} />
      )}
      {f.step === 7 && f.coverageType === 'specific' && (
        <FlooringMaterialSelector onSelect={handleMaterialSelect} />
      )}
      {f.step === 8 && f.coverageType === 'specific' && f.estimate !== null && (
        <EstimateCard estimate={f.estimate} flatFee={FLAT_FEE} totalSqFt={totalSelectedSqFt} pricePerSqFt={pricePerSqFt} serviceType="flooring" contact={f.contact} onSchedule={handleEstimateSubmit} />
      )}
    </WizardLayout>
  );
};

export default Flooring;

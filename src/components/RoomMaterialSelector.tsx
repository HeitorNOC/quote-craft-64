import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlexibleMaterialSelector from '@/components/FlexibleMaterialSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Room, MaterialOption, RoomMaterial } from '@/types';

interface RoomMaterialMapping {
  [roomName: string]: {
    material: MaterialOption | null;
    manualPrice?: number;
    manualName?: string;
    sqFt: number;
    url?: string;
  };
}

interface RoomMaterialSelectorProps {
  rooms: Room[];
  selectedRooms: string[];
  zipCode: string;
  onComplete: (mapping: RoomMaterial[], totalCost: number) => void;
  singleMaterialMode?: boolean; // If true, only one material selector shown
}

export const RoomMaterialSelector = ({
  rooms,
  selectedRooms,
  zipCode,
  onComplete,
  singleMaterialMode = false,
}: RoomMaterialSelectorProps) => {
  const [materials, setMaterials] = useState<RoomMaterialMapping>({});
  const [currentStep, setCurrentStep] = useState(0); // 0 = choose mode, 1+ = select per room
  const [mode, setMode] = useState<'same' | 'different' | null>(null); // same = all rooms same material, different = per room
  const [loadingRooms, setLoadingRooms] = useState(false);

  const selectedRoomObjects = useMemo(
    () => rooms.filter((r) => selectedRooms.includes(r.name)),
    [rooms, selectedRooms]
  );

  const currentRoom = useMemo(
    () => selectedRoomObjects[currentStep],
    [selectedRoomObjects, currentStep]
  );

  const allMaterialsAssigned = useMemo(
    () =>
      selectedRoomObjects.every(
        (r) => materials[r.name]?.material || materials[r.name]?.manualPrice
      ),
    [materials, selectedRoomObjects]
  );

  const totalCost = useMemo(() => {
    let cost = 0;
    selectedRoomObjects.forEach((room) => {
      const roomMat = materials[room.name];
      if (roomMat) {
        const price = roomMat.material?.pricePerSqFt || roomMat.manualPrice || 0;
        cost += price * room.sqFt;
      }
    });
    return cost;
  }, [materials, selectedRoomObjects]);

  const handleModeSelect = (selectedMode: 'same' | 'different') => {
    setMode(selectedMode);
    setCurrentStep(0);
  };

  const convertToArrayFn = (mapping: RoomMaterialMapping): RoomMaterial[] => {
    return Object.entries(mapping).map(([roomName, mat]) => ({
      room: roomName,
      sqFt: mat.sqFt,
      material: mat.material,
      manualPrice: mat.manualPrice,
      manualName: mat.manualName,
      url: mat.url,
    }));
  };

  const handleMaterialSelect = (
    material: MaterialOption | null,
    manualData: { name: string; pricePerSqFt: number } | null,
    _source: string
  ) => {
    if (!currentRoom) return;

    const roomMat = {
      material,
      manualPrice: manualData?.pricePerSqFt,
      manualName: manualData?.name,
      sqFt: currentRoom.sqFt,
      url: material?.url,
    };

    if (mode === 'same') {
      // Apply to all rooms
      const allMaterials: RoomMaterialMapping = {};
      selectedRoomObjects.forEach((r) => {
        allMaterials[r.name] = roomMat;
      });
      setMaterials(allMaterials);
      onComplete(convertToArrayFn(allMaterials), totalCost);
    } else {
      // Move to next room
      const updated = {
        ...materials,
        [currentRoom.name]: roomMat,
      };

      if (currentStep < selectedRoomObjects.length - 1) {
        setMaterials(updated);
        setCurrentStep(currentStep + 1);
      } else {
        // All rooms done
        updated[currentRoom.name] = roomMat;
        setMaterials(updated);
        onComplete(convertToArrayFn(updated), totalCost);
      }
    }
  };

  // Show mode selection first
  if (mode === null && !singleMaterialMode) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Material Selection for {selectedRoomObjects.length} Room(s)</CardTitle>
          <CardDescription>
            How would you like to select materials?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleModeSelect('same')}
            className="w-full h-24 text-lg font-semibold"
            variant="outline"
          >
            <div className="flex flex-col gap-2">
              <span>Same Material for All Rooms</span>
              <span className="text-xs font-normal text-gray-600">
                Apply one material to all {selectedRoomObjects.length} rooms
              </span>
            </div>
          </Button>

          <Button
            onClick={() => handleModeSelect('different')}
            className="w-full h-24 text-lg font-semibold"
            variant="outline"
          >
            <div className="flex flex-col gap-2">
              <span>Different Material per Room</span>
              <span className="text-xs font-normal text-gray-600">
                Choose a unique material for each room
              </span>
            </div>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show material selector for current room
  if (currentRoom) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Progress indicator */}
        {mode === 'different' && selectedRoomObjects.length > 1 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">
                Room {currentStep + 1} of {selectedRoomObjects.length}
              </span>
              <span className="text-xs text-gray-500">
                {allMaterialsAssigned ? '✓ All complete' : `${currentStep + 1} selected`}
              </span>
            </div>
            <div className="flex gap-1">
              {selectedRoomObjects.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1 rounded-full ${
                    idx < currentStep + 1 ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Current room card */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">{currentRoom.name}</CardTitle>
            <CardDescription className="text-base">
              {currentRoom.sqFt} sq.ft
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Material selector */}
        <div className="pb-4">
          <FlexibleMaterialSelector
            onSelect={handleMaterialSelect}
            zipCode={zipCode}
            flooringType="flooring"
          />
        </div>

        {/* Room summary */}
        {Object.keys(materials).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Selected Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedRoomObjects.map((room) => (
                <div key={room.name} className="flex items-center justify-between">
                  <span className="text-sm">{room.name}</span>
                  {materials[room.name] ? (
                    <Badge variant="secondary">
                      {materials[room.name].material?.name || materials[room.name].manualName}
                    </Badge>
                  ) : (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              className="flex-1"
            >
              Previous
            </Button>
          )}

          {allMaterialsAssigned && currentStep === selectedRoomObjects.length - 1 && (
            <Button
              onClick={() => onComplete(convertToArrayFn(materials), totalCost)}
              className="flex-1"
            >
              Complete & Continue
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <LoadingSpinner text="Loading rooms..." />;
};

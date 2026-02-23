import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import type { Room } from '@/types';

interface RoomManagementStepProps {
  initialRooms?: Room[];
  initialSelectedRooms?: string[];
  onSubmit: (rooms: Room[], selectedRooms: string[]) => void;
}

interface FormValues {
  rooms: Room[];
}

const RoomManagementStep = ({ 
  initialRooms, 
  initialSelectedRooms = [],
  onSubmit 
}: RoomManagementStepProps) => {
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    defaultValues: {
      rooms: initialRooms?.length ? initialRooms : [{ name: '', sqFt: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'rooms' });
  const [selectedRooms, setSelectedRooms] = useState<string[]>(initialSelectedRooms);
  const rooms = watch('rooms');

  const toggleRoom = (name: string) => {
    setSelectedRooms(
      selectedRooms.includes(name)
        ? selectedRooms.filter(r => r !== name)
        : [...selectedRooms, name]
    );
  };

  const toggleAll = () => {
    const validRoomNames = rooms
      .filter(r => r.name.trim() && r.sqFt > 0)
      .map(r => r.name.trim());
    setSelectedRooms(
      selectedRooms.length === validRoomNames.length ? [] : validRoomNames
    );
  };

  const onValid = (data: FormValues) => {
    const validRooms = data.rooms.filter(r => r.name.trim() && r.sqFt > 0);
    if (validRooms.length === 0) return;

    const cleanedRooms = validRooms.map(r => ({ name: r.name.trim(), sqFt: Number(r.sqFt) }));
    onSubmit(cleanedRooms, selectedRooms.filter(s => cleanedRooms.some(r => r.name === s)));
  };

  const validRooms = rooms.filter(r => r.name.trim() && r.sqFt > 0);
  const allSelected = validRooms.length > 0 && selectedRooms.length === validRooms.length;
  const totalSelectedSqFt = validRooms
    .filter(r => selectedRooms.includes(r.name.trim()))
    .reduce((sum, r) => sum + r.sqFt, 0);

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold">Define Areas</h2>
        <p className="text-xs sm:text-sm text-muted-foreground px-2">
          Add the areas you want to service and select which ones to include.
        </p>
      </div>

      {/* Add Rooms Section */}
      <Card className="p-4 sm:p-5 md:p-6 space-y-4 bg-card/50">
        <div>
          <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4">Add Areas</h3>
          <div className="space-y-2 sm:space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-1.5 sm:gap-2">
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Area name"
                    className="text-xs sm:text-sm"
                    {...register(`rooms.${index}.name`, { required: true })}
                  />
                  {errors.rooms?.[index]?.name && (
                    <p className="text-xs text-destructive mt-1">Required</p>
                  )}
                </div>
                <div className="w-20 sm:w-24 md:w-28">
                  <Input
                    type="number"
                    placeholder="Sq ft"
                    min={1}
                    className="text-xs sm:text-sm"
                    {...register(`rooms.${index}.sqFt`, { required: true, min: 1, valueAsNumber: true })}
                  />
                  {errors.rooms?.[index]?.sqFt && (
                    <p className="text-xs text-destructive mt-1">Min 1</p>
                  )}
                </div>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 flex-shrink-0">
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', sqFt: 0 })}
            className="w-full mt-2 sm:mt-3 text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Add Area
          </Button>
        </div>
      </Card>

      {/* Select Rooms Section */}
      {validRooms.length > 0 && (
        <Card className="p-4 sm:p-5 md:p-6 space-y-4 bg-card/50">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-xs sm:text-sm">Select Areas to Service</h3>
            <Button variant="outline" size="sm" onClick={toggleAll} className="text-xs">
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {validRooms.map((room) => (
              <label
                key={room.name}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedRooms.includes(room.name)}
                  onCheckedChange={() => toggleRoom(room.name)}
                />
                <span className="flex-1 text-xs sm:text-sm font-medium truncate">{room.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">{room.sqFt} sq ft</span>
              </label>
            ))}
          </div>

          {selectedRooms.length > 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              Selected: <strong>{totalSelectedSqFt.toLocaleString()} sq ft</strong> across {selectedRooms.length} area(s)
            </p>
          )}
        </Card>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={validRooms.length === 0 || selectedRooms.length === 0}
      >
        Continue
      </Button>
    </form>
  );
};

export default RoomManagementStep;

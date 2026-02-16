import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Room } from '@/types';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRooms: string[];
  onChange: (selected: string[]) => void;
  onContinue: () => void;
}

const RoomSelector = ({ rooms, selectedRooms, onChange, onContinue }: RoomSelectorProps) => {
  const allSelected = rooms.length > 0 && selectedRooms.length === rooms.length;

  const toggleAll = () => {
    onChange(allSelected ? [] : rooms.map(r => r.name));
  };

  const toggleRoom = (name: string) => {
    onChange(
      selectedRooms.includes(name)
        ? selectedRooms.filter(r => r !== name)
        : [...selectedRooms, name]
    );
  };

  const totalSqFt = rooms
    .filter(r => selectedRooms.includes(r.name))
    .reduce((sum, r) => sum + r.sqFt, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Select areas to service</h3>
        <Button variant="outline" size="sm" onClick={toggleAll}>
          {allSelected ? 'Deselect All' : 'Entire Home'}
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {rooms.map((room) => (
          <label
            key={room.name}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={selectedRooms.includes(room.name)}
              onCheckedChange={() => toggleRoom(room.name)}
            />
            <span className="flex-1 text-sm font-medium">{room.name}</span>
            <span className="text-xs text-muted-foreground">{room.sqFt} sq ft</span>
          </label>
        ))}
      </div>

      {selectedRooms.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Selected: <strong>{totalSqFt.toLocaleString()} sq ft</strong> across {selectedRooms.length} area(s)
        </p>
      )}

      <Button className="w-full" disabled={selectedRooms.length === 0} onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
};

export default RoomSelector;

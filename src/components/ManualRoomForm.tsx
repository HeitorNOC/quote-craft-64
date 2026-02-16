import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Room } from '@/types';

interface ManualRoomFormProps {
  initialRooms?: Room[];
  onSubmit: (rooms: Room[]) => void;
}

interface FormValues {
  rooms: Room[];
}

const ManualRoomForm = ({ initialRooms, onSubmit }: ManualRoomFormProps) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      rooms: initialRooms?.length ? initialRooms : [{ name: '', sqFt: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'rooms' });

  const onValid = (data: FormValues) => {
    const validRooms = data.rooms.filter(r => r.name.trim() && r.sqFt > 0);
    if (validRooms.length === 0) return;
    onSubmit(validRooms.map(r => ({ name: r.name.trim(), sqFt: Number(r.sqFt) })));
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                placeholder="Room name"
                {...register(`rooms.${index}.name`, { required: true })}
              />
              {errors.rooms?.[index]?.name && (
                <p className="text-xs text-destructive mt-1">Required</p>
              )}
            </div>
            <div className="w-28">
              <Input
                type="number"
                placeholder="Sq ft"
                min={1}
                {...register(`rooms.${index}.sqFt`, { required: true, min: 1, valueAsNumber: true })}
              />
              {errors.rooms?.[index]?.sqFt && (
                <p className="text-xs text-destructive mt-1">Min 1</p>
              )}
            </div>
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
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
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" /> Add Room
      </Button>

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
};

export default ManualRoomForm;

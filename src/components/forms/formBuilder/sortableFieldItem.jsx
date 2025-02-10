import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Label, Switch } from "@egaranti/components";

import FieldEditorDialog from "./fieldEditorDialog";

import { GripVertical, Trash2 } from "lucide-react";

const SortableFieldItem = ({ field, index, onRemove, onUpdate, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-2 rounded-lg border"
    >
      <div className="rounded-lg bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2" {...listeners}>
            <GripVertical className="text-muted-foreground h-5 w-5 cursor-move" />
            <div className="text-muted-foreground text-sm font-medium">
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">{field.label}</h3>

              <div className="flex items-center gap-2">
                <FieldEditorDialog field={field} onUpdate={onUpdate} />
                <button
                  className="h-8 w-8 rounded p-2 hover:bg-red-50 hover:text-red-500"
                  size="icon"
                  onClick={() => onRemove(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {children}
            <div className="mt-6 flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id={`hide-user-${field.id}`}
                  checked={field.hideUser}
                  onCheckedChange={(checked) =>
                    onUpdate(field.id, { hideUser: checked })
                  }
                />
                <Label htmlFor={`hide-user-${field.id}`}>
                  Tüketici görmesin
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id={`required-${field.id}`}
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    onUpdate(field.id, { required: checked })
                  }
                />
                <Label htmlFor={`required-${field.id}`}>Zorunlu</Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortableFieldItem;

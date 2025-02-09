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
              <div className="flex items-center gap-2">
                <div className="font-medium">{field.label}</div>
                <div className="text-muted-foreground text-sm">
                  ({field.key})
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FieldEditorDialog field={field} onUpdate={onUpdate} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {children}
            <div className="mt-2 flex items-center justify-end">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`required-${field.id}`}
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      onUpdate(field.id, { required: checked })
                    }
                  />
                  <Label htmlFor={`required-${field.id}`}>Required</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortableFieldItem;

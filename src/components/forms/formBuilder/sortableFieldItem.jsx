import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Label, Switch } from "@egaranti/components";

import FieldEditorDialog from "./fieldEditorDialog";
import { fieldRegistry } from "./fields/registry";

import { GripVertical, Trash2 } from "lucide-react";

const SortableFieldItem = ({
  field,
  index,
  onRemove,
  onUpdate,
  isFollowUp = false,
}) => {
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
      className="relative mb-4 rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <div className="flex items-center gap-2" {...listeners}>
          <GripVertical className="h-5 w-5 cursor-move text-gray-400 hover:text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FieldEditorDialog field={field} onUpdate={onUpdate} />
          <button
            className="flex h-8 w-8 items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            onClick={() => onRemove(field.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2">
          {(() => {
            const fieldConfig = fieldRegistry.get(field.type);
            const Icon = fieldConfig?.icon;
            return Icon ? <Icon className="h-5 w-5 text-gray-500" /> : null;
          })()}
          <h3 className="font-medium text-gray-800">{field.label}</h3>
        </div>
      </div>
    </div>
  );
};

export default SortableFieldItem;

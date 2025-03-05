import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import React from "react";

import { fieldRegistry } from "../fields/registry";
import FieldEditorDialog from "./fieldEditorDialog";

import { GripVertical, Trash2 } from "lucide-react";

/**
 * SortableFieldItem component for rendering a draggable form field item
 * Handles drag and drop functionality and field actions
 */
const SortableFieldItem = ({
  field,
  index,
  onRemove,
  onUpdate,
  isFollowUp = false,
}) => {
  // Use clientId as fallback if id is null
  const fieldId = field.id || field.clientId;

  // Set up sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldId });

  // Get field icon from registry
  const renderFieldIcon = () => {
    const fieldConfig = fieldRegistry.get(field.type);
    const Icon = fieldConfig?.icon;
    return Icon ? <Icon className="h-5 w-5 text-gray-500" /> : null;
  };

  // Create style for drag animation
  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group relative mb-4 rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
    >
      {/* Field header with drag handle and actions */}
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <div className="flex items-center gap-2" {...listeners}>
          <GripVertical className="h-5 w-5 cursor-move text-gray-400 group-hover:text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FieldEditorDialog
            field={{ ...field, isFollowUp }}
            onUpdate={(id, updates) => onUpdate(id, updates)}
          />
          <button
            className="flex h-8 w-8 items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            onClick={() => onRemove(fieldId)}
            aria-label="Alan sil"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Field content */}
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2">
          {renderFieldIcon()}
          <h3 className="text-sm font-medium text-gray-800">{field.label}</h3>
        </div>
      </div>
    </div>
  );
};

export default SortableFieldItem;

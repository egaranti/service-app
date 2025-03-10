import { Button } from "@egaranti/components";

import React, { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";

const PartItem = ({ part, level = 0, onAddSubpart, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const hasSubparts = part.subparts && part.subparts.length > 0;

  return (
    <>
      <div
        className={`flex items-center justify-between border-b p-4`}
        style={{ paddingLeft: level > 0 ? `${level * 24 + 16}px` : "16px" }}
      >
        <div className="flex items-center">
          {hasSubparts ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              {expanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          ) : (
            <div className="mr-2 w-5"></div>
          )}
          <div className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-gray-500" />
            <span>
              {part.name} {part.code && `(${part.code})`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {part.quantity && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {part.quantity} {part.unit || "adet"}
            </span>
          )}
          {part.subpartCount > 0 && (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm">
              {part.subpartCount} alt parça
            </span>
          )}
          <div className="flex gap-1">
            <Button
              variant="secondaryGray"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAddSubpart(part.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="secondaryGray"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(part)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="secondaryGray"
              size="icon"
              className="h-8 w-8 text-red-500"
              onClick={() => onDelete(part.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {expanded && hasSubparts && (
        <div>
          {part.subparts.map((subpart) => (
            <PartItem
              key={subpart.id}
              part={subpart}
              level={level + 1}
              onAddSubpart={onAddSubpart}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default PartItem;

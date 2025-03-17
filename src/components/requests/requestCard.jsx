import { Tag } from "@egaranti/components";

import React from "react";

import Avatar from "@/components/ui/avatar";

import { format } from "date-fns";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";

const statusColors = {
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

const RequestCard = ({ request, isSelected }) => {
  const statusColor = statusColors[request.status] || statusColors.default;

  return (
    <div
      className={cn(
        "relative flex cursor-pointer flex-col gap-4 border-b p-3 hover:border-gray-200 hover:bg-gray-50",
      )}
    >
      {isSelected && (
        <div className="absolute inset-y-0 left-0 w-1 bg-blue-500" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h3
            className={cn(
              "font-medium text-gray-900 hover:text-blue-600",
              isSelected && "text-blue-600",
            )}
          >
            #{request.id || "No title"}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-500"></p>
        </div>
        <Tag
          size="sm"
          className={cn("shrink-0 transition-colors duration-200", statusColor)}
        >
          {request.status}
        </Tag>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {request?.createdAt}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;

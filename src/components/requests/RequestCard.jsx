import { Tag } from "@egaranti/components";

import React from "react";

import { format } from "date-fns";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

const RequestCard = ({ request, isSelected }) => {
  const statusColor = statusColors[request.status] || statusColors.default;

  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-md border p-3 transition-all duration-200 ease-in-out",
        "hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm",
        isSelected
          ? "border-blue-200 bg-blue-50 shadow-sm"
          : "border-gray-100 bg-white",
      )}
    >
      {isSelected && (
        <div className="absolute inset-y-0 left-0 w-1 rounded-l-md bg-blue-500" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h3
            className={cn(
              "font-medium text-gray-900 hover:text-blue-600",
              isSelected && "text-blue-600",
            )}
          >
            {request.title || "No title"}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-500">
            {request.description || "No description provided"}
          </p>
        </div>
        <Tag
          size="sm"
          className={cn("shrink-0 transition-colors duration-200", statusColor)}
        >
          {request.status}
        </Tag>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <time dateTime={request.createdAt}>
            {format(new Date(request.createdAt), "dd.MM.yyyy HH:mm")}
          </time>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;

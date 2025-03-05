import React from "react";

import { cn } from "@/lib/utils";

// Generate initials for avatar
const getInitials = (name, surname) => {
  if (!name && !surname) return "?";
  return `${name?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();
};

// Generate a consistent color based on name
const getAvatarColor = (name) => {
  if (!name) return "bg-gray-300";

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-teal-500",
  ];

  // Simple hash function to get consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ name, surname, size = "md", className }) => {
  const sizeClasses = {
    sm: "h-5 w-5 text-[10px]",
    md: "h-6 w-6 text-xs",
    lg: "h-8 w-8 text-sm",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-medium text-white",
        sizeClasses[size],
        getAvatarColor(`${name} ${surname}`),
        className,
      )}
    >
      {getInitials(name, surname)}
    </div>
  );
};

export default Avatar;

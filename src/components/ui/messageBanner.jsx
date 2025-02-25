import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * MessageBanner component for displaying notifications or alerts
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of message (info, success, warning, error)
 * @param {boolean} props.show - Whether to show the banner
 * @param {function} props.onClose - Function to call when the banner is closed
 * @param {number} props.autoCloseTime - Time in ms after which the banner should auto-close (0 to disable)
 * @param {string} props.className - Additional class names
 */
const MessageBanner = ({
  message,
  type = "info",
  show = true,
  onClose,
  autoCloseTime = 0,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);

    if (show && autoCloseTime > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [show, autoCloseTime]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  // Define styles based on message type
  const typeStyles = {
    info: "bg-blue-50 border-blue-300 text-blue-800",
    success: "bg-green-50 border-green-300 text-green-800",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    error: "bg-red-50 border-red-300 text-red-800",
  };

  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        "relative mb-4 flex items-center justify-between rounded-lg border p-4 shadow-sm",
        typeStyles[type] || typeStyles.info,
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="flex-1">{message}</div>
      <button
        type="button"
        className="ml-4 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md hover:bg-slate-600 hover:bg-opacity-20 focus:outline-none"
        onClick={handleClose}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export { MessageBanner };

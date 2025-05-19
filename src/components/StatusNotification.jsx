import { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function StatusNotification({
  message = "Estado actualizado",
  onClose,
  type = "success", // "success", "warning", "error"
}) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  const colorMap = {
    success: "bg-green-600",
    warning: "bg-yellow-500",
    error: "bg-red-600",
  };

  const Icon =
    type === "success" ? FaCheckCircle : FaExclamationCircle;

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg flex items-center gap-2 text-white z-50 text-sm sm:text-base ${colorMap[type]}`}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>{message}</span>
    </div>
  );
}
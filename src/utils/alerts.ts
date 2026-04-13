import Toastify from "toastify-js";
import Swal from "sweetalert2";

export function showToast(
  type: "success" | "error" | "warning" | "info",
  message: string
) {
  let sign = "";
  let bgColor = "rgba(15, 23, 42, 0.95)";

  switch (type) {
    case "success":
      sign = "✨";
      bgColor = "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)";
      break;
    case "error":
      sign = "🚨";
      bgColor = "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)";
      break;
    case "warning":
      sign = "⚠️";
      bgColor = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      break;
    case "info":
      sign = "ℹ️";
      bgColor = "linear-gradient(135deg, #334155 0%, #1e293b 100%)";
      break;
  }

  Toastify({
    text: `${sign} ${message}`,
    duration: 3500,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: bgColor,
      color: "#ffffff",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      fontSize: "14px",
      padding: "12px 20px",
      fontWeight: "500",
      backdropFilter: "blur(8px)",
    },
  }).showToast();
}

export async function showConfirm(
  title: string,
  text: string,
  confirmButtonText: string = "Yes, delete it",
  icon: "warning" | "error" | "success" | "info" = "warning"
): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#e11d48",
    cancelButtonColor: "#94a3b8", 
    confirmButtonText,
    cancelButtonText: "Cancel",
    background: "#ffffff",
    customClass: {
      popup: "rounded-2xl border border-gray-100 shadow-2xl",
      title: "text-xl font-bold text-gray-900",
      htmlContainer: "text-gray-600",
      confirmButton: "px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md",
      cancelButton: "px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
    }
  });

  return result.isConfirmed;
}

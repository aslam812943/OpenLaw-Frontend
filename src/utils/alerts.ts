
import Toastify from "toastify-js";

export function showToast(
  type: "success" | "error" | "warning" | "info",
  message: string
) {
  let sign = "";
  let bgColor = "rgba(15, 23, 42, 0.95)"; // Slate-950 default

  switch (type) {
    case "success":
      sign = "✨";
      bgColor = "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)"; // Teal-600 to Teal-700
      break;
    case "error":
      sign = "🚨";
      bgColor = "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)"; // Rose-600 to Rose-800
      break;
    case "warning":
      sign = "⚠️";
      bgColor = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"; // Amber-500 to Amber-600
      break;
    case "info":
      sign = "ℹ️";
      bgColor = "linear-gradient(135deg, #334155 0%, #1e293b 100%)"; // Slate-700 to Slate-800
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

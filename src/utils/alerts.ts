// src/utils/showToast.ts
import Toastify from "toastify-js";

export function showToast(
  type: "success" | "error" | "warning" | "info",
  message: string
) {
  let sign = "";
  let bgColor = "rgba(0, 0, 0, 0.9)"; // default background

  switch (type) {
    case "success":
      sign = "✔️";
      bgColor = "linear-gradient(90deg, #088937ff, #16a34a)";
      break;
    case "error":
      sign = "✖️";
      bgColor = "linear-gradient(90deg, #070707ff, #030303ff)";
      break;
    case "warning":
      sign = "❕";
      bgColor = "linear-gradient(90deg, #23bb0fff, #359b06ff)";
      break;
    case "info":
      sign = "ℹ️";
      bgColor = "linear-gradient(90deg, #1f2125ff, #1c1e21ff)";
      break;
  }

  Toastify({
    text: `${sign} ${message}`,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "center",
    stopOnFocus: true,
    style: {
      background: bgColor,
      color: "#fff",
      borderRadius: "10px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
      fontSize: "14px",
      padding: "12px 15px",
      letterSpacing: "0.3px",
      fontWeight: "500",
    },
  }).showToast();
}

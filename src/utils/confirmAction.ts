import Swal from "sweetalert2";

/**
 * A reusable, elegant SweetAlert2 confirmation dialog.
 *
 * @param title - Main heading text (e.g. "Block User?")
 * @param text - Description or warning message.
 * @param confirmText - Confirm button text (default: "Yes")
 * @param icon - SweetAlert2 icon type (default: "warning")
 * @param confirmColor - Confirm button color (default: emerald)
 * @param cancelColor - Cancel button color (default: gray)
 * @returns Promise<boolean> - True if confirmed, false otherwise.
 */
export const confirmAction = async (
  title: string,
  text: string,
  confirmText: string = "Yes",
  icon: "warning" | "question" | "info" | "success" | "error" = "warning",
  confirmColor: string = "#10b981",
  cancelColor: string = "#9ca3af"
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    confirmButtonColor: confirmColor,
    cancelButtonColor: cancelColor,
    width: "350px",
    padding: "1.2rem",
    background: "#ffffff",
    color: "#1f2937",
    customClass: {
      popup: "rounded-2xl shadow-lg",
      title: "text-lg font-semibold",
      confirmButton: "text-sm px-3 py-1.5 rounded-md font-medium shadow-sm",
      cancelButton: "text-sm px-3 py-1.5 rounded-md font-medium shadow-sm",
    },
  });

  return result.isConfirmed;
};

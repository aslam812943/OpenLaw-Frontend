import { confirmActionInternal } from "@/context/ConfirmContext";

/**
 * A reusable, elegant and COMPACT custom confirmation dialog.
 * 
 * @param title - Main heading text (e.g. "Block User?")
 * @param text - Description or warning message.
 * @param confirmText - Confirm button text (default: "Confirm")
 * @param icon - Icon type (default: "warning")
 * @returns Promise<boolean> - True if confirmed, false otherwise.
 */
export const confirmAction = async (
  title: string,
  text: string,
  confirmText: string = "Confirm",
  icon: "warning" | "question" | "info" | "success" | "error" = "warning"
): Promise<boolean> => {
  return confirmActionInternal({
    title,
    message: text,
    confirmText,
    type: icon,
  });
};

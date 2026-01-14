import { confirmActionInternal } from "@/context/ConfirmContext";


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

import { GenericErrors } from "/@/types/error.ts";
import { showToast } from "/@/utils/toast.ts";

export function Errors({
  errors,
  clearError,
}: {
  errors: GenericErrors;
  clearError?: () => void;
}) {
  if (errors) {
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      if (typeof fieldErrors === "string") {
        showToast.error(`${field}: ${fieldErrors}`);
      } else if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((error) => {
          showToast.error(`${field}: ${error}`);
        });
      }
    });
    if (Object.keys(errors).length !== 0 && clearError) {
      clearError();
    }
  }

  return null;
}

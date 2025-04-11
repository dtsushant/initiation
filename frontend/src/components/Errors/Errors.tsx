import { GenericErrors } from "/@/types/error.ts";

export function Errors({ errors }: { errors: GenericErrors }) {
  return (
    <ul className="error-messages">
      {Object.entries(errors).flatMap(([field, fieldErrors]) => {
        if (typeof fieldErrors === "string") {
          return (
            <li key={`${field}-${fieldErrors}`}>
              {field} {fieldErrors}
            </li>
          );
        }

        return Object.values(fieldErrors).map((error) => (
          <li key={`${field}-${error}`}>
            {field} {error}
          </li>
        ));
      })}
    </ul>
  );
}

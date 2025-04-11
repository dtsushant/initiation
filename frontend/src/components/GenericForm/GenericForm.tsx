import React, { FC, Fragment } from "react";
import { GenericFormField } from "/@/types/genericFormField.tsx";
import { GenericErrors } from "/@/types/error.ts";
import { Errors } from "/@/components/Errors/Errors.tsx";
import { FormGroup } from "/@/components/FormGroup/FormGroup.tsx";

export interface GenericFormProps {
  fields: GenericFormField[];
  disabled: boolean;
  formObject: Record<string, string | null>;
  submitButtonText: string;
  errors: GenericErrors;
  onChange: (name: string, value: string) => void;
  onSubmit: (ev: React.FormEvent) => void;
  onAddItemToList?: (name: string) => void;
  onRemoveListItem?: (name: string, index: number) => void;
}

export const GenericForm: FC<GenericFormProps> = ({
  fields,
  disabled,
  formObject,
  submitButtonText,
  errors,
  onChange,
  onSubmit,
  onAddItemToList,
  onRemoveListItem,
}) => (
  <Fragment>
    <Errors errors={errors} />

    {fields.map((field) => {
      return <FormGroup key={field.name} props={field} />;
    })}
  </Fragment>
);

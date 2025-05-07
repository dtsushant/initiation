import React, { forwardRef } from "react";
import {
  Input,
  InputNumber,
  Select,
  TreeSelect,
  Switch,
  Checkbox,
  DatePicker,
  Button,
  CheckboxRef,
  CheckboxChangeEvent,
  Card,
  Form,
} from "antd";
import {
  ButtonTypeProperties,
  CheckboxTypeProperties,
  DateTypeProperties,
  FieldInputTypeProperties,
  InputTypeProperties,
  NumberTypeProperties,
  ObjectFieldProperties,
  ObjectListFieldProperties,
  PasswordTypeProperties,
  SelectTypeProperties,
  SwitchTypeProperties,
  TextareaTypeProperties,
  TreeSelectTypeProperties,
} from "@xingine/core/component/component-meta-map.ts";
import { formGroup } from "/@/lib/xingine-react/component/group/form/FormGroup.tsx";

export const InputField: React.FC<
  InputTypeProperties & { isSubmitting?: boolean }
> = ({ placeholder, maxLength, disabled }) => {
  return (
    <Input
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
    />
  );
};

export const PasswordField: React.FC<PasswordTypeProperties> = ({
  placeholder,
  disabled,
}) => {
  return <Input.Password placeholder={placeholder} disabled={disabled} />;
};

export const NumberField: React.FC<NumberTypeProperties> = ({
  min,
  max,
  step,
  precision,
  disabled,
}) => {
  return (
    <InputNumber
      min={min}
      max={max}
      step={step}
      precision={precision}
      disabled={disabled}
      style={{ width: "100%" }}
    />
  );
};

export const SelectField: React.FC<SelectTypeProperties> = ({
  options,
  multiple,
  disabled,
  placeholder,
}) => {
  return (
    <Select
      mode={multiple ? "multiple" : undefined}
      options={options}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};

export const TreeSelectField: React.FC<TreeSelectTypeProperties> = ({
  treeData,
  multiple,
  disabled,
  placeholder,
}) => {
  return (
    <TreeSelect
      treeData={treeData}
      multiple={multiple}
      disabled={disabled}
      placeholder={placeholder}
      style={{ width: "100%" }}
    />
  );
};

export const SwitchField: React.FC<SwitchTypeProperties> = ({
  checkedChildren,
  unCheckedChildren,
  defaultChecked,
  disabled,
}) => {
  return (
    <Switch
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      defaultChecked={defaultChecked}
      disabled={disabled}
    />
  );
};

export const DateField: React.FC<DateTypeProperties> = ({
  format,
  showTime,
  disabled,
}) => {
  return (
    <DatePicker
      format={format}
      showTime={showTime}
      disabled={disabled}
      style={{ width: "100%" }}
    />
  );
};

export const TextareaField: React.FC<TextareaTypeProperties> = ({
  rows,
  maxLength,
  placeholder,
  disabled,
}) => {
  return (
    <Input.TextArea
      rows={rows}
      maxLength={maxLength}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export const ObjectField: React.FC<ObjectFieldProperties> = ({
  fields,
  isSubmitting,
}) => {
  return <>{formGroup(fields, isSubmitting)}</>;
};

export const ObjectArrayField: React.FC<ObjectListFieldProperties> = ({
  itemFields,
  isSubmitting,
}) => {
  return (
    <Form.List name="">
      {(fields, { add, remove }) => (
        <>
          {fields.map((fieldMeta, index) => (
            <Card
              key={fieldMeta.key}
              title={`Item ${index + 1}`}
              style={{ marginBottom: 12 }}
            >
              {formGroup(itemFields, isSubmitting, [index])}
              <Button danger onClick={() => remove(fieldMeta.name)} block>
                Remove
              </Button>
            </Card>
          ))}
          <Button onClick={() => add()} block type="dashed">
            Add Item
          </Button>
        </>
      )}
    </Form.List>
  );
};
export const ButtonField = (
  props: ButtonTypeProperties & { isSubmitting: boolean },
) => {
  console.log("rendering button", props.isSubmitting);

  return (
    <Button
      type={props.type}
      disabled={props.disabled || props.isSubmitting}
      htmlType="submit"
      loading={props.isSubmitting}
    >
      {props.text}
    </Button>
  );
};

export const CheckboxField = forwardRef<
  CheckboxRef,
  CheckboxTypeProperties & {
    onChange?: (e: CheckboxChangeEvent) => void;
  }
>((props, ref) => (
  <Checkbox ref={ref} disabled={props.disabled} onChange={props.onChange}>
    {props.label}
  </Checkbox>
));

/*checkbox: forwardRef<
    CheckboxRef,
    CheckboxTypeProperties & {
  onChange?: (e: CheckboxChangeEvent) => void;
}
>((props, ref) => (
    <Checkbox ref={ref} disabled={props.disabled} onChange={props.onChange}>
      {props.label}
    </Checkbox>
));*/
export const fieldTypeRenderMap: Partial<{
  [K in keyof FieldInputTypeProperties]: React.ComponentType<
    FieldInputTypeProperties[K] & { isSubmitting?: boolean }
  >;
}> = {
  input: InputField,
  password: PasswordField,
  number: NumberField,
  select: SelectField,
  treeselect: TreeSelectField,
  switch: SwitchField,
  date: DateField,
  textarea: TextareaField,
  object: ObjectField,
  "object[]": ObjectArrayField,
  button: ButtonField,
  checkbox: CheckboxField,
};

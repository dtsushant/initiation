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
  FieldMeta,
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
import { NamePath } from "antd/es/form/interface";
import { FormGroup } from "/@/components/FormGroup/FormGroup.tsx";
import { LookupField } from "/@/lib/xingine-react/component/group/form/LookupField.tsx";

export const InputField: React.FC<
  InputTypeProperties & { isSubmitting?: boolean }
> = (props) => {
  const { onChange, placeholder, maxLength, disabled } = props;
  const change = () => {};
  return (
    <Input
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

export const PasswordField: React.FC<PasswordTypeProperties> = (props) => {
  const { placeholder, disabled, onChange } = props;
  return (
    <Input.Password
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

export const NumberField: React.FC<NumberTypeProperties> = (props) => {
  const { min, max, step, precision, disabled, onChange } = props;
  return (
    <InputNumber
      min={min}
      max={max}
      step={step}
      precision={precision}
      disabled={disabled}
      style={{ width: "100%" }}
      onChange={onChange}
    />
  );
};

export const SelectField: React.FC<SelectTypeProperties> = (props) => {
  const { options, multiple, disabled, placeholder, onChange } = props;
  return (
    <Select
      mode={multiple ? "multiple" : undefined}
      options={options}
      disabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export const TreeSelectField: React.FC<TreeSelectTypeProperties> = (props) => {
  const { treeData, multiple, disabled, placeholder, onChange } = props;
  return (
    <TreeSelect
      treeData={treeData}
      multiple={multiple}
      disabled={disabled}
      placeholder={placeholder}
      style={{ width: "100%" }}
      onChange={onChange}
    />
  );
};

export const SwitchField: React.FC<SwitchTypeProperties> = (props) => {
  const {
    checkedChildren,
    unCheckedChildren,
    defaultChecked,
    disabled,
    onChange,
  } = props;
  return (
    <Switch
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

export const DateField: React.FC<DateTypeProperties> = (props) => {
  const { format, showTime, disabled, onChange } = props;
  return (
    <DatePicker
      format={format}
      showTime={showTime}
      disabled={disabled}
      style={{ width: "100%" }}
      onChange={onChange}
    />
  );
};

export const TextareaField: React.FC<TextareaTypeProperties> = (props) => {
  const { rows, maxLength, placeholder, disabled, onChange } = props;
  return (
    <Input.TextArea
      rows={rows}
      maxLength={maxLength}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

export interface ObjectFieldProps extends ObjectFieldProperties {
  isSubmitting: boolean;
  parentName?: NamePath;
  label?: string;
  name?: string;
  callingField?: FieldMeta;
}
export const ObjectField: React.FC<ObjectFieldProps> = (props) => {
  const {
    fields,
    isSubmitting,
    parentName = [],
    label = "",
    name,
    callingField,
  } = props;
  const newParentName = [...parentName, name];

  return (
    <Card title={label} style={{ marginBottom: 16, background: "#fafafa" }}>
      {formGroup(fields, isSubmitting, newParentName, callingField)}
    </Card>
  );
};

export interface ObjectListFieldProps extends ObjectListFieldProperties {
  isSubmitting: boolean;
  parentName?: NamePath;
  label?: string;
  name?: string;
  callingField?: FieldMeta;
}

export const ObjectArrayField: React.FC<ObjectListFieldProps> = ({
  itemFields,
  isSubmitting,
  parentName = [],
  label = "",
  callingField,
}) => {
  return (
    <Card title={label} style={{ marginBottom: 16 }}>
      <Form.List name={parentName}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((fieldMeta, index) => (
              <Card
                key={fieldMeta.key}
                title={`${label} #${index + 1}`}
                type="inner"
                style={{ marginBottom: 12 }}
                extra={
                  <Button
                    danger
                    type="link"
                    onClick={() => remove(fieldMeta.name)}
                  >
                    Remove
                  </Button>
                }
              >
                {formGroup(
                  itemFields,
                  isSubmitting,
                  [...parentName, index],
                  callingField,
                )}
              </Card>
            ))}
            <Form.Item>
              <Button onClick={() => add()} block type="dashed">
                Add {label}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Card>
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
export const fieldTypeRenderMap = {
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
  lookup: LookupField,
} satisfies {
  [K in keyof FieldInputTypeProperties]: React.ComponentType<
    FieldInputTypeProperties[K] & {
      isSubmitting?: boolean;
      parentName?: NamePath;
      label?: string;
      name?: string;
    }
  >;
};

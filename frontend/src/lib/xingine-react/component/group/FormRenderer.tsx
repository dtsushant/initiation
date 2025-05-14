import { Form } from "antd";
import { FormMeta } from "@xingine/core/component/component-meta-map.ts";
import React, { useState } from "react";
import { fieldTypeRenderMap } from "/@/lib/xingine-react/component/group/form/FormGroup.map.tsx";
import { NamePath } from "antd/es/form/interface";
import { post } from "/@/services/initiation.service.ts";
import { dynamicShapeDecoder } from "@xingine";
import { formGroup } from "/@/lib/xingine-react/component/group/form/FormGroup.tsx";

const FormRenderer: React.FC<
  FormMeta & {
    onFinish?: (values: Record<string, unknown>) => void;
    onValuesChange?: (
      changed: Record<string, unknown>,
      all: Record<string, unknown>,
    ) => void;
  }
> = (meta) => {
  console.log("the mta here is", meta);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultFinish = async (
    values: Record<string, unknown>,
  ): Promise<void> => {
    console.log("default submission", values, meta.action);

    const result = await post<unknown>(
      values,
      dynamicShapeDecoder,
      meta.action,
    );

    result.match({
      ok: (res) => {
        console.log("the res", res);
      },
      err: (e) => {
        console.log("the errors", e);
      },
    });
  };
  const onFinish = async (values: Record<string, unknown>): Promise<void> => {
    setIsSubmitting(true);
    const actionToCall = meta.onFinish ? meta.onFinish : defaultFinish;
    try {
      await actionToCall(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onValuesChange = (
    changed: Record<string, unknown>,
    all: Record<string, unknown>,
  ): void => {
    console.log("Changed:", changed);
    console.log("All:", all);
  };

  const ButtonField = fieldTypeRenderMap["button"];
  const buttonProps = {
    text: "Submit",
    type: "primary",
    isSubmitting: isSubmitting,
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={
        meta.onValuesChange ? meta.onValuesChange : onValuesChange
      }
    >
      {formGroup(meta.fields, isSubmitting)}
      <Form.Item key="submit" name={"submit" as NamePath}>
        <ButtonField {...buttonProps} />
      </Form.Item>
    </Form>
  );
};

export default FormRenderer;

import { Form } from "antd";
import React, { useState } from "react";
import { NamePath } from "antd/es/form/interface";
import { useNavigate } from "react-router-dom";
import { FormMeta, ButtonTypeProperties, runAction } from "xingine";
//import {getModuleRegistryService, post, useSharedState} from "xingine-react";
import { formGroup } from "/@/initiation/components/form/FormGroup.tsx";
import {
  ExtraProps,
  renderField,
} from "/@/initiation/components/form/FormGroup.map.tsx";
import { useActionContext, useSharedState } from "xingine-react";
//import {useActionContext, useSharedState} from "/@/initiation/components/context/ActionContextProvider.tsx";

export const FormRenderer: React.FC<
  FormMeta & {
    onFinish?: (values: Record<string, unknown>) => void;
    onValuesChange?: (
      changed: Record<string, unknown>,
      all: Record<string, unknown>,
    ) => void;
  }
> = (meta) => {
  const { dispatch, event } = meta;
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { onSubmit } = event || {};

  const axnCtx = useActionContext();
  console.log("the axnCtx", axnCtx);
  const { setState: ss, getState: gs, navigate: nt } = axnCtx;

  const defaultFinish = async (
    values: Record<string, unknown>,
  ): Promise<void> => {
    if (onSubmit) {
      console.info("running the action ");
      runAction(onSubmit, axnCtx);
    }
    /*const result = await post<Record<string, unknown>,unknown>(
            values,
            dynamicShapeDecoder,
            meta.action,
        );

        result.match({
            ok: (res) => {
                console.log("the res", res);
                /!*if (dispatch && formSubmissionSuccessRedirectionPath) {
                    navigate(
                        resolveDynamicPath(
                            formSubmissionSuccessRedirectionPath,
                            res,
                            namedPathPayload,
                        ),
                    );
                }*!/
                if (onSubmit) {
                    runAction(onSubmit,actionProvider());
                }
            },
            err: (e) => {
                console.log("the errors", e);
            },
        });*/
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

  const buttonProps: ButtonTypeProperties & ExtraProps = {
    text: "Submit",
    type: "primary",
    isSubmitting: isSubmitting,
  };

  const count = useSharedState<number>("count"); // ✅ reactive!

  console.info("the setstate", ss, "the getState", gs);

  return (
    <>
      <p>Count: {count ?? 0}</p>
      <p>Count from gs: {gs("count")}</p>
      <button onClick={() => ss("count", (c) => (c ?? 0) + 1)}>
        Increment
      </button>
      <button onClick={() => nt("/mypage")}>navigate</button>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={
          meta.onValuesChange ? meta.onValuesChange : onValuesChange
        }
      >
        {formGroup(
          meta.fields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
          isSubmitting,
        )}
        <Form.Item key="submit" name={"submit" as NamePath}>
          {renderField("button", buttonProps)}
        </Form.Item>
      </Form>
    </>
  );
};

import React from "react";
import { FormMeta } from "@xingine/core/component/component-meta-map.ts";
import FormRenderer from "/@/lib/xingine-react/component/group/FormRenderer.tsx";

export const UserLogin: React.FC<FormMeta> = (meta) => {
  console.log("the props on userlogin", meta);
  const onFinish = async (values: Record<string, unknown>): Promise<void> => {
    console.log("Submitted values from parent:", values);
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(5000);
    console.log("Waited for 5 seconds");
  };

  const metaCombined = { ...meta, onFinish: onFinish };
  return <FormRenderer {...metaCombined} />;
};

UserLogin.displayName = "UserLogin";

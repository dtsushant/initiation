import React from "react";
import { FormMeta } from "@xingine/core/component/component-meta-map.ts";
import FormRenderer from "/@/lib/xingine-react/component/group/FormRenderer.tsx";

export const UserLogin: React.FC<FormMeta> = (meta) => {
  console.log("the props on userlogin", meta);
  return (
    <>
      <div>We render User Login page here</div>
      <FormRenderer {...meta} />
    </>
  );
};

UserLogin.displayName = "UserLogin";

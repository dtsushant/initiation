import React from "react";
import { FormMeta } from "@xingine/core/component/component-meta-map.ts";
import FormRenderer from "/src/lib/xingine-react/component/group/FormRenderer.tsx";
import { post } from "/src/lib/xingine-react/xingine-react.service.ts";
import {
  loadUserIntoApp,
  userResponseDecoder,
} from "/@/initiation/components/auth/Auth.types.ts";

export const UserLogin: React.FC<FormMeta> = (meta) => {
  const onFinish = async (values: Record<string, unknown>): Promise<void> => {
    const result = await post(values, userResponseDecoder, meta.action);
    result.match({
      ok: (user) => {
        location.pathname = "/dashboard";
        loadUserIntoApp(user.user);
      },
      err: (e) => {
        console.log("the error", e);
        //store.dispatch(updateErrors(e));
      },
    });
  };

  const metaCombined = { ...meta, onFinish: onFinish };
  return <FormRenderer {...metaCombined} />;
};

UserLogin.displayName = "UserLogin";

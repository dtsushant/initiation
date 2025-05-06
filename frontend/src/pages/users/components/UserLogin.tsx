import React from "react";
import { FormMeta } from "@xingine/core/component/component-meta-map.ts";
import FormRenderer from "/@/lib/xingine-react/component/group/FormRenderer.tsx";
import { post } from "/@/services/initiation.service.ts";
import { store } from "/@/store";
import { loadUserIntoApp, userResponseDecoder } from "/@/types/auth.ts";
import { updateErrors } from "/@/pages/auth/Login.slice.ts";

export const UserLogin: React.FC<FormMeta> = (meta) => {
  const onFinish = async (values: Record<string, unknown>): Promise<void> => {
    const result = await post(values, userResponseDecoder, meta.action);
    result.match({
      ok: (user) => {
        location.hash = "#/dashboard";
        loadUserIntoApp(user.user);
      },
      err: (e) => {
        store.dispatch(updateErrors(e));
      },
    });
  };

  const metaCombined = { ...meta, onFinish: onFinish };
  return <FormRenderer {...metaCombined} />;
};

UserLogin.displayName = "UserLogin";

import React from "react";
import { FormMeta } from "xingine/dist/core/component/component-meta-map";
import { ChartRenderer, post } from "xingine-react";
import {
  loadUserIntoApp,
  User,
  userResponseDecoder,
} from "/@/initiation/components/auth/Auth.types.ts";
import { FormRenderer } from "xingine-react";

export const UserLogin: React.FC<FormMeta> = (meta) => {
  const onFinish = async (values: Record<string, unknown>): Promise<void> => {
    const result = await post<Record<string, unknown>, User>(
      values,
      userResponseDecoder,
      meta.action,
    );
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

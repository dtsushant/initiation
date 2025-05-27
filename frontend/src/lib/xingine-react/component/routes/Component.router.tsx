import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { lazyLoadComponent } from "/@/lib/xingine-react/component/utils/Component.utils.ts";
import { AccessGuard } from "/@/lib/xingine-react/component/ComponentAccessGuard.tsx";
import { DefaultLayout } from "/@/lib/xingine-react/component/ComponentDefaultLayout.tsx";
import { NotFound } from "/@/lib/xingine-react/component/group/NotFound.tsx";
import { UIComponent } from "@xingine";

export const DynamicRouter = (modules: UIComponent[]) => {
  console.log("the modules", modules);

  return (
    <>
      {modules.length > 0 &&
        modules.map((mod) => {
          const Component = lazyLoadComponent(mod.component);

          return (
            <Route
              key={mod.path}
              path={mod.path}
              element={
                <AccessGuard
                  roles={mod.roles}
                  permissions={mod.permissions}
                  comrade={}
                >
                  <DefaultLayout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Component meta={mod.meta} />
                    </Suspense>
                  </DefaultLayout>
                </AccessGuard>
              }
            />
          );
        })}
      <Route path="*" element={<NotFound />} />
    </>
  );
};

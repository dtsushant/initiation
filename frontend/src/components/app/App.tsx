import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { ConfigProvider, Spin, message } from "antd";
import { ToastContainer } from "react-toastify";
import { Router } from "../../routes/router.tsx";
import { AuthProvider } from "../../context/AuthContext.tsx";
import { MessageCleaner } from "../common/ui/MessageCleaner.tsx";
import { ScrollToTop } from "../common/ScrollToTop.tsx";
import { HeadProvider } from "react-head";
import { store } from "/@/store";
import {
  formConfig,
  getPopupContainerConfig,
  themeConfig,
} from "/@/utils/ant.ts";
import { useStoreWithInitializer } from "/@/store/store.hook.ts";
import {
  endLoad,
  loadAllowedModule,
  loadUser,
} from "/@/components/app/App.slice.ts";
import axios from "axios";
import { userResponseDecoder } from "/@/types/auth.ts";
import { get } from "/@/services/initiation.service.ts";
import { modulePropertiesListDecoder } from "@xingine/core/xingine.decoder.ts";
import { ModuleProperties } from "@xingine";
import { getModuleRegistryService } from "/@/lib/xingine-react/xingine-react.registry.ts";

// Configure global message behavior
message.config({
  maxCount: 1,
  duration: 5,
});

export function App() {
  const { loading, user, allowedModule } = useStoreWithInitializer(
    ({ app }) => app,
    load,
  );

  const userIsLogged = !!user;
  return (
    <Suspense fallback={<Spin size="large" />}>
      <ConfigProvider
        form={formConfig}
        getPopupContainer={getPopupContainerConfig}
        theme={themeConfig}
      >
        <Provider store={store}>
          <HeadProvider>
            <HashRouter>
              {!loading && (
                <AuthProvider>
                  <ScrollToTop />
                  <MessageCleaner />
                  <Router />
                  <ToastContainer />
                </AuthProvider>
              )}
            </HashRouter>
          </HeadProvider>
        </Provider>
      </ConfigProvider>
    </Suspense>
  );
}

async function load() {
  if (!store.getState().app.loading) {
    store.dispatch(endLoad());
    return;
  }

  try {
    store.dispatch(
      loadAllowedModule(getModuleRegistryService()!.getAll().moduleProperties),
    );
    store.dispatch(
      loadUser((await get(userResponseDecoder, "users/user")).user),
    );
  } catch {
    store.dispatch(endLoad());
  }
}

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
import { endLoad, loadUser } from "/@/components/app/App.slice.ts";
import axios from "axios";
import { getUser } from "/@/services/auth.service.ts";

// Configure global message behavior
message.config({
  maxCount: 1,
  duration: 5,
});

export function App() {
  const { loading, user } = useStoreWithInitializer(({ app }) => app, load);

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
  const token = localStorage.getItem("token");
  if (!store.getState().app.loading || !token) {
    store.dispatch(endLoad());
    return;
  }
  axios.defaults.headers.Authorization = `Token ${token}`;

  try {
    store.dispatch(loadUser(await getUser()));
  } catch {
    store.dispatch(endLoad());
  }
}

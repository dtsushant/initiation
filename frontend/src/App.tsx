import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider, Spin, message } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '/@/styles/global.css';
import '/@/styles/antd.css';
import { Router } from './routes/router';
import { store } from '/@/store';
import { formConfig, getPopupContainerConfig, themeConfig } from '/@/utils/ant';
import { AuthProvider } from './context/AuthContext';
import { MessageCleaner } from './components/common/ui/MessageCleaner';
import { ScrollToTop } from './components/common/ScrollToTop';
import { HeadProvider } from 'react-head';

// Configure global message behavior
message.config({
  maxCount: 1,
  duration: 5,
});

export function App() {
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
              <AuthProvider>
                <ScrollToTop />
                <MessageCleaner />
                <Router />
                <ToastContainer />
              </AuthProvider>
            </HashRouter>
          </HeadProvider>
        </Provider>
      </ConfigProvider>
    </Suspense>
  );
}

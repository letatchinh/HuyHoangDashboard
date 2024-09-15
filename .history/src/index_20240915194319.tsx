import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider } from "antd";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "~/core/i18n";
import "~/styles/app.scss";
import App from "./App";
import { theme } from "./core/ProviderAntd";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { NotificationProvider } from "./store/NotificationContext";
import vi_VN from 'antd/lib/locale/vi_VN';
import 'dayjs/locale/vi';// Import the Vietnamese locale
import { ConfigProviderProps } from "antd/es/config-provider/index";
import '~/modules/notification/firebase'
type Locale = ConfigProviderProps['locale'];

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const customLocale  : Locale = {
  ...vi_VN, // Copy the existing Vietnamese locale
};

root.render(
  <Suspense fallback={<LoadingOutlined spin />}>
    <Provider store={store}>
      <BrowserRouter>
        {/* Config Provider Of Antd */}
        <ConfigProvider theme={theme} locale={customLocale}>
          {/* Toast Notification Of Antd */}
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </Suspense>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

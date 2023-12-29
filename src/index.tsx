import { LoadingOutlined } from "@ant-design/icons";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "~/core/i18n"
import "~/styles/app.scss";
import App from "./App";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { NotificationProvider } from "./store/NotificationContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Suspense fallback={<LoadingOutlined spin />}>
    <Provider store={store}>
      <BrowserRouter>
        {/* Toast Notification Of Antd */}
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </BrowserRouter>
    </Provider>
  </Suspense>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

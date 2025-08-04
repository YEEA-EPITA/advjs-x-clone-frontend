import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AppStateProvider } from "./context/AppStateProvider";
import { Provider } from "react-redux";
import { store } from "./store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import InstallPWA from "./components/InstallPWAs";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AppStateProvider>
          <App />
          <InstallPWA />
        </AppStateProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
serviceWorkerRegistration.register();

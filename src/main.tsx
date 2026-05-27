import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Provider } from 'react-redux';
import { store } from './store/store';
import {registerSW} from "virtual:pwa-register";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  registerSW()
}
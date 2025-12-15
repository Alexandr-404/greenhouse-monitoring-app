import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "../providers";

import "../styles/global.scss";

async function enableMsw() {
  // включаем мок всегда (для демо)
  const { worker } = await import("../../mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });
}

enableMsw().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders />
    </React.StrictMode>
  );
});

import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "../providers";

import "../styles/global.scss";

async function enableMsw() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import("../../mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMsw().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders />
    </React.StrictMode>
  );
});

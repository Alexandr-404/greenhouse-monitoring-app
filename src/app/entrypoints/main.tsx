import { StrictMode } from "react";
import App from "../App";
import { createRoot } from "react-dom/client";

import "../styles/global.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

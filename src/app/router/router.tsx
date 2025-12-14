import { createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { DashboardPage } from "../../pages/dashboard";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { DashboardPage } from "../../pages/dashboard";
import { GreenhousePage } from "../../pages/greenhouse";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
        children: [{ path: "greenhouses/:id", element: <GreenhousePage /> }],
      },
    ],
  },
]);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Root from "@/routes/root";
import About from "@/routes/about";
import Map from "@/routes/map";
import Sponsors from "@/routes/sponsors";

import ErrorPage from "./error-page";

import store from "./store";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Map />,
      },
      {
        path: "/way/:wayId",
        element: <Map />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/sponsors",
        element: <Sponsors />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);

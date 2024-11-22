import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "@/routes/root";
import About from "@/routes/about";
import Map from "@/routes/map";
import Login from "@/routes/login";
import Sponsors from "@/routes/sponsors";
import Contact from "@/routes/contact";
import ErrorPage from "./error-page";
import store from "./store";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import initIbre, { init_hooks as initHooks } from "ibre";

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
        path: "/login",
        element: <Login />,
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
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
]);

(async () => {
  await initIbre();
  initHooks();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>,
  );
})();

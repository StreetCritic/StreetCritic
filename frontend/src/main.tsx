import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import About from "@/routes/about";
import Contact from "@/routes/contact";
import Login from "@/routes/login";
import Map from "@/routes/map";
import Root from "@/routes/root";
import Sponsors from "@/routes/sponsors";
import TermsOfUse from "@/routes/TermsOfUse";
import ErrorPage from "./error-page";
import store from "./store";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import initIbre, { init_hooks as initHooks } from "ibre";
import User, { UserContext } from "./User";

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
      {
        path: "/terms-of-use",
        element: <TermsOfUse />,
      },
    ],
  },
]);

(async () => {
  await initIbre();
  initHooks();
  const locale = store.getState().app.locale;
  let languages = undefined;
  if (locale === "de-DE") {
    languages = await import(`./features/i18n/languages/de-DE`);
  } else {
    languages = await import(`./features/i18n/languages/en-US`);
  }
  // @ts-expect-error
  window.streetcritic = {
    translations: languages.translations,
  };

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <UserContext.Provider value={new User()}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      </Provider>
    </StrictMode>,
  );
})();

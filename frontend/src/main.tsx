import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Contact from "@/routes/contact";
import Login from "@/routes/login";
import Map from "@/routes/map";
import Root from "@/routes/root";
import { default as UserPage } from "@/routes/user";
import ErrorPage from "./error-page";
import store from "./store";

import { createBrowserRouter, RouterProvider } from "react-router";
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
        path: "/way/:wayId/:waySlug?",
        element: <Map />,
      },
      {
        path: "/user/:username",
        element: <UserPage />,
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
  const locale = store.getState().app.locale;
  let languages = undefined;
  if (locale === "de-DE") {
    languages = await import(`./features/i18n/languages/de-DE`);
  } else {
    languages = await import(`./features/i18n/languages/en-US`);
  }
  // @ts-expect-error TODO
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

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import iconURL from "./icon.png";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

import Header from "@/components/header";
import { Notifications } from "@mantine/notifications";

import { Provider } from "react-redux";
import store from "./store";

import { Avatar, createTheme, MantineProvider, rem } from "@mantine/core";

import type { Route } from "./+types/root";

import User, { UserContext } from "./User";
import { useEffect, useState } from "react";
import { TranslationsContext } from "./features/i18n";
import { Container } from "./components";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  headings: {
    sizes: {
      h1: {
        fontSize: rem(36),
      },
      h2: { fontSize: rem(30), lineHeight: "1.5" },
      // ...up to h6
      h6: { fontWeight: "900" },
    },
  },
  components: {
    Avatar: Avatar.extend({
      vars: (_theme, _props) => {
        return {
          root: {
            "--avatar-bg": "white",
          },
        };
      },
    }),
  },
  /* colors: {
   *   'streetcritic-green': [
   *     "#fcffeb",
   *     "#f8fed5",
   *     "#effea4",
   *     "#e7fe6f",
   *     "#e0fe48",
   *     "#dbfe34",
   *     "#d8fe2b",
   *     "#bee221",
   *     "#a8c916",
   *     "#90ad00"
   *   ],
   * },
   * primaryColor: "streetcritic-green", */
});

export function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    setUser(new User());
  }, []);

  const [translations, setTranslations] = useState<null>(null);
  useEffect(() => {
    (async () => {
      let languages = undefined;
      if (store.getState().app.locale === "de-DE") {
        languages = await import(`./features/i18n/languages/de-DE`);
      } else {
        languages = await import(`./features/i18n/languages/en-US`);
      }
      // @ts-expect-error TODO
      setTranslations(languages.translations);
    })();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>StreetCritic</title>
        <link rel="icon" type="image/svg+xml" href={iconURL} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://streetcritic.org/" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <TranslationsContext.Provider value={translations}>
            <UserContext.Provider value={user}>
              <div id="root">
                <MantineProvider theme={theme}>
                  <Notifications />
                  <Header />
                  {children}
                </MantineProvider>
              </div>
            </UserContext.Provider>
          </TranslationsContext.Provider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <Container>
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </Container>
    </main>
  );
}

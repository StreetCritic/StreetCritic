import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import type { ShouldRevalidateFunctionArgs } from "react-router";

import iconURL from "./icon.png";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

import Header from "@/components/header";
import { Notifications } from "@mantine/notifications";

import { Provider } from "react-redux";
import { makeStore } from "./store";

import { Avatar, createTheme, MantineProvider, rem } from "@mantine/core";

import type { Route } from "./+types/root";

import User, { UserContext } from "./User";
import { useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  findUILanguage,
  TranslationsContext,
} from "./features/i18n";
import { commitSession, getSession } from "./sessions.server";
import { localeSet } from "./features/map/appSlice";
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

async function loadTranslations(locale: string): Promise<string> {
  const languages =
    locale === "de-DE"
      ? await import(`./features/i18n/languages/de-DE`)
      : await import(`./features/i18n/languages/en-US`);
  return languages.translations;
}

/**
 * Determines the UI locale server-side and loads its translations, so that the
 * first render is already localized.
 *
 * The locale is taken from an explicit `lang` URL parameter, then from the one
 * previously chosen that way, and otherwise negotiated from the Accept-Language
 * header.
 *
 * Only an explicit choice is written to the session. A negotiated locale is
 * deliberately not persisted: storing it would pin the UI to whatever the first
 * request happened to resolve to for a year, and stop it following the browser
 * settings when those change.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const chosenLocale = session.get("locale");

  const langParam = new URL(request.url).searchParams.get("lang");
  let locale;
  if (langParam) {
    locale = findUILanguage(langParam);
  } else if (chosenLocale) {
    // Negotiated rather than trusted, the cookie is client-controlled.
    locale = findUILanguage(chosenLocale);
  } else {
    locale = findUILanguage(request.headers.get("Accept-Language"));
  }

  const translations = await loadTranslations(locale);

  if (!langParam || locale === chosenLocale) {
    return data({ locale, translations });
  }
  session.set("locale", locale);
  return data(
    { locale, translations },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
}

/**
 * The root loader only needs to run again when the locale can actually change,
 * which is when the `lang` parameter differs. Revalidating on every client
 * navigation would cost a round trip per navigation for data that is stable.
 */
export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  return (
    currentUrl.searchParams.get("lang") !== nextUrl.searchParams.get("lang")
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    setUser(new User());
  }, []);

  // Undefined when the loader did not run, e.g. while rendering the error
  // boundary.
  const loaderData = useRouteLoaderData<typeof loader>("root");
  const locale = loaderData?.locale || DEFAULT_LOCALE;
  const translations = loaderData?.translations || null;

  // One store per render, seeded with the locale before anything renders, so
  // that SSR and the first client render agree.
  const [store] = useState(() => {
    const store = makeStore();
    store.dispatch(localeSet(locale));
    return store;
  });
  useEffect(() => {
    store.dispatch(localeSet(locale));
  }, [store, locale]);

  return (
    <html lang={locale}>
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

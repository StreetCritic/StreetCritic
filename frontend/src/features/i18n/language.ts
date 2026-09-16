import Negotiator from "negotiator";

/**
 * Locales the UI is translated into.
 *
 * The order breaks ties when a client expresses no preference between them,
 * as with `Accept-Language: *`, so the default locale comes first.
 */
export const SUPPORTED_LOCALES = ["en-US", "de-DE"];

/** Locale used when no supported locale could be negotiated. */
export const DEFAULT_LOCALE = "en-US";

/**
 * Negotiates the locale to use for the UI from an `Accept-Language` header.
 *
 * A bare language tag is itself a valid header value, so this doubles as
 * validation for a single untrusted tag, such as the `lang` URL parameter or
 * the locale stored in the session cookie.
 *
 * A tag matches a locale when it is equal to it or is its language subtag, so
 * `de` selects `de-DE` but `de-AT` does not.
 *
 * @param acceptLanguage Raw header value, e.g. `de-DE,de;q=0.9,en;q=0.8`
 */
export function findUILanguage(acceptLanguage: string | null): string {
  const [best] = new Negotiator({
    // Negotiator expects a request-like object, and reads an absent header as
    // `*`. Normalizing to an empty string keeps the fallback below in charge.
    headers: { "accept-language": acceptLanguage ?? "" },
  }).languages(SUPPORTED_LOCALES);
  return best ?? DEFAULT_LOCALE;
}

/**
 * Name of each supported locale, written in that locale.
 */
export const LOCALE_NAMES: Record<string, string> = {
  "en-US": "English",
  "de-DE": "Deutsch",
};

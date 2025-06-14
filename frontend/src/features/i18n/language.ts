/**
 * Finds language to be used for the UI based on the browser settings.
 *
 * @param languages Language preferences, defaults to navigator.languages
 */
export function findUILanguage(languages?: string[]): string {
  languages = languages || [];
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const langParam = url.searchParams.get("lang");
    if (langParam) {
      languages = [langParam];
    }
  }
  if (typeof navigator !== "undefined") {
    languages.concat(navigator.languages);
  }
  for (const language of languages) {
    for (const supported of ["de-DE", "en-US"]) {
      if (language === supported || language === supported.slice(0, 2)) {
        return supported;
      }
    }
  }
  return "en-US";
}

/**
 * Finds language to be used for the UI based on the browser settings.
 *
 * @param languages Language preferences, defaults to navigator.languages
 */
export function findUILanguage(languages?: string[]): string {
  for (const language of languages || navigator.languages) {
    for (const supported of ["de-DE", "en-US"]) {
      if (language === supported || language === supported.slice(0, 2)) {
        return supported;
      }
    }
  }
  return "en-US";
}

import { useLocale } from "@/hooks";
import React, { useEffect, useState } from "react";
import { LoadingPage } from "@/components";

/**
 * Dynamically imports the page for the current locale.
 * @param translations Maps locales to page imports.
 */
export function useLocalizedPage(
  translations: Record<
    string,
    () => Promise<{ default: React.FunctionComponent }>
  >,
) {
  const [content, setContent] = useState<React.ReactNode>(<LoadingPage />);
  const locale = useLocale();
  useEffect(() => {
    (async () => {
      const content = await translations[locale]();
      setContent(React.createElement(content.default));
    })();
  }, [locale, translations]);
  return content;
}

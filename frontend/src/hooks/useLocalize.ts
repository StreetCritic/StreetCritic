import { selectAppState } from "@/features/map/appSlice";
import { useSelector } from "react-redux";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import { useCallback, useContext, useMemo } from "react";
import { TranslationsContext } from "@/features/i18n";

export default function useLocalize() {
  const appState = useSelector(selectAppState);
  const translations = useContext(TranslationsContext);
  const resource = useMemo(
    // @ts-expect-error TODO
    () => new FluentResource(translations),
    [translations],
  );

  return useCallback(
    (id: string) => {
      if (!translations) {
        return "";
      }
      const bundle = new FluentBundle(appState.locale);
      const _errors = bundle.addResource(resource);
      const welcome = bundle.getMessage(id);
      let text = "";
      if (welcome?.value) {
        text = bundle.formatPattern(welcome.value, { name: "Anna" });
      }
      return text;
    },
    [appState.locale, resource, translations],
  );
}

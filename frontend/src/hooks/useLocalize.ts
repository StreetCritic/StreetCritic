import { selectAppState } from "@/features/map/appSlice";
import { useSelector } from "react-redux";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import { useCallback, useMemo } from "react";

export default function useLocalize() {
  const appState = useSelector(selectAppState);
  const resource = useMemo(
    // @ts-expect-error
    () => new FluentResource(window.streetcritic.translations),
    [],
  );

  return useCallback(
    (id: string) => {
      const bundle = new FluentBundle(appState.locale);
      const _errors = bundle.addResource(resource);
      const welcome = bundle.getMessage(id);
      let text = "";
      if (welcome?.value) {
        text = bundle.formatPattern(welcome.value, { name: "Anna" });
      }
      return text;
    },
    [appState.locale, resource],
  );
}

import { selectAppState } from "@/features/map/appSlice";
import { useSelector } from "react-redux";
import { FluentBundle, FluentResource } from "@fluent/bundle";

const resourceDe = new FluentResource(`
-brand-name = Foo 3000
welcome = Welcome, {$name}, to {-brand-name}!
sign-up = Registrieren
`);

const resourceEn = new FluentResource(`
sign-up = Sign up
`);

export default function useLocalize() {
  const appState = useSelector(selectAppState);

  return (id: string) => {
    const bundle = new FluentBundle(appState.locale);
    const errors = bundle.addResource(
      appState.locale == "de" ? resourceDe : resourceEn,
    );
    let welcome = bundle.getMessage(id);
    let text = "";
    if (welcome?.value) {
      text = bundle.formatPattern(welcome.value, { name: "Anna" });
    }
    return text;
  };
}

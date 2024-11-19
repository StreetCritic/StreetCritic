import { selectAppState } from "@/features/map/appSlice";
import { useSelector } from "react-redux";
import { FluentBundle, FluentResource } from "@fluent/bundle";

const resourceDe = new FluentResource(`
-brand-name = Foo 3000
welcome = Welcome, {$name}, to {-brand-name}!
sign-up = Registrieren
`);

const resourceEn = new FluentResource(`
abort = Abort
dismiss = Dismiss
continue = Continue
sign-up = Sign up

add-way-title = Add a new way
add-way-intro = Select a start and a stop of the new way by clicking on the map.

reviews = Reviews
reviews-empty = No reviews yet. Be the first to add one!

form-submitted-success-title = Submission Successful
form-submitted-success-body = Your message has been successfully submitted.

form-submitted-error-title = Submission Failed
form-submitted-error-body = There was an error while submitting your message. Please try again later.
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

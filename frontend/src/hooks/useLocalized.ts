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
discard = Discard
previous = Previous
next = Next
submit = Submit
continue = Continue
sign-up = Sign up
log-in = Log in
no = No
yes = Yes

title = Title

add-way-title = Add a new way
add-way-intro = Select a start and a stop of the new way by clicking on the map.

reviews = Reviews
reviews-empty = No reviews yet. Be the first to add one!

form-submitted-success-title = Submission Successful
form-submitted-success-body = Your message has been successfully submitted.

form-submitted-error-title = Submission Failed
form-submitted-error-body = There was an error while submitting your message. Please try again later.

way-create-form-intro = Provide a title for the route, e.g., 'Southern Main Street to Market Place.' Use the local name and language.
way-create-form-about-to-submit = You can now submit your new route. If needed, feel free to go back to a previous step before finalizing your submission.
way-create-form-discard-way-confirm = Are you sure to discard your new way?
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

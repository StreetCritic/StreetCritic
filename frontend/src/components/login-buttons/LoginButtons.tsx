import { dispatchEvent, Event } from "@/events";
import { useLocalize, useUser } from "@/hooks";
import { Button } from "@mantine/core";

export default function LoginButtons() {
  const __ = useLocalize();
  const user = useUser();
  return (
    <>
      <Button
        onClick={() => {
          user.register();
          dispatchEvent(new Event("clicked-login-buttons-sign-up"));
        }}
      >
        {__("sign-up")}
      </Button>
      <Button
        variant="default"
        onClick={() => {
          user.signIn();
          dispatchEvent(new Event("clicked-login-buttons-log-in"));
        }}
      >
        {__("log-in")}
      </Button>
    </>
  );
}

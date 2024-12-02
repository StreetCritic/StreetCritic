import { useLocalize, useUser } from "@/hooks";
import { Button } from "@mantine/core";

export default function LoginButtons() {
  const __ = useLocalize();
  const user = useUser();
  return (
    <>
      <Button variant="default" onClick={() => user.signIn()}>
        {__("log-in")}
      </Button>
      <Button onClick={() => user.register()}>{__("sign-up")}</Button>
    </>
  );
}

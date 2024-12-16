import { useLocalize, useUser } from "@/hooks";
import { Button } from "@mantine/core";

export default function LoginButtons() {
  const __ = useLocalize();
  const user = useUser();
  return (
    <>
      <Button onClick={() => user.register()}>{__("sign-up")}</Button>
      <Button variant="default" onClick={() => user.signIn()}>
        {__("log-in")}
      </Button>
    </>
  );
}

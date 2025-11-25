import Container from "@/components/container";
import { P } from "@/components/typography";
import { useUser } from "@/hooks";
import { useEffect } from "react";

export default function About() {
  const user = useUser();
  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      user.signinCallback();
    })();
  }, [user]);
  return (
    <main>
      <Container>
        <P>Signing in....</P>
      </Container>
    </main>
  );
}

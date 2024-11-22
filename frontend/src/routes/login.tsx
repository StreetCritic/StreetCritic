import { signinCallback } from "@/auth";
import Container from "@/components/container";
import { P } from "@/components/typography";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    (async () => {
      signinCallback();
    })();
  });
  return (
    <main>
      <Container>
        <P>Signing in....</P>
      </Container>
    </main>
  );
}

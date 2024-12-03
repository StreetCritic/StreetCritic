import Container from "@/components/container";
import { ContactForm } from "@/components";
import useMeta from "@/hooks/useMeta";

export default function Contact() {
  useMeta({ title: "Contact us" });
  return (
    <main>
      <Container>
        <ContactForm />
      </Container>
    </main>
  );
}

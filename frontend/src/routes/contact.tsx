import Container from "@/components/container";
import { ContactForm } from "@/components";
import useMeta from "@/hooks/useMeta";
import { useLocalize } from "@/hooks";

export default function Contact() {
  const __ = useLocalize();
  useMeta({ title: __("contact-form-title") });
  return (
    <main>
      <Container>
        <ContactForm />
      </Container>
    </main>
  );
}

import {
  Loader,
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
  Fieldset,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Alert, H1 } from "@/components";
import { useState } from "react";
import { useLocalized } from "@/hooks";

enum FormState {
  Default,
  Submitting,
  Submitted,
  Error,
}

export default function ContactForm() {
  const __ = useLocalized();
  const [formState, setFormState] = useState<FormState>(FormState.Default);
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value: string) => value.trim().length < 2,
      email: (value: string) => !/^\S+@\S+$/.test(value),
      subject: (value: string) => value.trim().length === 0,
    },
  });

  const submit = (values: any) => {
    (async () => {
      setFormState(FormState.Submitting);
      try {
        const response = await fetch(`https://api.e3code.de/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context: "StreetCritic::ContactForm",
            ...values,
          }),
        });
        if (response.ok) {
          setFormState(FormState.Submitted);
          return;
        }
        throw new Error();
      } catch (e) {
        setFormState(FormState.Error);
      }
    })();
  };

  if (formState === FormState.Submitted) {
    return (
      <Alert title={__("form-submitted-success-title")} type="success">
        {__("form-submitted-success-body")}
      </Alert>
    );
  }

  return (
    <>
      <H1>Get in touch</H1>
      <form
        onSubmit={form.onSubmit((values: any) => {
          submit(values);
        })}
      >
        <Fieldset disabled={formState === FormState.Submitting}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
            <TextInput
              label="Name"
              placeholder="Your name"
              name="name"
              variant="filled"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              placeholder="Your email"
              name="email"
              variant="filled"
              {...form.getInputProps("email")}
            />
          </SimpleGrid>

          <TextInput
            label="Subject"
            placeholder="Subject"
            mt="md"
            name="subject"
            variant="filled"
            {...form.getInputProps("subject")}
          />
          <Textarea
            mt="md"
            label="Message"
            placeholder="Your message"
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            variant="filled"
            {...form.getInputProps("message")}
          />

          <Group justify="center" mt="xl">
            <Button type="submit" size="md">
              Send message
            </Button>
          </Group>
          {formState === FormState.Error && (
            <Alert title={__("form-submitted-error-title")} type="error">
              {__("form-submitted-error-body")}
            </Alert>
          )}
          {formState === FormState.Submitting && (
            <Loader color="blue" size="sm" />
          )}
        </Fieldset>
      </form>
    </>
  );
}

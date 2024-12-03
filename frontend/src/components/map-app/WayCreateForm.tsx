import { useState } from "react";
import { Route } from "ibre";
import { Button, Text, TextInput, Group, Stepper, Modal } from "@mantine/core";

import config from "@/config";
import { useLocalize, useUser } from "@/hooks";

type Props = {
  // The route to be rated;
  route: Route;
  // Called when the new way has been added.
  onCreated: (wayId: number) => void;
  // Called when the new way is discarded.
  onDiscard: () => void;
};

enum Steps {
  Title,
  Submit,
}

/**
 * Form for way adding.
 */
export default function WayCreateForm({ route, onCreated, onDiscard }: Props) {
  const __ = useLocalize();
  const user = useUser();
  const [title, setTitle] = useState("");

  const [step, setStep] = useState(Steps.Title);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const onSubmit = () => {
    (async () => {
      /* if (!route || !appState.user) {
       *   return;
       * } */
      const body = {
        title,
        segments: [] as { id: string; start: number; stop: number }[],
      };
      for (const segment of route.get_segments()) {
        body.segments.push({
          id: segment.get_segment().get_id(),
          start: segment.get_start(),
          stop: segment.get_stop(),
        });
      }
      const token = (await user.getAccessToken()) || "";
      const response = await fetch(`${config.apiURL}/ways`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const json = await response.json();
        onCreated(json.id);
      }
    })();
  };

  return (
    <>
      <Modal
        opened
        onClose={() => setDiscardModalOpen(true)}
        withCloseButton={false}
        size="100%"
      >
        <Stepper
          active={step}
          onStepClick={setStep}
          allowNextStepsSelect={false}
          size="sm"
          pt="md"
          pb="xl"
        >
          <Stepper.Step label={__("title")}>
            <Text my="xl">{__("way-create-form-intro")}</Text>
            <TextInput
              label={__("title")}
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <Text my="xl">{__("way-create-form-about-to-submit")}</Text>
          </Stepper.Completed>
        </Stepper>

        <Group mt="xl" justify="space-between">
          <Button color="red" onClick={() => setDiscardModalOpen(true)}>
            {__("discard")}
          </Button>
          <Group>
            {[Steps.Submit].includes(step) && (
              <Button
                variant="default"
                onClick={() => setStep((step) => step - 1)}
              >
                {__("previous")}
              </Button>
            )}
            {[Steps.Title].includes(step) && (
              <Button onClick={() => setStep((step) => step + 1)}>
                {__("next")}
              </Button>
            )}
            {step === Steps.Submit && (
              <Button onClick={onSubmit} color="green">
                {__("submit")}
              </Button>
            )}
          </Group>
        </Group>
      </Modal>
      <Modal
        size="auto"
        opened={discardModalOpen}
        onClose={() => setDiscardModalOpen(false)}
        centered
      >
        <Text>{__("way-create-form-discard-way-confirm")}</Text>
        <Group mt="xl" justify="space-between">
          <Button onClick={() => setDiscardModalOpen(false)}>{__("no")}</Button>
          <Button
            color="red"
            onClick={() => {
              setDiscardModalOpen(false);
              onDiscard();
            }}
          >
            {__("yes")}
          </Button>
        </Group>
      </Modal>
    </>
  );
}

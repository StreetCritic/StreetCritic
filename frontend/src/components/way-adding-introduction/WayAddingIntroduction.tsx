import { useState } from "react";
import { Button, Text, Group, Stepper, Modal } from "@mantine/core";

type Props = {};

enum Steps {
  Hello,
  Final,
}

export default function WayAddingIntroduction({}: Props) {
  const [modalOpen, setModalOpen] = useState(true);
  const [step, setStep] = useState(Steps.Hello);
  if (!modalOpen) {
    return null;
  }
  return (
    <>
      <Modal
        opened
        title="Add a new way"
        onClose={() => {
          setModalOpen(false);
        }}
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
          <Stepper.Step label="" description=""></Stepper.Step>
          <Stepper.Completed>
            <Text my="xl"></Text>
          </Stepper.Completed>
        </Stepper>

        <Group mt="xl" justify="space-between">
          <Button
            color="red"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Abort
          </Button>
          <Group>
            {[Steps.Final].includes(step) && (
              <Button
                variant="default"
                onClick={() => setStep((step) => step - 1)}
              >
                Previous
              </Button>
            )}
            {[Steps.Hello].includes(step) && (
              <Button onClick={() => setStep((step) => step + 1)}>Next</Button>
            )}
            {step === Steps.Final && (
              <Button
                onClick={() => {
                  setModalOpen(false);
                }}
                color="green"
              >
                Let's go
              </Button>
            )}
          </Group>
        </Group>
      </Modal>
    </>
  );
}

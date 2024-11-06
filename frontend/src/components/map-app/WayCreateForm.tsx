import { useState } from "react";
import { Route } from "ibre";
import {
  Button,
  Chip,
  Paper,
  Text,
  TextInput,
  Group,
  CloseButton,
  Stack,
  Stepper,
  Modal,
} from "@mantine/core";
import { P } from "@/components/typography";

import config from "@/config";

import { useAuth } from "react-oidc-context";

type Props = {
  // The route to be rated;
  route: Route;
  // Called when the form is closed.
  onClose: () => void;
  // Called when the form is submitted.
  /* onSubmit: () => void; */
  // Called when the rating changes.
  /* onRatingChange: (rating: number) => void; */
  // The current rating.
  /* rating: number; */
  // The current tag list.
  /* tags: string[]; */
  // Called when the tag list changes.
  /* onTagsChange: (tags: string[]) => void; */
  // The current comment.
  /* comment: string; */
  // Called when the comment changes.
  /* onCommentChange: (comment: string) => void; */
};

enum Steps {
  Title,
  Submit,
}

export default function RatingForm({
  route,
  onClose,
  /* rating, */
  /* onRatingChange, */
  /* tags, */
  /* onTagsChange, */
  /* comment, */
  /* onCommentChange, */
  /* onSubmit, */
}: Props) {
  const [title, setTitle] = useState("");

  const [step, setStep] = useState(Steps.Title);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const auth = useAuth();

  const onSubmit = () => {
    (async () => {
      /* if (!route || !auth?.user) {
       *   return;
       * } */
      const body = {
        title,
        segments: [] as any,
      };
      for (const segment of route.get_segments()) {
        body.segments.push({
          id: segment.get_segment().get_id(),
          start: segment.get_start(),
          stop: segment.get_stop(),
        });
      }
      const token = auth.user?.access_token;
      const response = await fetch(`${config.apiURL}/ways`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        console.log("success");
        onClose();
      }
    })();
  };

  return (
    <>
      {/* <Paper withBorder p="xl" radius="md" shadow="md" w="100%" maw="95%"> */}
      <Modal
        opened
        title="Submit a rating for your route"
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
          <Stepper.Step label="Add title" description="Add a title for the way">
            <Text my="xl">
              Give a title for the route, e.g. 'Southern Main Street to Market
              Place'. Use the local designation and language.
            </Text>
            <TextInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <Text my="xl">
              You can now submit your new way. Feel free to go back to a
              previous step before finally submitting your way.
            </Text>
          </Stepper.Completed>
        </Stepper>

        <Group mt="xl" justify="space-between">
          <Button color="red" onClick={() => setDiscardModalOpen(true)}>
            Discard
          </Button>
          <Group>
            {[Steps.Submit].includes(step) && (
              <Button
                variant="default"
                onClick={() => setStep((step) => step - 1)}
              >
                Previous
              </Button>
            )}
            {[Steps.Title].includes(step) && (
              <Button onClick={() => setStep((step) => step + 1)}>Next</Button>
            )}
            {step === Steps.Submit && (
              <Button onClick={onSubmit} color="green">
                Submit
              </Button>
            )}
          </Group>
        </Group>
      </Modal>
      <Modal
        size="auto"
        title="Discard rating"
        opened={discardModalOpen}
        onClose={() => setDiscardModalOpen(false)}
        centered
      >
        <Text>Are you sure to discard your new way?</Text>
        <Group mt="xl" justify="space-between">
          <Button onClick={() => setDiscardModalOpen(false)}>No</Button>
          <Button
            color="red"
            onClick={() => {
              setDiscardModalOpen(false);
              onClose();
            }}
          >
            Yes
          </Button>
        </Group>
      </Modal>
    </>
  );
}

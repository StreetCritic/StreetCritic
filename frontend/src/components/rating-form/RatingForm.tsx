import { useState } from "react";
import {
  Button,
  Chip,
  Text,
  Textarea,
  Group,
  Stepper,
  Modal,
} from "@mantine/core";

import RatingSlider from "./RatingSlider";
import config from "@/config";

import { useAuth } from "react-oidc-context";

type Props = {
  // The way to be rated.
  way_id: number;
  // Called when the form is closed.
  onClose: () => void;
};

enum Steps {
  Rating,
  Tags,
  Comment,
  Submit,
}

export default function RatingForm({ way_id, onClose }: Props) {
  const [rating, setRating] = useState(50);
  const [tags, setTags] = useState([] as string[]);
  const [comment, setComment] = useState("");

  const [step, setStep] = useState(Steps.Rating);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const auth = useAuth();

  const onSubmit = () => {
    (async () => {
      /* if (!way_id || !auth?.user) {
       *   return;
       * } */
      const body = {
        way_id,
        rating: Math.round(rating / 10),
        tags,
        comment,
      };
      const token = auth.user?.access_token;
      const response = await fetch(`${config.apiURL}/ratings`, {
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
          <Stepper.Step label="Rate" description="Rate the route">
            <Text my="xl">
              Give a rating between 0 and 10, where 0 is the worst and 10 the
              best route you can think of.
            </Text>
            <RatingSlider value={rating} onChange={setRating} />
          </Stepper.Step>
          <Stepper.Step
            label="Set Tags"
            description="Add tags that describe the route."
          >
            <Text my="xl">What is positive to say about the route?</Text>
            <Chip.Group multiple value={tags} onChange={setTags}>
              <Text fw="700">Comfort</Text>
              <Group mt="md">
                <Chip color="green" value="roomy">
                  Roomy
                </Chip>
                <Chip color="green" value="paved">
                  Well paved
                </Chip>
                <Chip color="green" value="little_traffic">
                  Little traffic
                </Chip>
                <Chip color="green" value="few_stops">
                  Few stops
                </Chip>
              </Group>
            </Chip.Group>
            <Text fw="700" mt="xl">
              Beauty
            </Text>
            <Chip.Group multiple value={tags} onChange={setTags}>
              <Group mt="md">
                <Chip color="green" value="green">
                  Green
                </Chip>
                <Chip color="green" value="nice_surroundings">
                  Nice surroundings
                </Chip>
                <Chip color="green" value="quiet">
                  Quiet
                </Chip>
                <Chip color="green" value="clean">
                  Clean
                </Chip>
              </Group>
            </Chip.Group>
            <Text fw="700" mt="xl">
              Safety
            </Text>
            <Chip.Group multiple value={tags} onChange={setTags}>
              <Group mt="md">
                <Chip color="green" value="little_motorized_traffic">
                  Little motorized traffic
                </Chip>
                <Chip color="green" value="good_infrastructure">
                  Good infrastructure
                </Chip>
              </Group>
            </Chip.Group>
            <Text size="sm" mt="xl">
              Anything missing? Write more details in the next step!
            </Text>
          </Stepper.Step>
          <Stepper.Step
            label="Add comment"
            description="Write more details in a text comment"
          >
            <Text my="xl">
              If you want, you can give some more details about your review.
            </Text>
            <Textarea
              label="Reason (optional)"
              value={comment}
              autosize={true}
              minRows={5}
              maxRows={5}
              onChange={(e) => setComment(e.currentTarget.value)}
              placeholder="Why did you rate the route like this? What's good about it, what's bad?"
            />
          </Stepper.Step>
          <Stepper.Completed>
            <Text my="xl">
              You can now submit your rating. Feel free to go back to a previous
              step before finally submitting your rating.
            </Text>
          </Stepper.Completed>
        </Stepper>

        <Group mt="xl" justify="space-between">
          <Button color="red" onClick={() => setDiscardModalOpen(true)}>
            Discard
          </Button>
          <Group>
            {[Steps.Tags, Steps.Comment, Steps.Submit].includes(step) && (
              <Button
                variant="default"
                onClick={() => setStep((step) => step - 1)}
              >
                Previous
              </Button>
            )}
            {[Steps.Rating, Steps.Tags, Steps.Comment].includes(step) && (
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
        <Text>Are you sure to discard your rating?</Text>
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

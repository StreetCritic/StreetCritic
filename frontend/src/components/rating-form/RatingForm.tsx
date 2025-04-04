import { useState } from "react";
import { Button, Text, Textarea, Group, Stepper, Modal } from "@mantine/core";

import { H3, P } from "@/components";

import RatingSlider from "./RatingSlider";
import { default as Tag, State as TagState } from "./Tag";
import { useLocalize, useUser } from "@/hooks";
import { showNotification } from "@/notifications";
import { submitRating } from "@/features/ratings/submit";
import { Ratings } from "@/features/ratings";
import { useSelector } from "react-redux";
import { selectMapState } from "@/features/map/mapSlice";

type Props = {
  /** If the rating is for an existing way, this is the way's id. */
  wayId?: number;
  /** Called when the form is closed or the rating submitted. */
  onClose: () => void;
  /** Called when the user requests a submit */
  /* onSubmit: (props: Omit<Parameters<typeof submitRating>[0], "wayId">) => void; */
};

enum Steps {
  GeneralRating,
  CategoryRating,
  Tags,
  Comment,
  Submit,
}

export default function RatingForm({ wayId, onClose }: Props) {
  const user = useUser();
  const mapState = useSelector(selectMapState);
  const __ = useLocalize();
  const [rating, setRating] = useState<Ratings>({
    general: 50,
    safety: 50,
    comfort: 50,
    beauty: 50,
  });
  const [tags, setTags] = useState(
    Object.fromEntries(
      [
        "roomy",
        "paved",
        "little_traffic",
        "few_stops",
        "green",
        "nice_surroundings",
        "quiet",
        "clean",
        "little_motorized_traffic",
        "infastructure",
      ].map((x) => [x, TagState.Neutral]),
    ),
  );

  const tag = (name: string) => (
    <Tag
      state={tags[name]}
      onStateChange={(newState) => {
        setTags((oldState) => ({ ...oldState, [name]: newState }));
      }}
    >
      {__(`way-rating-tag-${name}`)}
    </Tag>
  );

  const [comment, setComment] = useState("");
  const [step, setStep] = useState(Steps.GeneralRating);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const toTagString = ([tag, state]: [string, TagState]) => {
    if (state === TagState.Positive) {
      return tag;
    }
    if (state === TagState.Negative) {
      return `-${tag}`;
    }
    return [];
  };

  const updateRating = (key: string) => (v: number) =>
    setRating((oldState: Ratings) => ({ ...oldState, [key]: v }));

  const onSubmit = async () => {
    const token = (await user.getAccessToken()) || "";
    const segments = mapState.routeSegments || undefined;

    try {
      await submitRating(
        { comment, tags: Object.entries(tags).flatMap(toTagString), rating },
        { wayId: wayId, token, segments },
      );
      onClose();
      showNotification({
        title: __("way-rating-success-title"),
        message: __("way-rating-success-body"),
        type: "success",
      });
    } catch (e) {
      console.log(e);
      showNotification({
        title: __("generic-error-title"),
        message: __("generic-error-body"),
        type: "error",
      });
    }
  };

  return (
    <>
      <Modal
        opened
        onClose={() => setDiscardModalOpen(true)}
        withCloseButton={false}
        size="50rem"
      >
        <Stepper
          active={step}
          onStepClick={setStep}
          allowNextStepsSelect={false}
          size="sm"
          pt="md"
          pb="xl"
          contentPadding="xl"
        >
          <Stepper.Step label="Overall Rating">
            <P>
              Please rate the way on a scale from 0 to 10, where 0 represents
              the worst possible bicycle way and 10 represents the best bicycle
              way you can imagine.
            </P>
            <RatingSlider
              value={rating.general}
              onChange={updateRating("general")}
            />
          </Stepper.Step>

          <Stepper.Step label="Category Rating">
            <P>
              Please rate the way on a scale from 0 to 10, where 0 represents
              the most dangerous / least comfortable / ugliest way and 10
              represents the safest / most comfortable / most beautiful way you
              can imagine.
            </P>
            <H3>Safety</H3>
            <RatingSlider
              value={rating.safety}
              onChange={updateRating("safety")}
            />
            <H3>Comfort</H3>
            <RatingSlider
              value={rating.comfort}
              onChange={updateRating("comfort")}
            />
            <H3>Beauty</H3>
            <RatingSlider
              value={rating.beauty}
              onChange={updateRating("beauty")}
            />
          </Stepper.Step>

          <Stepper.Step label="Tags">
            <Text my="xl">
              What is <strong>notably</strong> good, what is{" "}
              <strong>notably</strong> bad about the way?
            </Text>
            <Text fw="700">Comfort</Text>
            <Group mt="md">
              {tag("roomy")}
              {tag("paved")}
              {tag("little_traffic")}
              {tag("few_stops")}
            </Group>
            <Text fw="700" mt="xl">
              Beauty
            </Text>
            <Group mt="md">
              {tag("green")}
              {tag("nice_surroundings")}
              {tag("quiet")}
              {tag("clean")}
            </Group>
            <Text fw="700" mt="xl">
              Safety
            </Text>
            <Group mt="md">
              {tag("little_motorized_traffic")}
              {tag("good_infrastructure")}
            </Group>
          </Stepper.Step>

          <Stepper.Step label="Comment">
            <P>
              <strong>Please share more about why you gave this rating.</strong>
              <br />
              What stood out to you? What was safe or dangerous, comfortable or
              uncomfortable, beautiful or ugly to you?
            </P>

            <Textarea
              label="Comment (optional)"
              value={comment}
              autosize={true}
              minRows={5}
              maxRows={5}
              onChange={(e) => setComment(e.currentTarget.value)}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <P>
              You can now submit your rating for this bicycle way. Feel free to
              go back to a previous step before finally submitting your rating.
            </P>
          </Stepper.Completed>
        </Stepper>

        <Group mt="xl" justify="space-between">
          <Button color="red" onClick={() => setDiscardModalOpen(true)}>
            Discard
          </Button>
          <Group>
            {[
              Steps.CategoryRating,
              Steps.Tags,
              Steps.Comment,
              Steps.Submit,
            ].includes(step) && (
              <Button
                variant="default"
                onClick={() => setStep((step) => step - 1)}
              >
                Previous
              </Button>
            )}
            {[
              Steps.GeneralRating,
              Steps.CategoryRating,
              Steps.Tags,
              Steps.Comment,
            ].includes(step) && (
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

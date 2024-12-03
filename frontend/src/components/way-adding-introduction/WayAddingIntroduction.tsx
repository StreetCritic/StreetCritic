import { Text } from "@/components";
import { Button, Group, Modal } from "@mantine/core";

type Props = {
  onAbort: () => void;
  onFinish: () => void;
};

export default function WayAddingIntroduction({ onAbort, onFinish }: Props) {
  return (
    <>
      <Modal
        opened
        onClose={() => onAbort()}
        withCloseButton={false}
        size="50em"
      >
        <Text>
          In the following steps, you may add a new bicycle way to StreetCritic
          that can be rated by you or other users.
        </Text>
        <Text>
          <strong>
            Ways are continuuos sections on the street network that should be
            mostly similar in properties (safety, comfort, beauty) along the
            way.
          </strong>
        </Text>
        <Text>
          Do you think there's a very nice or very awful way missing? If so,
          those should be added first before considering ways that are more
          average.
        </Text>
        <Text>
          A way <strong>should not be too long,</strong> e.g. don't add a way
          that consists of different sections that people would rate
          differently, e.g. a way along a street where the first half consists
          of a well build bicycle track, and the other half having none at all.
          On the other hand, a way may be long and may consists of differently
          named streets if the properties are similar.
        </Text>
        <Text>
          Different ways <strong>may overlap</strong>. But don't add a new way
          when a really similar way already exists.
        </Text>
        <Text>
          If you want to rate a rather short section of a street that is in very
          bad shape, it's fine to add a way for that.
        </Text>
        <Text>
          Still unsure? No problem,{" "}
          <a href="/contact" target="_blank">
            contact us
          </a>{" "}
          or just add the way in your opinion. We are also still figuring out
          what's the best way to do things.
        </Text>

        <Group mt="xl" justify="space-between">
          <Button color="red" onClick={() => onAbort()}>
            Abort
          </Button>
          <Button onClick={() => onFinish()} color="green">
            Let's go
          </Button>
        </Group>
      </Modal>
    </>
  );
}

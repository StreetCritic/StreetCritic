import { CloseButton, Group, Container, Paper, Overlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function InConstructionModal() {
  const [opened, { close }] = useDisclosure(true);
  return (
    <>
      {opened && (
        <Overlay color="#000" backgroundOpacity={0.85}>
          <Container>
            <Paper withBorder p="xl" mt="xl" radius="md" shadow="md">
              <Group justify="space-between" mb="xs" wrap="nowrap" align="top">
                <p>
                  StreetCritic is not usable yet.{" "}
                  <a
                    rel="me"
                    href="https://en.osm.town/@streetcritic"
                    target="_blank"
                  >
                    Follow our progress on Mastodon
                  </a>
                  .
                </p>
                <CloseButton aria-label="Close modal" onClick={close} />
              </Group>
            </Paper>
          </Container>
        </Overlay>
      )}
    </>
  );
}

import { useMemo } from "react";
import { useLocalize } from "@/hooks";
import { Accordion, Title, Text, Alert } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { closedWayAdding } from "@/features/map/appSlice";
import { Box, Button, Flex } from "@mantine/core";
import { Info } from "@phosphor-icons/react";
import WayPoints from "../routing-sidebar/WayPoints";
import { selectMapState } from "@/features/map/mapSlice";

type Props = {
  onAddClick: () => void;
};

export default function WayAddingSidebar({ onAddClick }: Props) {
  const __ = useLocalize();
  const dispatch = useDispatch();
  const mapState = useSelector(selectMapState);

  const infoItems = useMemo(() => {
    return [
      {
        value: "What is a way?",
        icon: <Info size={32} />,
        content: (
          <Text>
            Ways are continuuos sections on the street network that should be
            mostly similar in properties (safety, comfort, beauty) along the
            way.
          </Text>
        ),
      },
      {
        value: "Which way to add?",
        icon: <Info size={32} />,
        content: (
          <>
            <Text>
              Do you think there's a very nice or very awful way missing? If so,
              those should be added first before considering ways that are more
              average.
            </Text>
            <Text>
              A way <strong>should not be too long,</strong> e.g. don't add a
              way that consists of different sections that people would rate
              differently, e.g. a way along a street where the first half
              consists of a well build bicycle track, and the other half having
              none at all. On the other hand, a way may be long and may consists
              of differently named streets if the properties are similar.
            </Text>
            <Text>
              Different ways <strong>may overlap</strong>. But don't add a new
              way when a really similar way already exists.
            </Text>
            <Text>
              If you want to rate a rather short section of a street that is in
              very bad shape, it's fine to add a way for that.
            </Text>
            <Text>
              Still unsure? No problem,{" "}
              <a href="/contact" target="_blank">
                contact us
              </a>{" "}
              or just add the way in your opinion. We are also still figuring
              out what's the best way to do things.
            </Text>
          </>
        ),
      },
    ];
  }, []);

  return (
    <div>
      <Title order={2}>{__("add-way-title")}</Title>
      <Text>
        In the following steps, you may add a new bicycle way to StreetCritic
        that can be rated by you or other users.
      </Text>
      <Text>{__("add-way-intro")}</Text>
      <Alert type="under-construction">{__("add-way-info")}</Alert>
      <Box my="xl">
        <WayPoints />
      </Box>
      <Flex gap="md" align="center" justify="space-between">
        {mapState.routeSegments && (
          <Button onClick={() => onAddClick()}>{__("continue")}</Button>
        )}
        <Button color="red" onClick={() => dispatch(closedWayAdding())}>
          {__("abort")}
        </Button>
      </Flex>
      <Box mt="xl">
        <Accordion items={infoItems} />
      </Box>
    </div>
  );
}

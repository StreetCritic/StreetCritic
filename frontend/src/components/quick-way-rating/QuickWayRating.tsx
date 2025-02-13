import { RatingForm, SideBox, Text } from "@/components";
import { closedQuickWayRating } from "@/features/map/appSlice";
import { selectMapState } from "@/features/map/mapSlice";
import { useLocalize } from "@/hooks";
import { Box, Button, Flex } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

enum State {
  Start,
  Rating,
}

export default function QuickWayRating() {
  const [state, setState] = useState<State>(State.Start);
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();
  const __ = useLocalize();
  return (
    <>
      {state === State.Start && (
        <SideBox onClose={() => dispatch(closedQuickWayRating())}>
          <Box p="sm">
            <Text>
              {" "}
              Move the start, stop, and any intermediate points to mark the
              route you want to rate.
            </Text>
            <Flex gap="md" align="center" justify="space-between">
              {mapState.routeSegments && (
                <Button onClick={() => setState(State.Rating)}>
                  {__("continue")}
                </Button>
              )}
              <Button
                color="red"
                onClick={() => dispatch(closedQuickWayRating())}
              >
                {__("cancel")}
              </Button>
            </Flex>
          </Box>
        </SideBox>
      )}
      {state === State.Rating && (
        <RatingForm onClose={() => dispatch(closedQuickWayRating())} />
      )}
    </>
  );
}

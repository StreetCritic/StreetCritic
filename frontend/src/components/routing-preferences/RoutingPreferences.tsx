import {
  selectDirectionsState,
  toggledUseShortest,
} from "@/features/map/directionsSlice";
import { useLocalize } from "@/hooks";
import { Chip } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";

import WayPreferences from "../way-preferences/WayPreferences";

/**
 * Preferences for route calculation.
 */
export default function RoutingPreferences() {
  const __ = useLocalize();
  const directionsState = useSelector(selectDirectionsState);
  const dispatch = useDispatch();

  return (
    <>
      <Chip
        radius="sm"
        mb="md"
        variant="outline"
        checked={directionsState.useShortest}
        onChange={() => dispatch(toggledUseShortest())}
      >
        {__("routing-shortest-route")}
      </Chip>
      <WayPreferences disabled={directionsState.useShortest} />
    </>
  );
}

import { useLocalize } from "@/hooks";
import { Icon } from "@/components";
import { Box, Chip, Group } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
  selectVisibleLayers,
  setLayerVisibility,
} from "@/features/map/mapSlice";

/**
 * Allows to enable/disable map layers.
 */
export default function LayerSelection() {
  const __ = useLocalize();
  const visibleLayers = useSelector(selectVisibleLayers);
  const dispatch = useDispatch();
  return (
    <Box p="sm">
      <Chip
        checked={visibleLayers.terrain}
        variant="filled"
        color="rgba(99, 71, 8)"
        radius="sm"
        onChange={() =>
          dispatch(
            setLayerVisibility({
              layer: "terrain",
              visible: !visibleLayers.terrain,
            }),
          )
        }
      >
        <Group align="baseline">
          <span>Terrain</span>
          <Icon
            id="mountains"
            color={visibleLayers.terrain ? "white" : "rgba(99, 71, 8)"}
            size={26}
          />
        </Group>
      </Chip>
    </Box>
  );
}

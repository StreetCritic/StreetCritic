import { Group, Slider, Stack } from "@mantine/core";
import { Text } from "@/components";

import {
  selectMapState,
  streetPreferenceChanged,
  StreetPreferences,
} from "@/features/map/mapSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocalize } from "@/hooks";

const preferences: { [key in keyof StreetPreferences]: { label: string } } = {
  safety: {
    label: "safety",
  },
  comfort: {
    label: "comfort",
  },
  beauty: {
    label: "beauty",
  },
};

type Props = {
  /** Is changing values disabled? */
  disabled?: boolean;
};

/**
 * Sliders to change the way preferences.
 */
export default function WayPreferences({ disabled }: Props) {
  const __ = useLocalize();
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();

  return (
    <>
      <Text msgId="way-preferences-title" />
      <Stack>
        {Object.entries(preferences).map(([id, preference]) => (
          <Group key={id} justify="space-between">
            <Text msgId={preference.label} />
            <Slider
              disabled={disabled}
              w="75%"
              restrictToMarks
              value={mapState.streetPreferences[id as keyof StreetPreferences]}
              onChange={(value) =>
                dispatch(
                  streetPreferenceChanged({
                    id: id as keyof StreetPreferences,
                    value,
                  }),
                )
              }
              marks={Array.from({ length: 5 }).map((_, index) => ({
                value: index * 25,
              }))}
            />
          </Group>
        ))}
      </Stack>
    </>
  );
}

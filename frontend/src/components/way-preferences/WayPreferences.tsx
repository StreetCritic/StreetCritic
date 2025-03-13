import { Group, Slider, Stack, Text } from "@mantine/core";

import {
  selectMapState,
  streetPreferenceChanged,
  StreetPreferences,
} from "@/features/map/mapSlice";
import { useDispatch, useSelector } from "react-redux";

const preferences: { [key in keyof StreetPreferences]: { label: string } } = {
  safety: {
    label: "Safety",
  },
  comfort: {
    label: "Comfort",
  },
  beauty: {
    label: "Beauty",
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
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();

  return (
    <>
      <Text>Preferences:</Text>
      <Stack>
        {Object.entries(preferences).map(([id, preference]) => (
          <Group key={id} justify="space-between">
            <Text>{preference.label}</Text>
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

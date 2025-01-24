import { MantineStyleProps, Text } from "@mantine/core";

interface Props extends MantineStyleProps {
  lng: number;
  lat: number;
}

/**
 * Renders coordinates.
 */
export default function Coordinates({ lng, lat, ...props }: Props) {
  const format = (v: number) => {
    return Math.round(v * Math.pow(10, 6)) / Math.pow(10, 6);
  };
  return (
    <Text size="xs" c="gray" {...props}>
      {format(lat)}N, {format(lng)}E
    </Text>
  );
}

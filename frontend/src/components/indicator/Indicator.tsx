import { Box, Group, MantineStyleProps, Rating, Text } from "@mantine/core";

interface Props extends MantineStyleProps {
  label: string;
  value: number;
}

/**
 * Renders indicator percents and label.
 */
export default function Indicator({ label, value, ...props }: Props) {
  return (
    <Box {...props}>
      <Group>
        <Text>{label}</Text>
        <Rating count={5} fractions={4} value={5 * value} readOnly />
        <Text size="xs" c="gray">
          {Math.round(value * 100)}%
        </Text>
      </Group>
    </Box>
  );
}

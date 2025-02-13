import {
  Box,
  Group,
  MantineStyleProps,
  Rating,
  Text,
  Tooltip,
} from "@mantine/core";

interface Props extends MantineStyleProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

/**
 * Renders indicator percents and label.
 */
export default function Indicator({ icon, label, value, ...props }: Props) {
  return (
    <Box {...props}>
      <Group gap={7}>
        <Tooltip label={label}>{icon}</Tooltip>
        <Text size="xs" c="gray">
          {(Math.round(value * 100) / 10).toFixed(1)}
        </Text>
        <Rating count={5} fractions={4} value={5 * value} readOnly />
      </Group>
    </Box>
  );
}

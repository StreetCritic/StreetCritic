import { Text } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export default function P({ children }: Props) {
  return <Text mb="xl">{children}</Text>;
}

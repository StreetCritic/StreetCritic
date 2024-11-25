import { Text as MText } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export default function Text({ children }: Props) {
  return <MText mb="md">{children}</MText>;
}

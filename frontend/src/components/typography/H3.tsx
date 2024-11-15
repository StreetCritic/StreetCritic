import { Title } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export default function H3({ children }: Props) {
  return (
    <Title order={3} mb="md">
      {children}
    </Title>
  );
}

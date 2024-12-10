import { Title } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export default function H1({ children }: Props) {
  return (
    <Title order={1} mb="md" c="gray.9" ta="center">
      {children}
    </Title>
  );
}

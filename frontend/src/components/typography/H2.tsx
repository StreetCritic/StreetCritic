import { Title } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export default function H2({ children }: Props) {
  return (
    <Title order={2} mb="md" c="gray.9">
      {children}
    </Title>
  );
}

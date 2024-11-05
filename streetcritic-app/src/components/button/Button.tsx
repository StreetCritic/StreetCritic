import { Button as MantineButton, rem } from "@mantine/core";

type Props = {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
};

export default function Button({ onClick, label, icon }: Props) {
  return (
    <MantineButton
      variant="filled"
      size="md"
      leftSection={icon}
      radius="lg"
      /* styles={{
       *   root: { paddingRight: rem(14), height: rem(48) },
       *   section: { marginLeft: rem(22) },
       * }} */
      onClick={onClick}
    >
      {label}
    </MantineButton>
  );
}

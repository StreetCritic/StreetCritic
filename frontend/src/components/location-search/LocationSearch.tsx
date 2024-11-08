import { TextInput, Flex } from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function LocationSearch() {
  const icon = <MagnifyingGlass size={28} weight="bold" />;
  return (
    <TextInput
      rightSectionPointerEvents="none"
      rightSection={icon}
      placeholder="Search..."
    />
  );
}

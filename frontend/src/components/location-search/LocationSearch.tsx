import { TextInput, Flex } from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";
import styles from "./LocationSearch.module.css";

export default function LocationSearch() {
  const icon = <MagnifyingGlass size={28} weight="bold" />;
  return (
    <div className={styles.root}>
      <TextInput
        rightSectionPointerEvents="none"
        rightSection={icon}
        placeholder="Search..."
      />
    </div>
  );
}

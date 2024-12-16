import { queriedLocation } from "@/features/map/mapSlice";
import { Box, TextInput } from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./LocationSearch.module.css";

export default function LocationSearch() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const icon = (
    <button type="submit">
      <MagnifyingGlass size={28} weight="bold" />
    </button>
  );
  return (
    <Box className={styles.root}>
      <form
        onSubmit={(e) => {
          dispatch(queriedLocation(query));
          setQuery("");
          e.preventDefault();
        }}
      >
        <TextInput
          w={query.length > 0 ? 300 : 120}
          rightSectionPointerEvents="all"
          rightSection={icon}
          placeholder="Search..."
          onChange={(e) => setQuery(e.currentTarget.value)}
          value={query}
        />
      </form>
    </Box>
  );
}

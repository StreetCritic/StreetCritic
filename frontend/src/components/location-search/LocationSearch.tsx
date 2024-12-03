import { queriedLocation } from "@/features/map/mapSlice";
import { TextInput } from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./LocationSearch.module.css";

export default function LocationSearch() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const icon = <MagnifyingGlass size={28} weight="bold" />;
  return (
    <div className={styles.root}>
      <form
        onSubmit={(e) => {
          dispatch(queriedLocation(query));
          setQuery("");
          e.preventDefault();
        }}
      >
        <TextInput
          rightSectionPointerEvents="none"
          rightSection={icon}
          placeholder="Search..."
          onChange={(e) => setQuery(e.currentTarget.value)}
          value={query}
        />
      </form>
    </div>
  );
}

import { useLocalize, useLocationSearch } from "@/hooks";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./LocationSearch.module.css";

import { Box, Combobox, Loader, TextInput, useCombobox } from "@mantine/core";
import { selectedLocation } from "@/features/map/locationSlice";

type Props = {
  placeholder?: string;
  label?: string;
  setLocation?: ({
    lng,
    lat,
    label,
  }: {
    lng: number;
    lat: number;
    label: string;
  }) => void;
};

export default function LocationSearch({
  placeholder,
  label,
  setLocation,
}: Props) {
  const [query, setQuery] = useState("");
  const [locations, loading] = useLocationSearch({ query });
  const dispatch = useDispatch();
  const __ = useLocalize();
  const icon = (
    <button type="submit">
      <MagnifyingGlass size={28} weight="bold" />
    </button>
  );

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = locations?.map((item) => (
    <Combobox.Option
      value={String(item.properties.osm_id)}
      key={item.properties.osm_id}
    >
      {item.properties.label}
    </Combobox.Option>
  ));

  return (
    <Box className={styles.root}>
      <Combobox
        onOptionSubmit={(optionValue) => {
          const entry = locations?.find(
            (i) => String(i.properties.osm_id) === optionValue,
          );
          if (entry !== undefined) {
            if (setLocation) {
              setLocation({
                lng: entry.geometry.coordinates[0],
                lat: entry.geometry.coordinates[1],
                label: entry.properties.label,
              });
            } else {
              dispatch(
                selectedLocation({
                  location: {
                    center: {
                      lng: entry.geometry.coordinates[0],
                      lat: entry.geometry.coordinates[1],
                    },
                    label: entry.properties.label,
                  },
                }),
              );
            }
            setQuery("");
            combobox.closeDropdown();
          }
        }}
        withinPortal={false}
        store={combobox}
      >
        <Combobox.Target>
          <TextInput
            placeholder={placeholder || __("search-label")}
            label={label}
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            onBlur={() => {
              setQuery("");
              combobox.closeDropdown();
            }}
            rightSectionPointerEvents="all"
            rightSection={(loading && <Loader size={18} />) || icon}
          />
        </Combobox.Target>

        <Combobox.Dropdown hidden={locations === null}>
          <Combobox.Options>
            {options}
            {locations?.length === 0 && (
              <Combobox.Empty>No results found</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
}

import { useLocalize, useLocationSearch } from "@/hooks";
import {
  City,
  MagnifyingGlass,
  MapPin,
  Train,
  Tram,
} from "@phosphor-icons/react";
import { Text } from "@mantine/core";
import { useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./LocationSearch.module.css";

import {
  Box,
  Combobox,
  Flex,
  Group,
  Highlight,
  Loader,
  Modal,
  ScrollArea,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { Location, selectedLocation } from "@/features/map/locationSlice";
import RecentLocations from "./RecentLocations";

type Props = {
  /** Placeholder text for the search input. */
  placeholder?: string;
  /** Label text for the search input. */
  label?: string;
  /** Called when user selects a location. */
  setLocation?: (location: Location) => void;
};

/**
 * Returns an icon for the given OSM type, key, and value.
 */
function iconFromOSMKey(_type: string, key: string, value: string) {
  const size = 16;
  if (key === "place") {
    if (["city", "village"].includes(value)) {
      return <City size={size} />;
    }
  } else if (key === "railway" && ["halt", "stop", "station"].includes(value)) {
    return <Train size={size} />;
  } else if (key === "railway" && value === "tram_stop") {
    return <Tram size={size} />;
  }
  return <MapPin size={size} />;
}

/**
 * Location search box.
 */
export default function LocationSearch({
  placeholder,
  label,
  setLocation,
}: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  const __ = useLocalize();
  const icon = <MagnifyingGlass size={28} weight="bold" />;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const _setLocation = (location: Location) => {
    setQuery("");
    combobox.targetRef.current?.blur();
    combobox.closeDropdown();
    setActive(false);
    if (setLocation) {
      setLocation(location);
    }
    dispatch(
      selectedLocation({
        remember: true,
        changeCenter: !setLocation,
        setLocation: !setLocation,
        location,
      }),
    );
  };

  const [locations, loading] = useLocationSearch({
    query,
    update: combobox.targetRef.current === document.activeElement,
  });

  const options = locations?.map((item) => (
    <Combobox.Option
      value={String(item.properties.osm_id)}
      key={[
        item.properties.osm_id,
        item.properties.osm_key,
        item.properties.osm_type,
        item.properties.osm_value,
      ].join("#")}
    >
      <Group wrap="nowrap" align="start" justify="flex-start">
        <Box>
          {iconFromOSMKey(
            item.properties.osm_type,
            item.properties.osm_key,
            item.properties.osm_value,
          )}{" "}
        </Box>
        <Box>
          <Highlight color="lime" highlight={query.split(" ")} size="sm">
            {item.properties.label}
          </Highlight>
        </Box>
      </Group>
    </Combobox.Option>
  ));

  const placeholderText = placeholder || __("search-label");

  return (
    <>
      <Box className={styles.widget}>
        {label && <div className={styles.widgetLabel}>{label}</div>}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActive(true);
          }}
        >
          <div className={styles.widgetPlaceholder}>
            {placeholderText.length > 25
              ? `${placeholderText.slice(0, 25)}…`
              : placeholderText}{" "}
            {icon}
          </div>
        </a>
      </Box>
      <Modal
        opened={active}
        onClose={() => setActive(false)}
        withCloseButton={true}
        size="100%"
        styles={{ content: { overflowY: "visible" } }}
      >
        <Flex h="70vh" direction="column">
          <Combobox
            onOptionSubmit={(optionValue) => {
              const entry = locations?.find(
                (i) => String(i.properties.osm_id) === optionValue,
              );
              if (entry !== undefined) {
                _setLocation({
                  center: {
                    lng: entry.geometry.coordinates[0],
                    lat: entry.geometry.coordinates[1],
                  },
                  label: entry.properties.label,
                });
              }
            }}
            withinPortal={false}
            store={combobox}
          >
            <Combobox.Target>
              <TextInput
                data-autofocus
                value={query}
                placeholder={__("location-search-label")}
                onChange={(event) => {
                  setQuery(event.currentTarget.value);
                  combobox.resetSelectedOption();
                  combobox.openDropdown();
                }}
                onFocus={() => {
                  {
                    /* combobox.openDropdown(); */
                  }
                }}
                /* onBlur={() => {
                 *   combobox.closeDropdown();
                 *   setActive(false);
                 * }} */
                rightSectionPointerEvents="all"
                rightSection={(loading && <Loader size={18} />) || icon}
              />
            </Combobox.Target>

            <Combobox.Dropdown hidden={locations === null}>
              <Combobox.Options mah="60vh" style={{ overflowY: "auto" }}>
                {options}
                {locations?.length === 0 && (
                  <Combobox.Empty>No results found</Combobox.Empty>
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          <Text size="sm" mt="lg" mb="xs" fw={700}>
            {__("location-search-recent-locations")}
          </Text>
          <ScrollArea type="auto" offsetScrollbars>
            <RecentLocations
              onSelect={(location) => {
                _setLocation(location);
              }}
            />
          </ScrollArea>
        </Flex>
      </Modal>
    </>
  );
}

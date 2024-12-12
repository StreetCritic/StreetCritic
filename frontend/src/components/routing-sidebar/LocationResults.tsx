import { Combobox, ComboboxStore } from "@mantine/core";
import { useLocationSearch } from "@/hooks";

type Props = {
  children: React.ReactNode;
  locationResults: ComboboxStore;
  query: string;
  setLocation: ({
    lng,
    lat,
    label,
  }: {
    lng: number;
    lat: number;
    label: string;
  }) => void;
};

export default function LocationResults({
  query,
  children,
  locationResults,
  setLocation,
}: Props) {
  const combobox = locationResults;
  const { locations } = useLocationSearch({ query });

  const options = locations?.map((location) => (
    <Combobox.Option value={location.osm_id} key={location.osm_id}>
      {location.display_name}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      width={250}
      position="bottom-start"
      withArrow
      withinPortal={false}
      onOptionSubmit={(val) => {
        const location = locations!.find((location) => location.osm_id == val);
        setLocation({
          lng: parseFloat(location!.lon),
          lat: parseFloat(location!.lat),
          label: location!.display_name,
        });
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>{children}</Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

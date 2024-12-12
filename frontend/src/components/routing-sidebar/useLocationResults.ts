import { useCombobox } from "@mantine/core";

export default function useLocationResults() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return combobox;
}

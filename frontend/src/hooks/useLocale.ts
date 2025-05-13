import { selectAppState } from "@/features/map/appSlice";
import { useSelector } from "react-redux";

/**
 * Returns the currently set UI locale.
 */
export function useLocale() {
  return useSelector(selectAppState).locale;
}

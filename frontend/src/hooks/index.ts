import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export * from "./useDirections";
export * from "./useLocale";
export * from "./useLocalizedPage";
export * from "./useMapSearchParams";
export * from "./useNavigateMap";
export * from "./useSegmentsRoute";
export * from "./useWay";
export { default as useLocalize } from "./useLocalize";
export { default as useLoginGate } from "./useLoginGate";
export { default as useLocationSearch } from "./useLocationSearch";
export { default as useNavigateMap } from "@/hooks/useNavigateMap";
export { default as useUser } from "./useUser";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

import { useCallback } from "react";
import {
  createSearchParams,
  NavigateOptions,
  useNavigate,
} from "react-router";
import useMapSearchParams from "./useMapSearchParams";

export default function useNavigateMap(): (
  pathname: string,
  options: NavigateOptions | undefined,
) => void {
  const mapSearchParams = useMapSearchParams();
  const navigate = useNavigate();
  return useCallback(
    (pathname: string, options: NavigateOptions | undefined) => {
      navigate(
        {
          pathname,
          search: `?${createSearchParams(mapSearchParams)}`,
        },
        options,
      );
    },
    [mapSearchParams, navigate],
  );
}

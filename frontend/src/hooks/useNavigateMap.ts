import {
  createSearchParams,
  NavigateOptions,
  useNavigate,
} from "react-router-dom";
import useMapSearchParams from "./useMapSearchParams";

export default function useNavigateMap(): (
  pathname: string,
  options: NavigateOptions | undefined,
) => void {
  const mapSearchParams = useMapSearchParams();
  const navigate = useNavigate();
  return (pathname: string, options: NavigateOptions | undefined) => {
    navigate(
      {
        pathname,
        search: `?${createSearchParams(mapSearchParams)}`,
      },
      options,
    );
  };
}

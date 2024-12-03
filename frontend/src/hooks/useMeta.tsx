import { useEffect } from "react";

type Props = {
  // Set the page (sub)title. If empty "", set default page title.
  title?: string;
};

/**
 * Set page meta.
 */
export default function useMeta({ title }: Props) {
  useEffect(() => {
    if (title === "") {
      document.title = "StreetCritic";
    } else {
      document.title = `${title} — StreetCritic`;
    }
  }, [title]);
}

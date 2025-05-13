import { useLocalizedPage } from "@/hooks";

const translations = {
  "en-US": () => import("./Sponsors.en-US"),
  "de-DE": () => import("./Sponsors.de-DE"),
};

export default function Sponsors() {
  return useLocalizedPage(translations);
}

import { useLocalizedPage } from "@/hooks";

const translations = {
  "en-US": () => import("./About.en-US"),
  "de-DE": () => import("./About.de-DE"),
};

export default function About() {
  return useLocalizedPage(translations);
}

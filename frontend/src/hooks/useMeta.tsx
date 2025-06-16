import { useEffect } from "react";
import config from "@/config";

type Props = {
  /** Set the page (sub)title. If empty "", set default page title. */
  title?: string;
  /** The page language. */
  lang?: string;
  /** The canonical path with leading slash. */
  path?: string;
};

/**
 * Set page meta.
 */
export default function useMeta({ title, lang, path }: Props) {
  useEffect(() => {
    if (!title) {
      document.title = "StreetCritic";
    } else {
      document.title = `${title} — StreetCritic`;
    }
  }, [title]);

  useEffect(() => {
    if (lang) {
      document.documentElement.lang = lang;
    } else {
      document.documentElement.lang = "en";
    }
  }, [lang]);

  useEffect(() => {
    console.log(path);
    const link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      throw new Error("Canonical link element is missing");
    }
    if (path) {
      link.setAttribute("href", `${config.baseURL}${path}`);
    } else {
      link.setAttribute("href", "/");
    }
  }, [path]);
}

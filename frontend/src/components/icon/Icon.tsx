import React from "react";
import { Envelope } from "@phosphor-icons/react";
import styles from "./Icon.module.css";
import {
  ArrowLeft,
  Calendar,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  MastodonLogo,
  Mountains,
  Stack,
  User,
} from "@phosphor-icons/react";

const icons = {
  envelope: Envelope,
  github: GithubLogo,
  instagram: InstagramLogo,
  linkedin: LinkedinLogo,
  mastodon: MastodonLogo,
  mountains: Mountains,
  stack: Stack,
  calendar: Calendar,
  user: User,
  "arrow-left": ArrowLeft,
};

export type IconId = keyof typeof icons;

type Props = {
  /** The id of the icon. */
  id: IconId;
  /** Should the icon be rendered inlined? */
  inline?: boolean;
  /** Render size in pixel of the icon, default is 24. */
  size?: number;
  /** Weight of the icon. Default is "regular". */
  weight?: "regular" | "bold" | "fill";
  /** Color of the icon. */
  color?: string;
};

/**
 * An icon.
 */
export default function Icon({ id, color, size, weight }: Props) {
  const icon = React.createElement(icons[id], {
    color: color,
    size: size || 24,
    weight: weight || "regular",
  });
  return <span className={styles.root}>{icon}</span>;
}

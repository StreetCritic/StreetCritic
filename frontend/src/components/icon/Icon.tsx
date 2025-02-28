import React from "react";
import { Envelope } from "@phosphor-icons/react/dist/ssr";
import styles from "./Icon.module.css";
import {
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  MastodonLogo,
} from "@phosphor-icons/react";

const icons = {
  envelope: Envelope,
  github: GithubLogo,
  instagram: InstagramLogo,
  linkedin: LinkedinLogo,
  mastodon: MastodonLogo,
};

export type IconId = keyof typeof icons;

type Props = {
  /** The id of the icon. */
  id: IconId;
  /** Should the icon be rendered inlined? */
  inline?: boolean;
  /** Render size in pixel of the icon, default is 24. */
  size?: number;
};

/**
 * An icon.
 */
export default function Icon({ id, size }: Props) {
  const icon = React.createElement(icons[id], { size: size || 24 });
  return <span className={styles.root}>{icon}</span>;
}

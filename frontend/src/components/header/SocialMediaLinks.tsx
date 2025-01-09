import { Group } from "@mantine/core";
import {
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  MastodonLogo,
  ThreadsLogo,
  XLogo,
} from "@phosphor-icons/react";

import classes from "./SocialMediaLinks.module.css";

type Props = {
  visibleFrom?: string;
};

export default function SocialMediaLinks({ visibleFrom }: Props) {
  return (
    <Group h="100%" gap={10} className={classes.root} visibleFrom={visibleFrom}>
      <a href="https://digitalcourage.social/@streetcritic" target="_blank">
        <MastodonLogo size={24} />
      </a>
      <a href="https://instagram.com/streetcritic" target="_blank">
        <InstagramLogo size={24} />
      </a>
      <a href="https://github.com/streetcritic" target="_blank">
        <GithubLogo size={24} />
      </a>
    </Group>
  );
}

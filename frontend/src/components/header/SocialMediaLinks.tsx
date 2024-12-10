import { Group } from "@mantine/core";
import { GithubLogo, MastodonLogo } from "@phosphor-icons/react";

import classes from "./SocialMediaLinks.module.css";

type Props = {
  visibleFrom?: string;
};

export default function SocialMediaLinks({ visibleFrom }: Props) {
  return (
    <Group h="100%" gap={10} className={classes.root} visibleFrom={visibleFrom}>
      <a href="https://digitalcourage.social/@streetcritic" target="_blank">
        <MastodonLogo size={32} />
      </a>
      <a href="https://github.com/streetcritic" target="_blank">
        <GithubLogo size={32} />
      </a>
    </Group>
  );
}

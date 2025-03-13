import { Group } from "@mantine/core";
import { Icon } from "@/components";

import classes from "./SocialMediaLinks.module.css";
import { IconId } from "../icon";

type Props = {
  visibleFrom?: string;
  withLabels?: boolean;
};

type ChannelInfo = {
  href: string;
  label: string;
  icon: IconId;
};

const channels: ChannelInfo[] = [
  {
    href: "https://digitalcourage.social/@streetcritic",
    label: "Mastodon",
    icon: "mastodon",
  },
  {
    href: "https://instagram.com/streetcritic",
    label: "Instagram",
    icon: "instagram",
  },
  {
    href: "https://github.com/streetcritic",
    label: "GitHub",
    icon: "github",
  },
  {
    href: "https://linkedin.com/company/streetcritic",
    label: "LinkedIn",
    icon: "linkedin",
  },
];

/**
 * Lists of StreetCritic's social media channels.
 */
export default function SocialMediaLinks({ visibleFrom, withLabels }: Props) {
  return (
    <Group h="100%" gap={10} className={classes.root} visibleFrom={visibleFrom}>
      {channels.map((channel) => (
        <a key={channel.label} href={channel.href} target="_blank">
          <Icon id={channel.icon} inline />
          {withLabels && channel.label}
        </a>
      ))}
    </Group>
  );
}

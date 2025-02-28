import { Modal, Box } from "@mantine/core";
import { Icon, SocialMediaLinks, Text } from "@/components";
import { Hammer } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import {
  closedAnnouncementBanner,
  selectAppState,
} from "@/features/map/appSlice";

export default function AnnouncementBanner() {
  const appState = useSelector(selectAppState);
  const dispatch = useDispatch();
  return (
    <>
      <Modal
        opened={appState.announcementBannerVisible}
        onClose={() => dispatch(closedAnnouncementBanner())}
        centered
      >
        <Text size="lg">
          StreetCritic aims to help cyclists and pedestrians discover the{" "}
          <strong>safest</strong>, most <strong>comfortable</strong>, and most{" "}
          <strong>beautiful</strong> routes!
        </Text>

        <Text>
          <Hammer size={24} /> Still some things to do, we are working hard on
          it! To stay updated, follow our channels:
        </Text>

        <Box my="sm">
          <SocialMediaLinks withLabels />
        </Box>

        <Text>
          Or subscribe to our{" "}
          <a
            href="https://lists.streetcritic.org/subscription/form"
            target="_blank"
          >
            <Icon id="envelope" inline /> Newsletter
          </a>
          !
        </Text>
      </Modal>
    </>
  );
}

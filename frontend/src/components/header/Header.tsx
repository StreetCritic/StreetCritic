"use client";
import { Link } from "react-router";
import {
  Box,
  Stack,
  Drawer,
  Divider,
  Burger,
  ScrollArea,
  Loader,
  Group,
  rem,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";

import UserNavigation from "./UserNavigation";
import { useLocale, useLocalize, useUser } from "@/hooks";
import { useSelector } from "react-redux";
import { AuthenticationState, selectAppState } from "@/features/map/appSlice";
import { ActionIcon, LoginButtons, SocialMediaLinks } from "@/components";
import LogoLink from "./LogoLink";

export default function Header() {
  const appState = useSelector(selectAppState);
  const user = useUser();
  const locale = useLocale().slice(0, 2);
  const __ = useLocalize();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const links =
    locale === "en"
      ? {
          about: "/en/about",
          sponsors: "/en/sponsors",
          terms: "/en/terms-of-use",
        }
      : {
          about: "/de/ueber",
          sponsors: "/de/sponsoren",
          terms: "/de/nutzungsbedingungen",
        };

  return (
    <Box>
      <header className={classes.root}>
        <Group wrap="nowrap" justify="space-between" h="100%">
          <Box hiddenFrom="md"></Box>
          <Box visibleFrom="md" w="50%" maw="200px">
            <LogoLink />
          </Box>

          <Group h="100%" gap={0} visibleFrom="md">
            <a href={links.about} className={classes.link}>
              {__("menu-entry-about")}
            </a>
            <a href={links.sponsors} className={classes.link}>
              {__("menu-entry-sponsors")}
            </a>
            <Link to={"/contact"} className={classes.link}>
              {__("menu-entry-contact")}
            </Link>
            <a href={links.terms} className={classes.link}>
              {__("menu-entry-tos")}
            </a>
          </Group>

          <SocialMediaLinks visibleFrom="md" />

          <Group h="100%" wrap="nowrap">
            {appState.authState === AuthenticationState.Error && (
              <p>Authentication error</p>
            )}
            {appState.authState === AuthenticationState.Authenticating && (
              <Loader color="blue" size="md" />
            )}
            {appState.authState === AuthenticationState.Authenticated && (
              <UserNavigation
                userName={appState.user?.name || ""}
                onLogout={() => user.signOut()}
              />
            )}
            {appState.authState === AuthenticationState.Unauthenticated && (
              <Group visibleFrom="md">
                <LoginButtons />
              </Group>
            )}
            <Box hiddenFrom="md">
              <ActionIcon
                label="Menu"
                color="white"
                onClick={toggleDrawer}
                icon={<Burger opened={drawerOpened} />}
              />
            </Box>
          </Group>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        hiddenFrom="md"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Box w="50%" maw="200px" p="md">
            <LogoLink onClick={toggleDrawer} />
          </Box>

          <Divider my="sm" />
          <a href={links.about} className={classes.link}>
            {__("menu-entry-about")}
          </a>
          <a href={links.sponsors} className={classes.link}>
            {__("menu-entry-sponsors")}
          </a>
          <Link to={"contact"} className={classes.link} onClick={toggleDrawer}>
            {__("menu-entry-contact")}
          </Link>
          <a href={links.terms} className={classes.link}>
            {__("menu-entry-tos")}
          </a>
          <Divider my="sm" />

          <Stack align="flex-start" p="md">
            {appState.authState === AuthenticationState.Unauthenticated && (
              <LoginButtons />
            )}
          </Stack>

          <Box p="md">
            <SocialMediaLinks />
          </Box>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

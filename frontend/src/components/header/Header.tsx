"use client";
import { Link } from "react-router-dom";
import {
  Box,
  Stack,
  Drawer,
  Button,
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
import { useUser, useLocalize } from "@/hooks";
import { useSelector } from "react-redux";
import { AuthenticationState, selectAppState } from "@/features/map/appSlice";
import { LoginButtons } from "@/components";

export default function Header() {
  const appState = useSelector(selectAppState);
  const __ = useLocalize();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group wrap="nowrap" justify="space-between" h="100%">
          <Link className={classes.logoLink} to={"/"}>
            <img
              src={new URL("logo.svg", import.meta.url)}
              alt="StreetCritic"
            />
          </Link>

          <Group h="100%" gap={0} visibleFrom="md">
            <Link to={"/"} className={classes.link}>
              Home
            </Link>

            <Link to={"about"} className={classes.link}>
              About
            </Link>

            <Link to={"sponsors"} className={classes.link}>
              Sponsors
            </Link>

            <Link to={"contact"} className={classes.link}>
              Contact
            </Link>
          </Group>

          <Group h="100%" wrap="nowrap">
            {appState.authState === AuthenticationState.Error && (
              <p>Authentication error</p>
            )}
            {appState.authState === AuthenticationState.Authenticating && (
              <Loader color="blue" size="sm" />
            )}
            {appState.authState === AuthenticationState.Authenticated && (
              <UserNavigation
                userName={appState.user?.name || ""}
                onLogout={() => user.signOut()}
              />
            )}
            {appState.authState === AuthenticationState.Unauthenticated && (
              <Group visibleFrom="sm">
                <LoginButtons />
              </Group>
            )}
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="md"
            />
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
          <Divider my="sm" />

          <Link to={""} className={classes.link} onClick={toggleDrawer}>
            Home
          </Link>
          <Link to={"about"} className={classes.link} onClick={toggleDrawer}>
            About
          </Link>
          <Link to={"sponsors"} className={classes.link} onClick={toggleDrawer}>
            Sponsors
          </Link>
          <Link to={"contact"} className={classes.link} onClick={toggleDrawer}>
            Contact
          </Link>

          <Divider my="sm" />

          <Stack align="flex-start" p="md">
            {appState.authState === AuthenticationState.Unauthenticated && (
              <LoginButtons />
            )}
          </Stack>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

"use client";
import { Link } from "react-router-dom";
import {
  Box,
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
import { useLocalize } from "@/hooks";
import { useSelector } from "react-redux";
import { AuthenticationState, selectAppState } from "@/features/map/appSlice";
import { register, signIn, signOut } from "@/auth";

export default function Header() {
  const appState = useSelector(selectAppState);
  const __ = useLocalize();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link to={"/"}>
            <img
              src={new URL("logo.svg", import.meta.url)}
              width={200}
              height={33}
              alt="StreetCritic"
            />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
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

          <Group visibleFrom="sm">
            {appState.authState === AuthenticationState.Error && (
              <p>Authentication error</p>
            )}
            {(appState.authState === AuthenticationState.Authenticating && (
              <Loader color="blue" size="sm" />
            )) ||
              (appState.authState === AuthenticationState.Authenticated && (
                <>
                  <UserNavigation
                    userName={appState.user?.name || ""}
                    onLogout={signOut}
                  />
                </>
              )) || (
                <>
                  <Button variant="default" onClick={signIn}>
                    {__("log-in")}
                  </Button>
                  <Button onClick={register}>{__("sign-up")}</Button>
                </>
              )}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
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

          {/* <Group justify="center" grow pb="xl" px="md">
              <Button variant="default">{__("log-in")}</Button>
              <Button>Sign up</Button>
              </Group> */}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

"use client";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";

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

export default function Header() {
  const auth = useAuth();
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
          </Group>

          <Group visibleFrom="sm">
            {auth.error && <p>Authentication error</p>}
            {(auth.isLoading && <Loader color="blue" size="sm" />) ||
              (auth.isAuthenticated && (
                <>
                  <UserNavigation
                    userName={auth.user?.profile.name || ""}
                    onLogout={() => void auth.signoutRedirect()}
                  />
                </>
              )) || (
                <>
                  <Button
                    variant="default"
                    onClick={() => void auth.signinRedirect()}
                  >
                    Log in
                  </Button>
                  <Button>Sign up</Button>
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
          <Divider my="sm" />

          {/* <Group justify="center" grow pb="xl" px="md">
              <Button variant="default">Log in</Button>
              <Button>Sign up</Button>
              </Group> */}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

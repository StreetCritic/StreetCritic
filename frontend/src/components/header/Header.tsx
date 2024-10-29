"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "react-oidc-context";

import {
  Box,
  Drawer,
  Button,
  UnstyledButton,
  Text,
  ThemeIcon,
  Divider,
  Burger,
  ScrollArea,
  Loader,
  Group,
  rem,
  useMantineTheme,
} from "@mantine/core";
/* import { MantineLogo } from '@mantinex/mantine-logo'; */
import { useDisclosure } from "@mantine/hooks";
/* import {
 *   IconNotification,
 *   IconCode,
 *   IconBook,
 *   IconChartPie3,
 *   IconFingerprint,
 *   IconCoin,
 *   IconChevronDown,
 * } from '@tabler/icons-react'; */
import classes from "./Header.module.css";

import UserNavigation from "./UserNavigation";

const mockdata = [
  {
    /* icon: IconCode, */
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
];

export default function Header() {
  const auth = useAuth();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          {/* <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} /> */}
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/">
            <Image src="/logo.svg" width={200} height={33} alt="StreetCritic" />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>

            <Link href="/about" className={classes.link}>
              About
            </Link>

            <Link href="/sponsors" className={classes.link}>
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

          <Link href="/" className={classes.link} onClick={toggleDrawer}>
            Home
          </Link>
          <Link href="/about" className={classes.link} onClick={toggleDrawer}>
            About
          </Link>
          <Link
            href="/sponsors"
            className={classes.link}
            onClick={toggleDrawer}
          >
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

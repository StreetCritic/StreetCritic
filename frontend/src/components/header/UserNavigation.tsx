import cx from "clsx";
import { useState } from "react";
import { Avatar, UnstyledButton, Group, Text, Menu } from "@mantine/core";

import { CaretDown, SignOut } from "@phosphor-icons/react";

import classes from "./UserNavigation.module.css";

type Props = {
  userName: string;
  onLogout: () => void;
};

export default function UserNavigation({ userName, onLogout }: Props) {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group gap={7} wrap="nowrap">
            <Avatar alt={userName} radius="xl" size={32} />
            <Text fw={500} visibleFrom="sm" size="sm" lh={1} mr={3}>
              {userName}
            </Text>
            <CaretDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<SignOut size={16} />} onClick={onLogout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

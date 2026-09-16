import { ActionIcon, Menu } from "@mantine/core";
import { CheckIcon, GlobeIcon } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router";

import { LOCALE_NAMES, SUPPORTED_LOCALES } from "@/features/i18n";
import { useLocale, useLocalize } from "@/hooks";

/**
 * Lets the user pick the UI language from a dropdown.
 *
 * Picking one navigates to the current page with an explicit `lang` parameter.
 */
export default function LanguageSwitcher() {
  const __ = useLocalize();
  const locale = useLocale();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const switchTo = (target: string) => {
    if (target === locale) {
      return;
    }
    const params = new URLSearchParams(search);
    params.set("lang", target);
    navigate({ pathname, search: `?${params}` });
  };

  return (
    <Menu
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      // The drawer this also renders in sits at z-index 1000000, and the
      // dropdown is portalled out of it.
      zIndex={1000001}
    >
      <Menu.Target>
        <ActionIcon
          variant="default"
          size="lg"
          aria-label={__("switch-language")}
        >
          <GlobeIcon size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{__("switch-language")}</Menu.Label>
        {SUPPORTED_LOCALES.map((supported) => (
          <Menu.Item
            key={supported}
            lang={supported}
            rightSection={
              supported === locale ? <CheckIcon size={14} /> : undefined
            }
            onClick={() => switchTo(supported)}
          >
            {LOCALE_NAMES[supported]}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

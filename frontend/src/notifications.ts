import { notifications } from "@mantine/notifications";

type Props = {
  title: string;
  message: string;
  type: "warning" | "error" | "success";
};

const cfg = {
  warning: {
    color: "red",
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
};

/**
 * Shows a notification.
 */
export function showNotification({ title, message, type }: Props) {
  notifications.show({
    title,
    message,
    position: "bottom-center",
    ...cfg[type],
  });
}

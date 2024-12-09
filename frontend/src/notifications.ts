import { notifications } from "@mantine/notifications";

type Props = {
  title: string;
  message: string;
  type: "warning";
};

const cfg = {
  warning: {
    color: "red",
  },
};

export function showNotification({ title, message, type }: Props) {
  notifications.show({
    title,
    message,
    position: "bottom-center",
    ...cfg[type],
  });
}

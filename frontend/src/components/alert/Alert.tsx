import { useLocalize } from "@/hooks";
import { Alert as MAlert } from "@mantine/core";
import { Info, WarningCircle } from "@phosphor-icons/react";

type Props = {
  title?: string;
  type: "success" | "error";
  children: React.ReactNode;
};

const cfg = {
  success: {
    color: "green",
    icon: <Info size={32} />,
  },
  error: {
    color: "red",
    icon: <WarningCircle size={32} />,
  },
};

/**
 * An alert box.
 */
export default function Alert({ type, title, children }: Props) {
  const __ = useLocalize();
  return (
    <MAlert
      my="md"
      variant="light"
      {...cfg[type]}
      title={title}
      closeButtonLabel={__("dismiss")}
    >
      {children}
    </MAlert>
  );
}

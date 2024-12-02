import { Group, Modal } from "@mantine/core";
import { Text, LoginButtons } from "@/components";
import { useLocalize } from "@/hooks";

type Props = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: Props) {
  const __ = useLocalize();
  return (
    <Modal
      opened
      title={__("authentication-required")}
      onClose={onClose}
      withCloseButton={true}
    >
      <Text>{__("please-login-first")}</Text>
      <Group>
        <LoginButtons />
      </Group>
    </Modal>
  );
}

import { useLocalize } from "@/hooks";
import { Text as MText, TextProps } from "@mantine/core";

type Props = {
  children?: React.ReactNode;
  size?: TextProps["size"];
  /**
   * Use localized text with this id as content.
   */
  msgId?: string;
};

export default function Text({ size, children, msgId }: Props) {
  const __ = useLocalize();
  return (
    <MText mb="md" size={size}>
      {msgId ? __(msgId) : children}
    </MText>
  );
}

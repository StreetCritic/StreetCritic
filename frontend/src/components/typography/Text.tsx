import { useLocalize } from "@/hooks";
import { Text as MText, TextProps } from "@mantine/core";

type Props = {
  children?: React.ReactNode;
  size?: TextProps["size"];
  /**
   * Use localized text with this id as content.
   */
  id?: string;
};

export default function Text({ size, children, id }: Props) {
  const __ = useLocalize();
  return (
    <MText mb="md" size={size}>
      {id ? __(id) : children}
    </MText>
  );
}

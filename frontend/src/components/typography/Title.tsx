import { useLocalize } from "@/hooks";
import { Title as MTitle, TitleOrder, TitleSize } from "@mantine/core";

type Props = {
  order?: TitleOrder;
  size?: TitleSize;
  children?: React.ReactNode;
  /**
   * Use localized text with this id as content.
   */
  msgId?: string;
};

export default function Title({ order, size, children, msgId }: Props) {
  const __ = useLocalize();
  const actualOrder = order || 1;
  return (
    <MTitle
      order={actualOrder}
      c={actualOrder === 1 ? "gray.9" : undefined}
      ta={actualOrder === 1 ? "center" : undefined}
      pt={actualOrder === 1 ? "lg" : undefined}
      size={size}
      mb="md"
    >
      {msgId ? __(msgId) : children}
    </MTitle>
  );
}

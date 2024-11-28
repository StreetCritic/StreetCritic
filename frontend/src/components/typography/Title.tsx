import { Title as MTitle, TitleOrder, TitleSize } from "@mantine/core";

type Props = {
  order?: TitleOrder;
  size?: TitleSize;
  children: React.ReactNode;
};

export default function Title({ order, size, children }: Props) {
  return (
    <MTitle order={order || 1} size={size} mb="md">
      {children}
    </MTitle>
  );
}

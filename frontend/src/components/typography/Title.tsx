import { Title as MTitle, TitleOrder } from "@mantine/core";

type Props = {
  order: TitleOrder;
  children: React.ReactNode;
};

export default function Title({ order, children }: Props) {
  return (
    <MTitle order={order} mb="md">
      {children}
    </MTitle>
  );
}

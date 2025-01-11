import { Text as MText, TextProps } from "@mantine/core";

type Props = {
  children: React.ReactNode;
  size?: TextProps["size"];
};

export default function Text({ size, children }: Props) {
  return (
    <MText mb="md" size={size}>
      {children}
    </MText>
  );
}

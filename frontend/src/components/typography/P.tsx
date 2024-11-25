import Text from "./Text";

type Props = {
  children: React.ReactNode;
};

// @deprecated
export default function P({ children }: Props) {
  return <Text>{children}</Text>;
}

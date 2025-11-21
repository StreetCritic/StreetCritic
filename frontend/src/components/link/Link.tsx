import { Anchor } from "@mantine/core";
import { useNavigate } from "react-router";

type Props = {
  /** Link target. */
  to: string;
  children: React.ReactNode;
  size?: string;
};

/** A link with client side routing. */
export default function Link({ to, children, size }: Props) {
  const navigate = useNavigate();
  return (
    <Anchor size={size} onClick={() => navigate(to)}>
      {children}
    </Anchor>
  );
}

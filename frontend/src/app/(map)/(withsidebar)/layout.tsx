import { Sidebar } from "@/components/map-app";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <Sidebar>{children}</Sidebar>;
}

import { useContext } from "react";
import SidebarContext from "./context";

type Props = {
  hideWhenFolded?: boolean;
  children: React.ReactNode;
};

export default function SidebarContent({ hideWhenFolded, children }: Props) {
  const sidebarContext = useContext(SidebarContext);
  if (hideWhenFolded && sidebarContext.folded) {
    return;
  }
  return children;
}

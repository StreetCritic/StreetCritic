import { useLocalize } from "@/hooks";
import { SidebarContent } from "@/components";
import { Box } from "@mantine/core";
import Directions from "./Directions";
import WayPoints from "./WayPoints";

export default function RoutingSidebar() {
  const __ = useLocalize();
  return (
    <Box p="sm">
      <SidebarContent hideWhenFolded>
        <WayPoints />
      </SidebarContent>
      <Directions />
    </Box>
  );
}

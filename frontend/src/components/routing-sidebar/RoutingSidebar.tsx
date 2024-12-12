import { useLocalize } from "@/hooks";
import { Title, Text, Alert } from "@/components";
import { TrafficSign } from "@phosphor-icons/react";
import { Group } from "@mantine/core";
import Directions from "./Directions";
import WayPoints from "./WayPoints";

export default function RoutingSidebar() {
  const __ = useLocalize();
  return (
    <div>
      <Title order={2}>
        <Group>
          <TrafficSign size={32} />
          {__("routing-title")}
        </Group>
      </Title>
      <Text>{__("routing-intro")}</Text>
      <WayPoints />
      <Alert type="experimental">{__("routing-experimental")}</Alert>
      <Directions />
    </div>
  );
}

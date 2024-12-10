import { useLocalize } from "@/hooks";
import { H2, P, Alert } from "@/components";
import { TrafficSign } from "@phosphor-icons/react";
import { Group } from "@mantine/core";

export default function RoutingSidebar() {
  const __ = useLocalize();
  return (
    <div>
      <H2>
        <Group>
          <TrafficSign size={32} />
          {__("routing-title")}
        </Group>
      </H2>
      <P>{__("routing-intro")}</P>
      <Alert type="experimental">{__("routing-experimental")}</Alert>
    </div>
  );
}

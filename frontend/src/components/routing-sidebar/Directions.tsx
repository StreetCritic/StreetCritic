import { useLocalize } from "@/hooks";
import { Title } from "@/components";
import { Card, Group } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectDirectionsState } from "@/features/map/directionsSlice";
import { Ruler, Timer } from "@phosphor-icons/react";

export default function Directions() {
  const __ = useLocalize();
  const directionsState = useSelector(selectDirectionsState);

  if (directionsState.directions === null) {
    return;
  }

  const minutes = Math.round(directionsState.directions.duration / 60);
  const hours = Math.floor(minutes / 60);
  const restMinutes = Math.round(minutes % 60);

  return (
    <Card shadow="xs">
      <Title order={3}>{__("routing-calculated-route")}</Title>
      <Group>
        <Group>
          <Ruler size={20} />
          {Math.round(directionsState.directions.distance * 10) / 10} km
        </Group>
        <Group>
          <Timer size={20} />
          {hours && `${hours} h`} {restMinutes || "0"} min
        </Group>
      </Group>
    </Card>
  );
}

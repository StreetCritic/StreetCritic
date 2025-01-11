import WayPoint from "./WayPoint";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  ArrowsDownUp,
  Trash,
  DotsSixVertical,
  Plus,
  Gps,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMapState,
  stopAdded,
  stopChanged,
  stopReordered,
  stopRemoved,
  stopsResetted,
  stopsReversed,
  enabledCurrentPositionAsStart,
} from "@/features/map/mapSlice";
import { ActionIcon, Stack, Group, Tooltip, Flex } from "@mantine/core";

import cx from "clsx";
import classes from "./WayPoints.module.css";
import { useLocalize } from "@/hooks";

export default function WayPoints() {
  const mapState = useSelector(selectMapState);
  const dispatch = useDispatch();
  const __ = useLocalize();

  const items = mapState.stops.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={String(item.id)}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <DotsSixVertical size={32} />
          </div>
          <Flex wrap="nowrap" w="100%" align="flex-end" gap="xs">
            <WayPoint
              isLocatedPosition={index == 0 && mapState.currentPositionAsStart}
              stop={item}
              label={
                index == 0
                  ? __("way-points-from")
                  : index == mapState.stops.length - 1
                    ? __("way-points-to")
                    : __("way-points-via")
              }
              setStop={({ lng, lat }) =>
                dispatch(stopChanged({ index, lng, lat, inactive: false }))
              }
            />
            {index == 0 && (
              <ActionIcon
                variant="default"
                disabled={mapState.currentPositionAsStart}
                aria-label="Reset"
                onClick={() => dispatch(enabledCurrentPositionAsStart())}
              >
                <Tooltip label="Use my position as start">
                  <Gps size={24} />
                </Tooltip>
              </ActionIcon>
            )}
            <ActionIcon
              disabled={mapState.stops.length <= 2}
              variant="default"
              aria-label="Reset"
              onClick={() => dispatch(stopRemoved(index))}
            >
              <Tooltip label="Reset">
                <Trash size={24} />
              </Tooltip>
            </ActionIcon>
          </Flex>
        </div>
      )}
    </Draggable>
  ));

  return (
    <Stack className={classes.root}>
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          dispatch(
            stopReordered({ from: source.index, to: destination?.index || 0 }),
          )
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Group justify="flex-end">
        <ActionIcon
          variant="default"
          aria-label="Add Waypoint"
          onClick={() =>
            dispatch(
              stopAdded({
                lng: 0,
                lat: 0,
                inactive: true,
              }),
            )
          }
        >
          <Tooltip label="Add Waypoint">
            <Plus size={24} />
          </Tooltip>
        </ActionIcon>
        <ActionIcon
          variant="default"
          aria-label="Reverse direction"
          disabled={mapState.stops.filter((stop) => !stop.inactive).length == 0}
          onClick={() => dispatch(stopsReversed())}
        >
          <Tooltip label="Reverse direction">
            <ArrowsDownUp size={24} />
          </Tooltip>
        </ActionIcon>
        <ActionIcon
          variant="default"
          aria-label="Reset"
          onClick={() => dispatch(stopsResetted())}
        >
          <Tooltip label="Reset">
            <Trash size={24} />
          </Tooltip>
        </ActionIcon>
      </Group>
    </Stack>
  );
}

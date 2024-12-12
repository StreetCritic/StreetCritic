import WayPoint from "./WayPoint";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  ArrowsDownUp,
  Trash,
  DotsSixVertical,
  Plus,
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
} from "@/features/map/mapSlice";
import { ActionIcon, Stack, Group, Tooltip } from "@mantine/core";

import cx from "clsx";
import classes from "./WayPoints.module.css";

export default function WayPoints() {
  const mapState = useSelector(selectMapState);

  const dispatch = useDispatch();

  console.log("mapState", mapState.stops);

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
          <Group wrap="nowrap">
            <WayPoint
              stop={item}
              setStop={({ lng, lat }) =>
                dispatch(stopChanged({ index, lng, lat, inactive: false }))
              }
            />
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
          </Group>
        </div>
      )}
    </Draggable>
  ));

  return (
    <Stack>
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

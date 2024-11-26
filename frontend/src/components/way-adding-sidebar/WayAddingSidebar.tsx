import { Route } from "ibre";
import { useLocalize } from "@/hooks";
import { H2, P } from "@/components/typography";
import { useDispatch } from "react-redux";
import { switchedToBrowsing } from "@/features/map/appSlice";
import { Button, Flex } from "@mantine/core";

type Props = {
  segments: Route | null;
  onAddClick: () => void;
};

export default function WayAddingSidebar({ segments, onAddClick }: Props) {
  const __ = useLocalize();
  const dispatch = useDispatch();
  return (
    <div>
      <H2>{__("add-way-title")}</H2>
      <P>{__("add-way-intro")}</P>
      <Flex gap="md" align="center" justify="space-between">
        {segments && (
          <Button onClick={() => onAddClick()}>{__("continue")}</Button>
        )}
        <Button color="red" onClick={() => dispatch(switchedToBrowsing())}>
          {__("abort")}
        </Button>
      </Flex>
    </div>
  );
}

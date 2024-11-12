import { Route } from "ibre";
import { PlusCircle } from "@phosphor-icons/react";
import useLocalize from "@/hooks/useLocalized";
import { H2, P } from "@/components/typography";
import { useDispatch } from "react-redux";
import { switchedToBrowsing } from "@/features/map/appSlice";
import Button from "@/components/button";
import { Button as MButton, Flex } from "@mantine/core";

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
          <Button
            label="Add this way"
            icon={<PlusCircle size={32} />}
            onClick={() => onAddClick()}
          />
        )}
        <MButton color="red" onClick={() => dispatch(switchedToBrowsing())}>
          {__("abort")}
        </MButton>
      </Flex>
    </div>
  );
}

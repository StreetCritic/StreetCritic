import { Route } from "ibre";
import Button from "@/components/button";
import { PlusCircle } from "@phosphor-icons/react";
import useLocalize from "@/hooks/useLocalized";
import { H2, P } from "@/components/typography";

type Props = {
  segments: Route | null;
  onAddClick: () => void;
};

export default function WayAddingSidebar({ segments, onAddClick }: Props) {
  const __ = useLocalize();
  return (
    <div>
      <H2>{__("add-way-title")}</H2>
      <P>{__("add-way-intro")}</P>
      {segments && (
        <Button
          label="Add this way"
          icon={<PlusCircle size={32} />}
          onClick={() => onAddClick()}
        />
      )}
    </div>
  );
}

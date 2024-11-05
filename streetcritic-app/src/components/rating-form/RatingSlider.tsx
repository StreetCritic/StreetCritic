import { Slider } from "@mantine/core";
import { Heart, HeartBreak } from "@phosphor-icons/react";

const styles = {
  root: { width: "100%" },
  thumb: { borderWidth: 2, height: 26, width: 26, padding: 3 },
};

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function RatingSlider({ value, onChange }: Props) {
  const icon = value < 50 ? <HeartBreak size={32} /> : <Heart size={32} />;
  return (
    <>
      <Slider
        thumbChildren={icon}
        color="red"
        label={null}
        value={value}
        onChange={onChange}
        labelAlwaysOn
        step={10}
        size="xl"
        styles={styles}
        thumbSize={32}
        marks={[
          { value: 0, label: "0" },
          { value: 10, label: "1" },
          { value: 20, label: "2" },
          { value: 30, label: "3" },
          { value: 40, label: "4" },
          { value: 50, label: "5" },
          { value: 60, label: "6" },
          { value: 70, label: "7" },
          { value: 80, label: "8" },
          { value: 90, label: "9" },
          { value: 100, label: "10" },
        ]}
      />
    </>
  );
}

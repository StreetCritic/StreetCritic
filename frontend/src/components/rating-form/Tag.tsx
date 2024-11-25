import { ThumbsDown, ThumbsUp } from "@phosphor-icons/react";
import cx from "clsx";
import styles from "./Tag.module.css";

export enum State {
  Neutral,
  Positive,
  Negative,
}

type Props = {
  onStateChange: (newState: State) => void;
  children: React.ReactNode;
  state: State;
};

export default function Tag({ children, state, onStateChange }: Props) {
  const onPositive = () =>
    onStateChange(state === State.Positive ? State.Neutral : State.Positive);
  const onNegative = () =>
    onStateChange(state === State.Negative ? State.Neutral : State.Negative);
  return (
    <div
      className={cx(styles.root, {
        [styles.positive]: state === State.Positive,
        [styles.negative]: state === State.Negative,
      })}
    >
      <button type="button" onClick={() => onStateChange(State.Neutral)}>
        {children}
      </button>
      <button type="button" onClick={onPositive}>
        <ThumbsUp weight="duotone" size={20} />
      </button>
      <button type="button" onClick={onNegative}>
        <ThumbsDown weight="duotone" size={20} />
      </button>
    </div>
  );
}

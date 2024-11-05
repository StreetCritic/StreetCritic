import { ReactNode } from "react";
import styles from "./Container.module.css";
import classNames from "clsx";

type Props = {
  className?: string;
  children?: ReactNode;
};

export default function Container({ className, children }: Props) {
  return <div className={classNames(className, styles.root)}>{children}</div>;
}

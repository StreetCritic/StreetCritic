import { Link } from "react-router";

import classes from "./LogoLink.module.css";

type Props = {
  /** Called when link is clicked. */
  onClick?: () => void;
};

export default function LogoLink({ onClick }: Props) {
  return (
    <Link className={classes.root} to={"/"} onClick={onClick}>
      <img src={new URL("logo.svg", import.meta.url).href} alt="StreetCritic" />
    </Link>
  );
}

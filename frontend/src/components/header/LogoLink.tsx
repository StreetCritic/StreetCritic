import { Link } from "react-router";
import logoURL from "./logo.svg";

import classes from "./LogoLink.module.css";

type Props = {
  /** Called when link is clicked. */
  onClick?: () => void;
};

export default function LogoLink({ onClick }: Props) {
  return (
    <Link className={classes.root} to={"/"} onClick={onClick}>
      <img src={logoURL} alt="StreetCritic" />
    </Link>
  );
}

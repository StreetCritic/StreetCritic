import { Link } from "react-router-dom";

import classes from "./LogoLink.module.css";

export default function LogoLink() {
  return (
    <Link className={classes.root} to={"/"}>
      <img src={new URL("logo.svg", import.meta.url).href} alt="StreetCritic" />
    </Link>
  );
}

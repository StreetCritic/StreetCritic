import "./globals.css";
import "@mantine/core/styles.css";

import App from "@/components/app";
import { Outlet } from "react-router-dom";

/* import { ColorSchemeScript } from "@mantine/core"; */

/* export const metadata: Metadata = {
*   title: "StreetCritic",
*   description: "We collect subjective data about traffic routes.",
* };
*  */

export default function Root() {
  return (
    <App><Outlet/></App>
  );
}

/* head:        <ColorSchemeScript /> */

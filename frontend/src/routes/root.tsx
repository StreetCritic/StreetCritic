import { Outlet } from "react-router";

import { useUser } from "@/hooks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/* import { ColorSchemeScript } from "@mantine/core"; */

/* export const metadata: Metadata = {
 *   title: "StreetCritic",
 *   description: "We collect subjective data about traffic routes.",
 * };
 *  */

export default function Root() {
  const user = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      user.initAuth(dispatch);
    })();
  }, [user, dispatch]);
  return <Outlet />;
}

/* head:        <ColorSchemeScript /> */

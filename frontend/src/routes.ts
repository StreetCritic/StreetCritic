import { type RouteConfig, index, route } from "@react-router/dev/routes";
export default [
  route("/", "routes/root.tsx", [
    index("routes/map.tsx"),
    route("login", "routes/login.tsx"),
    route("way/:wayId?/:waySlug?", "routes/way.tsx"),
    route("user/:username", "routes/user.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
] satisfies RouteConfig;

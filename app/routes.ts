// Route-to-file mapping: index (/) uses home (Counter page); well-known path is a resource route that returns 404.

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(
    ".well-known/appspecific/com.chrome.devtools.json",
    "routes/well-known.chrome-devtools.ts"
  ),
] satisfies RouteConfig;

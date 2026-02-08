// Chrome DevTools sometimes requests this URL. Resource route (no UI) returns 404 so the app does not throw "No route matches."

import type { Route } from "./+types/well-known.chrome-devtools";

export async function loader({}: Route.LoaderArgs) {
  return new Response(null, { status: 404 });
}

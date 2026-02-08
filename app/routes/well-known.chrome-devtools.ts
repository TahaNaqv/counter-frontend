import type { Route } from "./+types/well-known.chrome-devtools";

export async function loader({}: Route.LoaderArgs) {
  return new Response(null, { status: 404 });
}

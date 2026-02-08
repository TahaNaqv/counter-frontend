// This route renders the Counter page at the site root (/).

import type { Route } from "./+types/home";
import { CounterPage } from "../components/CounterPage";

// Sets document title and description for the page.
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Counter - Devnet" },
    { name: "description", content: "Solana counter program on Devnet" },
  ];
}

// Home screen is the Counter page.
export default function Home() {
  return <CounterPage />;
}

import type { Route } from "./+types/home";
import { CounterPage } from "../components/CounterPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Counter - Devnet" },
    { name: "description", content: "Solana counter program on Devnet" },
  ];
}

export default function Home() {
  return <CounterPage />;
}

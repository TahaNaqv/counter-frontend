// RPC and program IDs used by the rest of the app.

// Solana RPC URL (e.g. devnet). VITE_* env vars are inlined at build time by Vite; fallback for local/dev.
export const ENDPOINT =
  import.meta.env.VITE_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

// Must match the deployed program (and the program's declare_id! in Rust). Same env fallback.
export const COUNTER_PROGRAM_ID =
  import.meta.env.VITE_COUNTER_PROGRAM_ID ??
  "42auxsnfr5yGL6kj1jWD7dWuwYU1CHYkfNgtW2yPuX3A";

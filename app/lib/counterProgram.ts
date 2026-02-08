import type { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import type { Wallet } from "@coral-xyz/anchor";
import idl from "../idl/counter_program.json";
import type { CounterProgram } from "../types/counter_program";
import { COUNTER_PROGRAM_ID } from "./constants";

const programId = new PublicKey(COUNTER_PROGRAM_ID);

export function getCounterPda(
  walletPublicKey: PublicKey,
  programIdKey: PublicKey = programId
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), walletPublicKey.toBuffer()],
    programIdKey
  );
  return pda;
}

export function getCounterProgram(
  connection: Connection,
  wallet: Wallet
): Program<CounterProgram> {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(idl as unknown as CounterProgram, provider);
}

export async function fetchCounter(
  program: Program<CounterProgram>,
  counterPda: PublicKey
): Promise<{ count: { toNumber: () => number } } | null> {
  return program.account.counter.fetchNullable(counterPda);
}

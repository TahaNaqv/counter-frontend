/**
 * Creates the Anchor program client, derives the counter PDA, and fetches counter account data.
 * Depends on the IDL (generated from the Rust program) and constants.
 */

import type { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import type { Wallet } from "@coral-xyz/anchor";
import idl from "../idl/counter_program.json";
import type { CounterProgram } from "../types/counter_program";
import { COUNTER_PROGRAM_ID } from "./constants";

const programId = new PublicKey(COUNTER_PROGRAM_ID);

/** PDA is deterministic from seeds; seeds must match the program (["counter", user]). Returns same address the program uses. */
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

/** AnchorProvider = connection + wallet for signing. Program is built from IDL (program ID from idl.address); used to send transactions. */
export function getCounterProgram(
  connection: Connection,
  wallet: Wallet
): Program<CounterProgram> {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(idl as unknown as CounterProgram, provider);
}

/** Reads the counter account at the PDA. fetchNullable returns null if the account does not exist yet (not initialized). */
export async function fetchCounter(
  program: Program<CounterProgram>,
  counterPda: PublicKey
): Promise<{ count: { toNumber: () => number } } | null> {
  return program.account.counter.fetchNullable(counterPda);
}

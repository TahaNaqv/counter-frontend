/**
 * Main UI: connect wallet, show count or "Not initialized", and buttons to initialize / increment / decrement / reset / close.
 * Uses useConnection, useWallet, and the counter program client.
 */

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import type { Wallet } from "@coral-xyz/anchor";
import {
  getCounterPda,
  getCounterProgram,
  fetchCounter,
} from "../lib/counterProgram";
import { ClientOnly } from "./ClientOnly";

export function CounterPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txPending, setTxPending] = useState(false);
  // connection = RPC; wallet = connect state + publicKey + adapter; count = current value or null if not initialized; loading/error/txPending = UI state.

  // Get Anchor wallet adapter, build program client, derive user's counter PDA, fetch; set count or null (not initialized); handle errors.
  const loadCount = async () => {
    if (!wallet.publicKey) return;
    setLoading(true);
    setError(null);
    try {
      const anchorWallet = wallet.wallet?.adapter as unknown as Wallet;
      const program = getCounterProgram(connection, anchorWallet);
      const counterPda = getCounterPda(wallet.publicKey);
      const data = await fetchCounter(program, counterPda);
      setCount(data ? data.count.toNumber() : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch counter");
      setCount(null);
    } finally {
      setLoading(false);
    }
  };

  // Load count when wallet is connected; clear state when disconnected. Depends on wallet.connected and wallet.publicKey.
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      loadCount();
    } else {
      setCount(null);
      setError(null);
    }
  }, [wallet.connected, wallet.publicKey?.toBase58()]);

  // Run an instruction (e.g. initialize, increment), then refetch count; set txPending and handle errors.
  const runAction = async (action: () => Promise<string>) => {
    if (!wallet.publicKey) return;
    setTxPending(true);
    setError(null);
    try {
      await action();
      await loadCount();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setTxPending(false);
    }
  };

  // Not connected: show connect prompt and WalletMultiButton (wrapped in ClientOnly for hydration).
  if (!wallet.connected || !wallet.publicKey) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Counter (Devnet)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your wallet to use the counter.
        </p>
        <ClientOnly>
          <WalletMultiButton />
        </ClientOnly>
      </main>
    );
  }

  // Adapter not ready yet right after connect; show short message.
  if (!wallet.wallet?.adapter) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
        <p className="text-gray-600 dark:text-gray-400">
          Wallet adapter not ready.
        </p>
      </main>
    );
  }

  const anchorWallet = wallet.wallet.adapter as unknown as Wallet;
  const program = getCounterProgram(connection, anchorWallet);
  const counterPda = getCounterPda(wallet.publicKey);

  // Connected: wallet button, loading/error, count display, action buttons.
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Counter (Devnet)
      </h1>

      <div className="flex items-center gap-4">
        <ClientOnly>
          <WalletMultiButton />
        </ClientOnly>
      </div>

      {loading && (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      )}

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm max-w-md text-center">
          {error}
        </p>
      )}

      {!loading && (
        <div className="text-4xl font-mono text-gray-900 dark:text-gray-100">
          {count !== null ? count : "Not initialized"}
        </div>
      )}

      {!loading && (
        <div className="flex flex-wrap gap-3 justify-center">
          {/* Initialize: only when count is null. +1 / -1 / Reset / Close: only when counter exists. All disabled while txPending. */}
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={txPending || count !== null}
            onClick={() => runAction(() => program.methods.initialize().rpc())}
          >
            Initialize
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={txPending || count === null}
            onClick={() => runAction(() => program.methods.increment().rpc())}
          >
            +1
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={txPending || count === null}
            onClick={() => runAction(() => program.methods.decrement().rpc())}
          >
            -1
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={txPending || count === null}
            onClick={() => runAction(() => program.methods.reset().rpc())}
          >
            Reset
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={txPending || count === null}
            onClick={() => runAction(() => program.methods.close().rpc())}
          >
            Close
          </button>
        </div>
      )}
    </main>
  );
}
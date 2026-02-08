import { useEffect, useState } from "react";

/**
 * Renders children only after mount to avoid SSR/client hydration mismatch.
 * We use mounted so server and first client render match; after hydration we show real content.
 * Placeholder matches the wallet button size/style to avoid layout shift.
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="wallet-adapter-button wallet-adapter-button-trigger"
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        Select Wallet
      </button>
    );
  }

  return <>{children}</>;
}

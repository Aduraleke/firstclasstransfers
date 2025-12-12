// lib/payments/mypos.ts
export type MyPOSCheckoutConfig = {
  isSandbox: boolean;
  sid: string;
  clientNumber: string;
  keyIndex: number;
  privateKeyPEM: string;
  currency?: string;
  okUrl?: string;
  cancelUrl?: string;
  notifyUrl?: string;
};

export async function loadMyPOSFactory(): Promise<unknown> {
  // dynamic import to avoid require() and to keep this server-only
  const mod = await import("@mypos-ltd/mypos");
  // the package may export default or named; prefer default if present
  return (mod && (mod.default ?? mod));
}

/**
 * Build a configuration object for the myPOS SDK.
 * Throws if required env vars are missing.
 */
export function buildCheckoutConfig(overrides?: Partial<MyPOSCheckoutConfig>) {
  const sid = overrides?.sid ?? process.env.MYPOS_SID;
  const clientNumber = overrides?.clientNumber ?? process.env.MYPOS_CLIENT_NUMBER;
  const keyIndex = overrides?.keyIndex ?? Number(process.env.MYPOS_KEY_INDEX || 1);
  const privateKeyPEM = overrides?.privateKeyPEM ?? process.env.MYPOS_PRIVATE_KEY;

  const missing: string[] = [];
  if (!sid) missing.push("MYPOS_SID");
  if (!clientNumber) missing.push("MYPOS_CLIENT_NUMBER");
  if (!privateKeyPEM) missing.push("MYPOS_PRIVATE_KEY");
  if (missing.length) {
    throw new Error(`Missing myPOS env/config: ${missing.join(", ")}`);
  }

  return {
    isSandbox: overrides?.isSandbox ?? ((process.env.MYPOS_IS_SANDBOX || "true") === "true"),
    logLevel: "error",
    checkout: {
      sid,
      lang: "EN",
      currency: overrides?.currency ?? process.env.MYPOS_CURRENCY ?? "EUR",
      clientNumber,
      okUrl: overrides?.okUrl ?? process.env.MYPOS_OK_URL ?? "",
      cancelUrl: overrides?.cancelUrl ?? process.env.MYPOS_CANCEL_URL ?? "",
      notifyUtr: overrides?.notifyUrl ?? process.env.MYPOS_NOTIFY_URL ?? "",
      keyIndex: Number(keyIndex),
      privateKey: privateKeyPEM,
    },
  };
}

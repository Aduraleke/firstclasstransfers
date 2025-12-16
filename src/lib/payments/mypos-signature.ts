import crypto from "crypto";

/**
 * myPOS IPC v1.4 signature
 * RULES:
 * - VALUES ONLY
 * - "-" separator
 * - Base64 encode
 * - RSA-SHA256
 * - ORDER IS CRITICAL
 */

const SIGNATURE_ORDER = [
  "IPCmethod",
  "IPCVersion",
  "IPCLanguage",
  "SID",
  "WalletNumber",
  "Amount",
  "Currency",
  "OrderID",
  "URL_OK",
  "URL_Cancel",
  "URL_Notify",
  "KeyIndex",
] as const;


function normalizeKey(key?: string): string {
  if (!key) throw new Error("Missing myPOS RSA key");
  return key.replace(/\\n/g, "\n");
}

export function signMyPOS(
  fields: Record<string, string | number>
): string {
  if (!process.env.MYPOS_PRIVATE_KEY) {
    throw new Error("MYPOS_PRIVATE_KEY missing");
  }

  const values: string[] = [];

  for (const key of SIGNATURE_ORDER) {
    if (fields[key] !== undefined && fields[key] !== "") {
      values.push(String(fields[key]));
    }
  }

  const raw = values.join("-");

  // 🔴 DEBUG — THIS IS WHAT YOU WANT
  console.log("myPOS SIGN STRING:", raw);

  const base64 = Buffer.from(raw).toString("base64");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(base64);
  signer.end();

  return signer.sign(
    normalizeKey(process.env.MYPOS_PRIVATE_KEY),
    "base64"
  );
}

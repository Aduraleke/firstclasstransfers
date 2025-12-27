import crypto from "crypto";

/**
 * myPOS IPC v1.4 signature
 * RULES:
 * - VALUES ONLY
 * - "-" separator
 * - Base64 encode
 * - RSA-SHA256
 * - ORDER IS CRITICAL
 * 
 * ⚠️  IMPORTANT: This order MUST match the myPOS IPC v1.4 specification exactly.
 * All form fields (except Signature itself) must be included in the signature.
 * DO NOT modify this order or remove fields without consulting the official documentation:
 * https://developers.mypos.com/en/doc/online_payments/v1_4/167-ipcpurchase
 * 
 * UDF1 is optional and handled separately (inserted before KeyIndex when present)
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
  "PaymentParametersRequired",
  "CustomerEmail",
  "CustomerPhone",
  "CartItems",
  "Article_1",
  "Quantity_1",
  "Price_1",
  "Currency_1",
  "Amount_1",
  // UDF1 is inserted here dynamically when present (before KeyIndex)
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

  // Add all required fields in order (except UDF1 and KeyIndex)
  // Note: Empty strings are included as they are explicitly set in the form
  for (const key of SIGNATURE_ORDER) {
    if (key === "KeyIndex") {
      // KeyIndex is added after UDF1 (if present)
      break;
    }
    if (fields[key] !== undefined) {
      values.push(String(fields[key]));
    }
  }

  // Add optional UDF1 before KeyIndex (per myPOS spec)
  if (fields.UDF1 !== undefined) {
    values.push(String(fields.UDF1));
  }

  // Add KeyIndex last
  if (fields.KeyIndex !== undefined) {
    values.push(String(fields.KeyIndex));
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

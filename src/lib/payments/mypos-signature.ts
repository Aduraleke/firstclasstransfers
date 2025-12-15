import crypto from "crypto";

/**
 * myPOS signature rules:
 * 1. Concatenate VALUES ONLY
 * 2. Use "-" separator
 * 3. Base64 encode
 * 4. RSA-SHA256 sign
 *
 * ⚠️ ORDER MATTERS — MUST BE FIXED
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
  "KeyIndex",
  "UDF1", // include ONLY if present
];

function normalizeKey(key?: string): string {
  if (!key) throw new Error("Missing RSA key");
  return key.replace(/\\n/g, "\n");
}

export function signMyPOS(
  fields: Record<string, string | number>
): string {
  const values: string[] = [];

  for (const key of SIGNATURE_ORDER) {
    if (fields[key] !== undefined) {
      values.push(String(fields[key]));
    }
  }

  const raw = values.join("-");
  const base64 = Buffer.from(raw).toString("base64");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(base64);
  signer.end();

  return signer.sign(
    normalizeKey(process.env.MYPOS_PRIVATE_KEY),
    "base64"
  );
}

export function verifyMyPOSSignature(
  data: Record<string, string>
): boolean {
  const signature = data.Signature;
  if (!signature) return false;

  const fields = { ...data };
  delete fields.Signature;

  const values: string[] = [];

  for (const key of SIGNATURE_ORDER) {
    if (fields[key] !== undefined) {
      values.push(String(fields[key]));
    }
  }

  const raw = values.join("-");
  const base64 = Buffer.from(raw).toString("base64");

  return crypto.verify(
    "RSA-SHA256",
    Buffer.from(base64),
    normalizeKey(process.env.MYPOS_PUBLIC_CERT),
    Buffer.from(signature, "base64")
  );
}

import crypto from "crypto";

/**
 * myPOS signature rules:
 * 1. Concatenate VALUES ONLY
 * 2. Use "-" separator
 * 3. Base64 encode
 * 4. RSA-SHA256 sign
 */
export function signMyPOS(
  fields: Record<string, string | number>
): string {
  const raw = Object.values(fields).join("-");
  const base64 = Buffer.from(raw).toString("base64");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(base64);

  return signer.sign(process.env.MYPOS_PRIVATE_KEY!, "base64");
}

export function verifyMyPOSSignature(
  data: Record<string, string>
): boolean {
  const signature = data.Signature;
  if (!signature) return false;

  const fields = { ...data };
  delete fields.Signature;

  const raw = Object.values(fields).join("-");
  const base64 = Buffer.from(raw).toString("base64");

  return crypto.verify(
    "RSA-SHA256",
    Buffer.from(base64),
    process.env.MYPOS_PUBLIC_CERT!,
    Buffer.from(signature, "base64")
  );
}

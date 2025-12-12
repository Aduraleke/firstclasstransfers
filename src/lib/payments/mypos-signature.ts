import crypto from "crypto";

export function verifyMyPOSSignature(data: Record<string, string>): boolean {
  const signature = data.signature;
  if (!signature) return false;

  const cert = process.env.MYPOS_PUBLIC_CERT;
  if (!cert) throw new Error("Missing MYPOS_PUBLIC_CERT");

  const fields = { ...data };
  delete fields.signature;

  const payload = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("&");

  return crypto.verify(
    "RSA-SHA256",
    Buffer.from(payload),
    cert,
    Buffer.from(signature, "base64")
  );
}

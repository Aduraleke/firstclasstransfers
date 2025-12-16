import { signMyPOS } from "./mypos-signature";

type Params = {
  orderId: string;
  amount: number;
  currency: "EUR";
  customerEmail: string;
  customerPhone?: string;
  udf1?: string;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function buildMyPOSFormHTML(params: Params): string {

  console.log("env check", {
    isServer: typeof window === "undefined",
    sidPresent: !!process.env.MYPOS_SID,
    walletPresent: !!process.env.MYPOS_WALLET_NUMBER,
    sidLen: process.env.MYPOS_SID?.length,
    walletLen: process.env.MYPOS_WALLET_NUMBER?.length,
  });

  const isSandbox = process.env.MYPOS_SANDBOX === "true";

  const actionUrl = isSandbox
    ? "https://www.mypos.eu/vmp/checkout-test"
    : "https://www.mypos.eu/vmp/checkout";

    console.log("MYPOS_WALLET_NUMBER at runtime:", process.env.MYPOS_WALLET_NUMBER);

  const fields: Record<string, string | number> = {
    IPCmethod: "IPCPurchase",
    IPCVersion: "1.4",
    IPCLanguage: "EN",

    SID: requireEnv("MYPOS_SID"),
    WalletNumber: requireEnv("MYPOS_WALLET_NUMBER"),

  Amount: params.amount.toFixed(2),
  Currency: "EUR",
  OrderID: params.orderId,

  URL_OK: process.env.MYPOS_OK_URL!,
  URL_Cancel: process.env.MYPOS_CANCEL_URL!,
  URL_Notify: process.env.MYPOS_NOTIFY_URL!,

  KeyIndex: process.env.MYPOS_KEY_INDEX!,
};

  if (params.udf1) {
    fields.UDF1 = params.udf1;
  }

  // SIGNATURE MUST BE LAST
  fields.Signature = signMyPOS(fields);

  const inputs = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<input type="hidden" name="${k}" value="${String(v)}" />`
    )
    .join("\n");

    console.log(fields);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Redirecting to secure payment…</title>
</head>
<body onload="document.forms[0].submit()">
  <form method="POST" action="${actionUrl}">
    ${inputs}
  </form>
  <p style="text-align:center">Redirecting to secure payment…</p>
</body>
</html>`;
}

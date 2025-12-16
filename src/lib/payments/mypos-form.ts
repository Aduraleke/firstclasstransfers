import { signMyPOS } from "./mypos-signature";

type Params = {
  orderId: string;
  amount: number;
  currency: "EUR";
  customerEmail: string;
  customerPhone?: string;
  udf1?: string;
};

export function buildMyPOSFormHTML(params: Params): string {
  const isSandbox =
    process.env.MYPOS_SANDBOX === "true"
      ? true
      : process.env.MYPOS_SANDBOX === "false"
      ? false
      : (() => {
          throw new Error("MYPOS_SANDBOX must be 'true' or 'false'");
        })();

  const actionUrl = isSandbox
    ? "https://www.mypos.eu/vmp/checkout-test"
    : "https://www.mypos.eu/vmp/checkout";

const fields = {
  IPCmethod: "IPCPurchase",
  IPCVersion: "1.4",
  IPCLanguage: "EN",

  SID: process.env.MYPOS_SID!,
  WalletNumber: process.env.MYPOS_WALLET_NUMBER!,

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

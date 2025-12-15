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

  const isSandbox = process.env.MYPOS_SANDBOX === "true";

  const actionUrl = isSandbox
    ? "https://www.mypos.eu/vmp/checkout-test"
    : "https://www.mypos.eu/vmp/checkout";

  const fields: Record<string, string | number> = {
    IPCmethod: "IPCPurchase",
    IPCVersion: "1.4",
    IPCLanguage: "EN",

    SID: process.env.MYPOS_SID!,
    WalletNumber: process.env.MYPOS_WALLET_NUMBER!,

    Amount: params.amount.toFixed(2),
    Currency: params.currency,
    OrderID: params.orderId,

    URL_OK: process.env.MYPOS_OK_URL!,
    URL_Cancel: process.env.MYPOS_CANCEL_URL!,
    URL_Notify: process.env.MYPOS_NOTIFY_URL!,

    PaymentParametersRequired: 3,

    CustomerEmail: params.customerEmail,
    CustomerPhone: params.customerPhone ?? "",

    CartItems: 1,
    Article_1: "Airport Transfer",
    Quantity_1: 1,
    Price_1: params.amount.toFixed(2),
    Currency_1: params.currency,
    Amount_1: params.amount.toFixed(2),

    KeyIndex: process.env.MYPOS_KEY_INDEX!,
  };

  if (params.udf1) {
    fields.UDF1 = params.udf1;
  }

  // 🔐 Signature MUST be last
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

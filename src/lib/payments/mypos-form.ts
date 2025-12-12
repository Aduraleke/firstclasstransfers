import crypto from "crypto";

type MyPOSFormParams = {
  orderId: string;
  amount: number;
  currency: "EUR";
  customerEmail: string;
  customerPhone?: string;
};

export function buildMyPOSFormHTML(params: MyPOSFormParams): string {
  const fields: Record<string, string | number> = {
    IPCmethod: "IPCPurchase",
    IPCVersion: "1.4",
    IPCLanguage: "EN",

    SID: process.env.MYPOS_SID!,
    walletnumber: process.env.MYPOS_CLIENT_NUMBER!,

    Amount: params.amount,
    Currency: params.currency,
    OrderID: params.orderId,

    URL_OK: process.env.MYPOS_OK_URL!,
    URL_Cancel: process.env.MYPOS_CANCEL_URL!,

    customeremail: params.customerEmail,
    customerphone: params.customerPhone ?? "",

    CartItems: 1,
    Article_1: "Airport Transfer",
    Quantity_1: 1,
    Price_1: params.amount,
    Currency_1: params.currency,
    Amount_1: params.amount,

    KeyIndex: Number(process.env.MYPOS_KEY_INDEX),
    PaymentMethod: 1,
    PaymentParametersRequired: 0,
  };

  // 🔐 Signature (RSA-SHA256)
  const signString = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("&");

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signString)
    .sign(process.env.MYPOS_PRIVATE_KEY!, "base64");

  fields.Signature = signature;

  // 🔁 Build auto-submit form
  const inputs = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<input type="hidden" name="${k}" value="${String(v)}" />`
    )
    .join("\n");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Redirecting to secure payment…</title>
</head>
<body onload="document.forms[0].submit()">
  <form method="POST" action="https://www.mypos.com/vmp/checkout">
    ${inputs}
  </form>
  <p style="text-align:center">Redirecting to secure payment…</p>
</body>
</html>
`;
}
